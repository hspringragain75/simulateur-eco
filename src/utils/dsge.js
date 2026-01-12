// Moteur de simulation DSGE (Dynamic Stochastic General Equilibrium) simplifié
// Inspiré de Smets & Wouters (2007) et des modèles de la BCE/FED

import { SECTEURS, MATRICE_IO, ELASTICITES_SUBSTITUTION_TRAVAIL } from '../data/secteurs';
import { DONNEES_BASE } from '../data/modeles';

/**
 * DSGE Core - Résolution d'équilibre général dynamique
 * 
 * Équations principales :
 * 1. Ménages : max U(C,L) s.t. budget
 * 2. Entreprises : max π s.t. technologie CES
 * 3. Équilibre : offre = demande sur tous les marchés
 * 4. Dynamique : anticipations rationnelles
 */

export class DSGEEngine {
  constructor(params) {
    this.params = {
      beta: 0.99,              // Taux d'escompte psychologique
      sigma: 1.5,              // Aversion au risque (EIS inverse)
      phi: 1.0,                // Frisch elasticity (offre de travail)
      alpha: 0.35,             // Part du capital dans la production
      delta: 0.025,            // Taux de dépréciation du capital (2.5%/trimestre)
      rho: 0.8,                // Persistance des chocs
      theta: 0.75,             // Rigidité des prix (Calvo)
      epsilon: 6,              // Élasticité de substitution (markup)
      ...params
    };
    
    this.state = this.initializeState();
    this.shocks = [];
  }

  initializeState() {
    return {
      // Variables d'état par secteur
      secteurs: Object.keys(SECTEURS).reduce((acc, key) => {
        acc[key] = {
          production: SECTEURS[key].valeurAjoutee,
          emploi: SECTEURS[key].emplois,
          capital: SECTEURS[key].valeurAjoutee * SECTEURS[key].intensiteCapital,
          salaire: SECTEURS[key].masseSalariale / SECTEURS[key].emplois,
          prix: 1.0,
          productivite: 1.0
        };
        return acc;
      }, {}),
      
      // Agrégats
      PIB: DONNEES_BASE.pib,
      consommation: DONNEES_BASE.pib * 0.54,
      investissement: DONNEES_BASE.pib * 0.23,
      exportations: DONNEES_BASE.pib * 0.32,
      importations: DONNEES_BASE.pib * 0.35,
      
      // Marché du travail
      emploiTotal: DONNEES_BASE.emploi.total,
      tauxChomage: DONNEES_BASE.tauxChomage,
      salaireReel: DONNEES_BASE.salaireMedian,
      
      // Prix et taux
      inflation: DONNEES_BASE.inflation.actuelle,
      tauxInteret: 0.025,
      tauxChange: 1.0,
      
      // Anticipations
      anticipations: {
        inflation: DONNEES_BASE.inflation.actuelle,
        croissance: 0.015,
        salaires: 0.02
      }
    };
  }

  /**
   * Simule un choc économique (ex: hausse SMIC)
   * @param {Object} shock - Description du choc
   * @param {number} periods - Nombre de périodes de simulation
   * @returns {Array} Trajectoire temporelle
   */
  simulateShock(shock, periods = 40) {
    const trajectory = [{ ...this.state, period: 0 }];
    
    // Appliquer le choc initial
    this.applyShock(shock);
    
    // Simuler la dynamique sur plusieurs périodes
    for (let t = 1; t <= periods; t++) {
      this.updateAnticipations(shock, t);
      this.solveEquilibrium(t);
      this.updateState(t);
      
      trajectory.push({
        ...JSON.parse(JSON.stringify(this.state)),
        period: t
      });
    }
    
    return trajectory;
  }

  /**
   * Applique un choc exogène au système
   */
  applyShock(shock) {
    switch (shock.type) {
      case 'wage_shock':
        this.applyWageShock(shock);
        break;
      case 'hours_shock':
        this.applyHoursShock(shock);
        break;
      case 'tax_shock':
        this.applyTaxShock(shock);
        break;
      default:
        throw new Error(`Unknown shock type: ${shock.type}`);
    }
  }

  /**
   * Choc salarial (ex: hausse SMIC)
   */
  applyWageShock(shock) {
    const { increase, affectedShare } = shock;
    
    Object.keys(SECTEURS).forEach(secteur => {
      const partAffectee = this.getAffectedShare(secteur, shock);
      const oldWage = this.state.secteurs[secteur].salaire;
      
      // Hausse directe pour les travailleurs concernés
      const newWage = oldWage * (1 + increase * partAffectee);
      this.state.secteurs[secteur].salaire = newWage;
      
      // Anticipation d'une diffusion progressive
      this.state.anticipations.salaires = increase * 0.3; // 30% de diffusion
    });
  }

  /**
   * Calcule la part des emplois affectés par secteur
   */
  getAffectedShare(secteur, shock) {
    // Dépend du type de choc et de la structure sectorielle
    const basePart = shock.affectedShare || 0.1;
    
    // Ajuster selon la part de SMIC dans le secteur
    if (shock.type === 'wage_shock' && shock.targetGroup === 'low_wage') {
      const { PART_SMIC_PAR_SECTEUR } = require('../data/secteurs');
      return PART_SMIC_PAR_SECTEUR[secteur] || basePart;
    }
    
    return basePart;
  }

  /**
   * Mise à jour des anticipations (forward-looking)
   */
  updateAnticipations(shock, period) {
    const { rho } = this.params;
    
    // Anticipations d'inflation (Phillips curve expectations-augmented)
    const outputGap = (this.state.PIB - DONNEES_BASE.pib) / DONNEES_BASE.pib;
    this.state.anticipations.inflation = 
      rho * this.state.anticipations.inflation + 
      (1 - rho) * (this.state.inflation + 0.5 * outputGap);
    
    // Anticipations de croissance
    this.state.anticipations.croissance = 
      rho * this.state.anticipations.croissance +
      (1 - rho) * 0.015; // Retour vers tendance
  }

  /**
   * Résout l'équilibre général (offre = demande)
   */
  solveEquilibrium(period) {
    const maxIterations = 50;
    const tolerance = 1e-4;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      // 1. Calcul de la production optimale des entreprises
      this.solveProduction();
      
      // 2. Calcul de la demande de travail
      this.solveLaborDemand();
      
      // 3. Calcul de l'offre de travail (ménages)
      this.solveLaborSupply();
      
      // 4. Calcul des prix
      this.solvePrices();
      
      // 5. Calcul de la demande agrégée
      this.solveAggregateDemand();
      
      // 6. Vérifier la convergence
      if (this.checkConvergence(tolerance)) {
        break;
      }
    }
    
    // 7. Calcul des effets inter-sectoriels (Input-Output)
    this.propagateIO();
  }

  /**
   * Production optimale des entreprises (CES)
   */
  solveProduction() {
    Object.keys(SECTEURS).forEach(secteur => {
      const s = this.state.secteurs[secteur];
      const params = SECTEURS[secteur];
      const { alpha } = this.params;
      
      // Fonction de production CES : Y = A * [α*K^ρ + (1-α)*L^ρ]^(1/ρ)
      // Simplifié en Cobb-Douglas : Y = A * K^α * L^(1-α)
      const K = s.capital;
      const L = s.emploi;
      const A = s.productivite;
      
      s.production = A * Math.pow(K, alpha) * Math.pow(L, 1 - alpha);
    });
  }

  /**
   * Demande de travail (CPO des entreprises)
   */
  solveLaborDemand() {
    Object.keys(SECTEURS).forEach(secteur => {
      const s = this.state.secteurs[secteur];
      const params = SECTEURS[secteur];
      const { alpha } = this.params;
      
      // CPO : w = (1-α) * Y/L * P
      // => L_demande = [(1-α) * Y * P / w]
      
      const marginalProduct = (1 - alpha) * s.production / s.emploi;
      const realWage = s.salaire / s.prix;
      
      // Élasticité de demande de travail
      const elasticity = -params.sensibiliteCout;
      
      const wageChange = (realWage / (SECTEURS[secteur].masseSalariale / SECTEURS[secteur].emplois)) - 1;
      const laborDemandChange = elasticity * wageChange;
      
      s.emploi = SECTEURS[secteur].emplois * (1 + laborDemandChange);
    });
  }

  /**
   * Offre de travail (ménages)
   */
  solveLaborSupply() {
    const { phi, sigma } = this.params;
    
    // Offre de travail dépend du salaire réel et de la consommation
    // CPO : w/P = φ * L^(1/φ) * C^σ
    
    const totalLabor = Object.values(this.state.secteurs)
      .reduce((sum, s) => sum + s.emploi, 0);
    
    this.state.emploiTotal = totalLabor;
    this.state.tauxChomage = 1 - (totalLabor / (DONNEES_BASE.emploi.total * 1.05));
  }

  /**
   * Formation des prix (New Keynesian Phillips Curve)
   */
  solvePrices() {
    const { theta, epsilon, beta } = this.params;
    
    Object.keys(SECTEURS).forEach(secteur => {
      const s = this.state.secteurs[secteur];
      
      // NKPC : π_t = β*E_t[π_{t+1}] + κ*mc_t
      // où κ = (1-θ)(1-βθ)/θ et mc = coût marginal
      
      const kappa = (1 - theta) * (1 - beta * theta) / theta;
      
      // Coût marginal = salaire / productivité marginale
      const marginalCost = s.salaire / (s.production / s.emploi);
      const markup = epsilon / (epsilon - 1);
      
      // Prix optimal = markup * coût marginal
      const optimalPrice = markup * marginalCost;
      
      // Ajustement partiel (rigidité)
      s.prix = theta * s.prix + (1 - theta) * optimalPrice;
    });
    
    // Inflation agrégée
    const priceLevel = Object.values(this.state.secteurs)
      .reduce((sum, s) => sum + s.prix * SECTEURS[Object.keys(this.state.secteurs).find(k => this.state.secteurs[k] === s)].valeurAjoutee, 0) 
      / DONNEES_BASE.pib;
    
    this.state.inflation = (priceLevel / (this.previousPriceLevel || 1)) - 1;
    this.previousPriceLevel = priceLevel;
  }

  /**
   * Demande agrégée (Y = C + I + G + NX)
   */
  solveAggregateDemand() {
    const { sigma, beta } = this.params;
    
    // Consommation (Euler equation)
    const realInterest = this.state.tauxInteret - this.state.anticipations.inflation;
    const consGrowth = (1 / sigma) * (beta * (1 + realInterest) - 1);
    this.state.consommation *= (1 + consGrowth);
    
    // Investissement (Tobin's Q)
    const investGrowth = 0.5 * (this.state.anticipations.croissance - realInterest);
    this.state.investissement *= (1 + investGrowth);
    
    // Exportations (compétitivité)
    const competitiveness = -0.8 * this.state.inflation; // Élasticité-prix
    this.state.exportations *= (1 + competitiveness);
    
    // Importations (demande intérieure)
    const importElasticity = 1.2;
    const domesticDemandGrowth = (this.state.consommation + this.state.investissement) / (DONNEES_BASE.pib * 0.77) - 1;
    this.state.importations *= (1 + importElasticity * domesticDemandGrowth);
    
    // PIB
    this.state.PIB = this.state.consommation + this.state.investissement + 
                     this.state.exportations - this.state.importations +
                     DONNEES_BASE.pib * 0.23; // Dépenses publiques (stable)
  }

  /**
   * Propagation inter-sectorielle (modèle Input-Output de Leontief)
   */
  propagateIO() {
    // Calcul de l'inverse de Leontief : X = (I - A)^(-1) * Y
    // où A est la matrice des coefficients techniques
    
    const n = Object.keys(SECTEURS).length;
    const sectors = Object.keys(SECTEURS);
    
    // Demande finale par secteur
    const finalDemand = sectors.map(s => this.state.secteurs[s].production * 0.6); // Simplifié
    
    // Calcul itératif des effets indirects
    const iterations = 10;
    for (let iter = 0; iter < iterations; iter++) {
      sectors.forEach((secteurI, i) => {
        let indirectDemand = 0;
        
        sectors.forEach((secteurJ, j) => {
          // Demande du secteur J au secteur I
          const coefficient = MATRICE_IO[secteurI]?.[secteurJ] || 0;
          indirectDemand += coefficient * this.state.secteurs[secteurJ].production;
        });
        
        // Mise à jour de la production
        this.state.secteurs[secteurI].production = 
          0.7 * this.state.secteurs[secteurI].production + 
          0.3 * (finalDemand[i] + indirectDemand);
      });
    }
  }

  /**
   * Vérifie la convergence de l'équilibre
   */
  checkConvergence(tolerance) {
    // Vérifier que offre = demande sur tous les marchés
    const supplyDemandGap = Math.abs(this.state.PIB - 
      (this.state.consommation + this.state.investissement + 
       this.state.exportations - this.state.importations + DONNEES_BASE.pib * 0.23));
    
    return supplyDemandGap / this.state.PIB < tolerance;
  }

  /**
   * Mise à jour de l'état pour la période suivante
   */
  updateState(period) {
    const { delta } = this.params;
    
    // Accumulation du capital
    Object.keys(SECTEURS).forEach(secteur => {
      const s = this.state.secteurs[secteur];
      const investShare = SECTEURS[secteur].valeurAjoutee / DONNEES_BASE.pib;
      
      s.capital = (1 - delta) * s.capital + investShare * this.state.investissement;
    });
    
    // Évolution de la productivité (tendance + cycle)
    Object.keys(SECTEURS).forEach(secteur => {
      this.state.secteurs[secteur].productivite *= (1 + 0.004 + 0.002 * Math.random());
    });
  }
}

/**
 * Calcul des effets de substituabilité entre types de travailleurs
 */
export function calculateSubstitutionEffects(shock, secteur) {
  const { STRUCTURE_AGE, STRUCTURE_QUALIFICATION } = require('../data/secteurs');
  
  const effects = {
    jeunes: 0,
    seniors: 0,
    qualifies: 0,
    nonQualifies: 0
  };
  
  // Si le choc affecte principalement les jeunes/non-qualifiés (ex: SMIC)
  if (shock.targetGroup === 'low_wage') {
    // Élasticité de substitution jeunes/seniors
    const ageStructure = STRUCTURE_AGE[secteur];
    const sigma_age = ELASTICITES_SUBSTITUTION_TRAVAIL.jeunesSeniors;
    
    // Hausse relative du coût des jeunes => substitution vers seniors
    effects.jeunes = -shock.increase * sigma_age * ageStructure.jeunes;
    effects.seniors = shock.increase * sigma_age * ageStructure.jeunes * 0.5;
    
    // Élasticité de substitution qualifiés/non-qualifiés
    const qualifStructure = STRUCTURE_QUALIFICATION[secteur];
    const sigma_qual = ELASTICITES_SUBSTITUTION_TRAVAIL.qualifiesNonQualifies;
    
    effects.nonQualifies = -shock.increase * sigma_qual * qualifStructure.nonQualifies;
    effects.qualifies = shock.increase * sigma_qual * qualifStructure.nonQualifies * 0.4;
  }
  
  return effects;
}

/**
 * Modélise les effets de seuil (non-linéarités)
 */
export function applyThresholdEffects(value, thresholds) {
  // Fonction sigmoïde pour modéliser les effets de seuil
  // Ex : au-delà d'une certaine hausse, effets explosifs
  
  let adjustedValue = value;
  
  thresholds.forEach(({ level, multiplier, steepness = 5 }) => {
    if (Math.abs(value) > level) {
      // Fonction sigmoïde : 1 / (1 + e^(-k*(x-x0)))
      const excess = Math.abs(value) - level;
      const sigmoid = 1 / (1 + Math.exp(-steepness * excess));
      adjustedValue = value * (1 + (multiplier - 1) * sigmoid);
    }
  });
  
  return adjustedValue;
}

/**
 * Modélise les anticipations des agents (forward-looking)
 */
export function formAnticipations(currentState, shock, horizon) {
  const anticipations = {
    inflation: [],
    wages: [],
    employment: []
  };
  
  // Anticipations adaptatives + rationnelles (hybride)
  const adaptiveWeight = 0.4;
  const rationalWeight = 0.6;
  
  for (let h = 1; h <= horizon; h++) {
    // Composante adaptative : basée sur le passé
    const adaptiveInflation = currentState.inflation;
    
    // Composante rationnelle : comprendre le choc
    let rationalInflation = currentState.inflation;
    if (shock.type === 'wage_shock') {
      // Anticiper la transmission aux prix
      rationalInflation += shock.increase * 0.45 * Math.exp(-0.1 * h);
    }
    
    anticipations.inflation.push(
      adaptiveWeight * adaptiveInflation + rationalWeight * rationalInflation
    );
  }
  
  return anticipations;
}
