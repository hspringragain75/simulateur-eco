// Modèle Agent-Based (ABM) pour simuler les interactions micro
// Permet de capturer l'hétérogénéité des agents et les effets émergents

import { SECTEURS, STRUCTURE_AGE, STRUCTURE_QUALIFICATION, PART_SMIC_PAR_SECTEUR } from '../data/secteurs';

/**
 * Classe représentant un ménage
 */
export class Household {
  constructor(id, characteristics) {
    this.id = id;
    this.age = characteristics.age;
    this.qualification = characteristics.qualification;
    this.secteur = characteristics.secteur;
    this.salaire = characteristics.salaire;
    this.employe = true;
    this.epargne = characteristics.epargne || 0;
    this.consommation = 0;
    
    // Préférences hétérogènes
    this.propensionConsommer = this.calculatePropensity();
    this.elasticiteOffre = this.calculateLaborElasticity();
    this.aversionRisque = characteristics.aversionRisque || 2.0;
  }

  calculatePropensity() {
    // Propension marginale à consommer dépend de l'âge et du revenu
    let base = 0.85;
    
    // Jeunes : plus consommateurs
    if (this.age < 30) base += 0.05;
    
    // Seniors : plus épargnants
    if (this.age > 55) base -= 0.10;
    
    // Bas salaires : consomment tout
    if (this.salaire < 1500) base = 0.95;
    
    // Hauts salaires : épargnent plus
    if (this.salaire > 4000) base = 0.60;
    
    return base;
  }

  calculateLaborElasticity() {
    // Élasticité de l'offre de travail au salaire
    let elasticity = 0.3;
    
    // Jeunes : plus élastiques (mobilité)
    if (this.age < 35) elasticity = 0.5;
    
    // Seniors : moins élastiques (proche retraite)
    if (this.age > 55) elasticity = 0.1;
    
    return elasticity;
  }

  /**
   * Décision de consommation/épargne
   */
  decideConsumption(revenuDisponible, inflation, anticipations) {
    // Revenu permanent (lissage)
    const revenuPermanent = 0.7 * this.salaire + 0.3 * revenuDisponible;
    
    // Ajustement pour l'inflation anticipée
    const realIncome = revenuPermanent / (1 + anticipations.inflation);
    
    // Consommation optimale
    this.consommation = this.propensionConsommer * realIncome;
    this.epargne += (revenuDisponible - this.consommation);
    
    return this.consommation;
  }

  /**
   * Réaction à un changement de salaire
   */
  reactToWageChange(newWage, marketConditions) {
    const wageChange = (newWage - this.salaire) / this.salaire;
    
    // Décision de rester en emploi ou chercher ailleurs
    if (wageChange < -0.05 && marketConditions.tauxChomage < 0.08) {
      // Si baisse significative et marché favorable => chercher ailleurs
      this.searchProbability = 0.3;
    } else {
      this.searchProbability = 0.05; // Recherche normale
    }
    
    this.salaire = newWage;
    
    // Ajuster l'offre de travail
    const laborAdjustment = this.elasticiteOffre * wageChange;
    this.desiredHours = 35 * (1 + laborAdjustment);
    
    return {
      staysEmployed: Math.random() > this.searchProbability,
      desiredHours: this.desiredHours
    };
  }
}

/**
 * Classe représentant une entreprise
 */
export class Firm {
  constructor(id, characteristics) {
    this.id = id;
    this.secteur = characteristics.secteur;
    this.taille = characteristics.taille; // TPE, PME, GE
    this.production = characteristics.production;
    this.employes = characteristics.employes;
    this.capital = characteristics.capital;
    this.prix = 1.0;
    
    // Paramètres de production
    this.productivite = 1.0;
    this.flexibilite = this.calculateFlexibility();
    this.pouvoirMarche = this.calculateMarketPower();
  }

  calculateFlexibility() {
    // Grandes entreprises plus flexibles (peuvent automatiser)
    const flexMap = { TPE: 0.3, PME: 0.5, GE: 0.8 };
    return flexMap[this.taille] || 0.5;
  }

  calculateMarketPower() {
    // Pouvoir de marché (capacité à fixer les prix)
    const powerMap = { TPE: 0.2, PME: 0.4, GE: 0.7 };
    return powerMap[this.taille] || 0.4;
  }

  /**
   * Décision d'embauche face à un choc salarial
   */
  decideHiring(wageIncrease, anticipations) {
    // Calcul du coût marginal
    const marginalCost = this.calculateMarginalCost(wageIncrease);
    
    // Décision : embaucher, licencier, automatiser
    const decisions = {
      hiring: 0,
      firing: 0,
      automation: 0
    };
    
    // Si coût trop élevé et flexible => automatisation
    if (wageIncrease > 0.15 && this.flexibilite > 0.6) {
      decisions.automation = wageIncrease * this.flexibilite * 0.5;
      decisions.firing = wageIncrease * 0.3;
    }
    // Si coût modéré => ajustement emploi seulement
    else if (wageIncrease > 0.05) {
      const elasticite = -SECTEURS[this.secteur].sensibiliteCout;
      decisions.firing = elasticite * wageIncrease * this.employes.length;
    }
    
    // Anticipations de demande future
    if (anticipations.demande > 0.02) {
      decisions.hiring = anticipations.demande * this.employes.length * 0.5;
    }
    
    return decisions;
  }

  calculateMarginalCost(wageIncrease) {
    const { partSalairesVA } = SECTEURS[this.secteur];
    return partSalairesVA * wageIncrease;
  }

  /**
   * Décision de prix (forward-looking avec anticipations)
   */
  decidePricing(costIncrease, marketConditions, anticipations) {
    // Règle de pricing : markup sur coût marginal
    const markup = 1 + (this.pouvoirMarche * 0.3);
    const optimalPrice = markup * (1 + costIncrease);
    
    // Ajustement graduel (rigidité)
    const adjustmentSpeed = this.flexibilite;
    this.prix = this.prix * (1 - adjustmentSpeed) + optimalPrice * adjustmentSpeed;
    
    // Anticipations de la concurrence
    if (anticipations.concurrentsPrices) {
      // Si concurrents baissent, limiter la hausse
      this.prix = Math.min(this.prix, anticipations.concurrentsPrices * 1.05);
    }
    
    return this.prix;
  }

  /**
   * Investissement en capital (automatisation)
   */
  decideInvestment(shock, anticipations, tauxInteret) {
    // Q de Tobin : investir si rendement > coût du capital
    const expectedReturn = anticipations.croissance + this.productivite * 0.02;
    const capitalCost = tauxInteret + 0.03; // + prime de risque
    
    if (expectedReturn > capitalCost) {
      // Investissement en automatisation si coût du travail monte
      if (shock.type === 'wage_shock' && shock.increase > 0.1) {
        return shock.increase * this.capital * 0.15;
      }
      return this.capital * 0.05; // Investissement normal
    }
    
    return 0;
  }
}

/**
 * Moteur de simulation Agent-Based
 */
export class ABMEngine {
  constructor(nHouseholds = 10000, nFirms = 1000) {
    this.households = [];
    this.firms = [];
    
    this.initializeHouseholds(nHouseholds);
    this.initializeFirms(nFirms);
    
    this.marketConditions = {
      tauxChomage: 0.073,
      inflation: 0.025,
      salaireMoyen: 2091
    };
  }

  /**
   * Initialise la population de ménages
   */
  initializeHouseholds(n) {
    const secteurs = Object.keys(SECTEURS);
    
    for (let i = 0; i < n; i++) {
      // Choisir un secteur proportionnellement à l'emploi
      const secteur = this.randomSector(secteurs);
      
      // Caractéristiques tirées des distributions
      const age = this.sampleAge(secteur);
      const qualification = this.sampleQualification(secteur);
      const salaire = this.sampleWage(secteur, age, qualification);
      
      this.households.push(new Household(i, {
        age,
        qualification,
        secteur,
        salaire,
        epargne: salaire * 3 * Math.random(), // 0-3 mois de salaire
        aversionRisque: 1.5 + Math.random() * 1.0
      }));
    }
  }

  randomSector(secteurs) {
    const totalEmployment = Object.values(SECTEURS).reduce((s, sec) => s + sec.emplois, 0);
    const rand = Math.random() * totalEmployment;
    
    let cumul = 0;
    for (const secteur of secteurs) {
      cumul += SECTEURS[secteur].emplois;
      if (rand < cumul) return secteur;
    }
    return secteurs[0];
  }

  sampleAge(secteur) {
    const { jeunes, seniors } = STRUCTURE_AGE[secteur];
    const rand = Math.random();
    
    if (rand < jeunes) {
      return 20 + Math.random() * 10; // 20-30 ans
    } else if (rand < jeunes + seniors) {
      return 55 + Math.random() * 10; // 55-65 ans
    } else {
      return 30 + Math.random() * 25; // 30-55 ans
    }
  }

  sampleQualification(secteur) {
    const { nonQualifies, qualifies } = STRUCTURE_QUALIFICATION[secteur];
    const rand = Math.random();
    
    if (rand < nonQualifies) return 'non_qualifie';
    if (rand < nonQualifies + qualifies) return 'qualifie';
    return 'tres_qualifie';
  }

  sampleWage(secteur, age, qualification) {
    const baseSalary = SECTEURS[secteur].masseSalariale / SECTEURS[secteur].emplois / 12;
    
    let multiplier = 1.0;
    if (qualification === 'non_qualifie') multiplier = 0.8;
    if (qualification === 'tres_qualifie') multiplier = 1.6;
    
    // Expérience (âge)
    const experience = Math.max(0, age - 25);
    multiplier *= (1 + experience * 0.01); // +1% par an d'expérience
    
    return baseSalary * multiplier * (0.9 + Math.random() * 0.2);
  }

  /**
   * Initialise la population d'entreprises
   */
  initializeFirms(n) {
    const secteurs = Object.keys(SECTEURS);
    const tailleDistribution = { TPE: 0.6, PME: 0.3, GE: 0.1 };
    
    for (let i = 0; i < n; i++) {
      const secteur = this.randomSector(secteurs);
      const taille = this.sampleTaille(tailleDistribution);
      
      const employesMoyens = { TPE: 5, PME: 50, GE: 500 }[taille];
      
      this.firms.push(new Firm(i, {
        secteur,
        taille,
        production: SECTEURS[secteur].valeurAjoutee / (n * 0.1),
        employes: Array(employesMoyens).fill(null), // Simplifié
        capital: SECTEURS[secteur].valeurAjoutee * SECTEURS[secteur].intensiteCapital / (n * 0.1)
      }));
    }
  }

  sampleTaille(distribution) {
    const rand = Math.random();
    let cumul = 0;
    
    for (const [taille, prob] of Object.entries(distribution)) {
      cumul += prob;
      if (rand < cumul) return taille;
    }
    return 'PME';
  }

  /**
   * Simule un choc avec interactions micro
   */
  simulate(shock, periods = 20) {
    const trajectory = [];
    
    for (let t = 0; t < periods; t++) {
      // 1. Entreprises décident (anticipations forward-looking)
      const firmDecisions = this.firms.map(f => {
        const anticipations = this.formFirmAnticipations(f, shock, t);
        return {
          firm: f,
          hiring: f.decideHiring(shock.increase || 0, anticipations),
          pricing: f.decidePricing(shock.increase || 0, this.marketConditions, anticipations),
          investment: f.decideInvestment(shock, anticipations, 0.025)
        };
      });
      
      // 2. Matching emploi (résout le marché du travail)
      this.matchLaborMarket(firmDecisions);
      
      // 3. Ménages décident consommation
      const aggregateConsumption = this.households.reduce((sum, h) => {
        if (h.employe) {
          const anticipations = this.formHouseholdAnticipations(h, shock, t);
          return sum + h.decideConsumption(h.salaire, this.marketConditions.inflation, anticipations);
        }
        return sum;
      }, 0);
      
      // 4. Production agrégée
      const aggregateProduction = this.firms.reduce((sum, f) => sum + f.production, 0);
      
      // 5. Mise à jour des conditions de marché
      this.updateMarketConditions(firmDecisions, aggregateConsumption);
      
      // 6. Enregistrer l'état
      trajectory.push(this.getAggregateState(t));
    }
    
    return trajectory;
  }

  matchLaborMarket(firmDecisions) {
    // Matching simplifié entre offre et demande de travail
    let unemployed = this.households.filter(h => !h.employe);
    
    firmDecisions.forEach(decision => {
      const { hiring, firing } = decision.hiring;
      
      // Licenciements
      if (firing > 0) {
        const nFired = Math.min(Math.floor(firing), decision.firm.employes.length);
        // Marquer des ménages comme chômeurs
        for (let i = 0; i < nFired; i++) {
          const randomHousehold = this.households[Math.floor(Math.random() * this.households.length)];
          if (randomHousehold.employe && randomHousehold.secteur === decision.firm.secteur) {
            randomHousehold.employe = false;
          }
        }
      }
      
      // Embauches
      if (hiring > 0 && unemployed.length > 0) {
        const nHired = Math.min(Math.floor(hiring), unemployed.length);
        for (let i = 0; i < nHired; i++) {
          unemployed[i].employe = true;
          unemployed[i].secteur = decision.firm.secteur;
        }
        unemployed = unemployed.slice(nHired);
      }
    });
  }

  formFirmAnticipations(firm, shock, period) {
    // Anticipations forward-looking des entreprises
    return {
      demande: 0.015 * Math.exp(-0.1 * period), // Retour vers tendance
      croissance: 0.015,
      concurrentsPrices: 1.0 + shock.increase * 0.4 * (1 - period / 20)
    };
  }

  formHouseholdAnticipations(household, shock, period) {
    return {
      inflation: 0.025 + shock.increase * 0.3 * Math.exp(-0.15 * period),
      salaires: shock.increase * 0.2 * Math.exp(-0.1 * period),
      chomage: this.marketConditions.tauxChomage
    };
  }

  updateMarketConditions(firmDecisions, aggregateConsumption) {
    // Mise à jour taux de chômage
    const employed = this.households.filter(h => h.employe).length;
    this.marketConditions.tauxChomage = 1 - employed / this.households.length;
    
    // Mise à jour inflation
    const avgPrice = firmDecisions.reduce((s, d) => s + d.pricing, 0) / firmDecisions.length;
    this.marketConditions.inflation = (avgPrice / (this.previousAvgPrice || 1)) - 1;
    this.previousAvgPrice = avgPrice;
    
    // Mise à jour salaire moyen
    const totalWages = this.households.filter(h => h.employe).reduce((s, h) => s + h.salaire, 0);
    this.marketConditions.salaireMoyen = totalWages / employed;
  }

  getAggregateState(period) {
    const employed = this.households.filter(h => h.employe).length;
    const totalConsumption = this.households.reduce((s, h) => s + h.consommation, 0);
    const totalProduction = this.firms.reduce((s, f) => s + f.production, 0);
    
    return {
      period,
      emploi: employed,
      tauxChomage: this.marketConditions.tauxChomage,
      consommation: totalConsumption,
      production: totalProduction,
      salaireMoyen: this.marketConditions.salaireMoyen,
      inflation: this.marketConditions.inflation
    };
  }
}

/**
 * Interface pour combiner DSGE et ABM
 */
export function hybridSimulation(shock, periods) {
  // Niveau macro : DSGE
  const dsge = new DSGEEngine();
  const macroTrajectory = dsge.simulateShock(shock, periods);
  
  // Niveau micro : ABM
  const abm = new ABMEngine(5000, 500); // Populations réduites pour performance
  const microTrajectory = abm.simulate(shock, periods);
  
  // Combiner les deux perspectives
  return {
    macro: macroTrajectory,
    micro: microTrajectory,
    // Effets émergents : différences entre micro et macro
    emergentEffects: microTrajectory.map((m, i) => ({
      period: i,
      employmentGap: m.emploi - (macroTrajectory[i]?.emploiTotal || m.emploi),
      consumptionGap: m.consommation - (macroTrajectory[i]?.consommation || m.consommation)
    }))
  };
}
