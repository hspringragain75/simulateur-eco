import { SECTEURS, MATRICE_IO, ELASTICITES_SUBSTITUTION_TRAVAIL, STRUCTURE_AGE, STRUCTURE_QUALIFICATION } from '../data/secteurs';
import { DONNEES_BASE } from '../data/modeles';
import { DSGEEngine, calculateSubstitutionEffects, applyThresholdEffects, formAnticipations } from './dsge';
import { ABMEngine, hybridSimulation } from './abm';

/**
 * Calcul avancé pour le SMIC avec modèle DSGE complet
 */
export function calculerImpactSMICAvance(params) {
  const {
    smicHoraire,
    elasticiteEmploi,
    transmissionPrix,
    propensionConsommer,
    horizonTemporel,
    diffusionAutresSalaires,
    // Nouveaux paramètres avancés
    modeSimulation = 'dsge', // 'dsge', 'abm', ou 'hybrid'
    includeThresholds = true,
    includeAnticipations = true,
    includeSectoralEffects = true
  } = params;

  // 1. Préparer le choc
  const shock = {
    type: 'wage_shock',
    targetGroup: 'low_wage',
    increase: (smicHoraire - DONNEES_BASE.smic.horaireBrut) / DONNEES_BASE.smic.horaireBrut,
    affectedShare: 0.107, // 10.7% des salariés
    anticipatedByFirms: includeAnticipations,
    parameters: {
      elasticity: elasticiteEmploi,
      priceTransmission: transmissionPrix,
      wageDiffusion: diffusionAutresSalaires
    }
  };

  let results;

  // 2. Choisir le moteur de simulation
  if (modeSimulation === 'dsge') {
    results = runDSGESimulation(shock, horizonTemporel, params);
  } else if (modeSimulation === 'abm') {
    results = runABMSimulation(shock, horizonTemporel, params);
  } else {
    results = runHybridSimulation(shock, horizonTemporel, params);
  }

  // 3. Appliquer les effets de seuil si demandé
  if (includeThresholds) {
    results = applyThresholdsToResults(results, shock);
  }

  // 4. Calculer les effets sectoriels détaillés
  if (includeSectoralEffects) {
    results.secteurs = calculateDetailedSectoralEffects(shock, params);
  }

  // 5. Calculer les effets de substituabilité
  results.substitution = calculateAggregatedSubstitutionEffects(shock);

  // 6. Effets Input-Output (propagation inter-sectorielle)
  results.inputOutput = calculateInputOutputEffects(results.secteurs);

  // 7. Boucles de rétroaction
  results.feedbackLoops = calculateFeedbackLoops(results, horizonTemporel);

  return results;
}

/**
 * Simulation DSGE complète
 */
function runDSGESimulation(shock, periods, params) {
  const dsge = new DSGEEngine({
    beta: 0.99,
    sigma: params.aversionRisque || 1.5,
    phi: params.elasticiteOffreTravail || 1.0,
    theta: 0.75, // Rigidité des prix
    epsilon: 6
  });

  const trajectory = dsge.simulateShock(shock, periods * 4); // Trimestres

  // Agréger les résultats trimestriels en annuels
  const annualResults = aggregateToAnnual(trajectory, periods);

  // Extraire les métriques finales
  const finalState = annualResults[annualResults.length - 1];

  return {
    emploi: {
      absolu: finalState.emploiTotal - DONNEES_BASE.emploi.total,
      pourcent: ((finalState.emploiTotal - DONNEES_BASE.emploi.total) / DONNEES_BASE.emploi.total) * 100,
      parSecteur: extractSectoralEmployment(finalState),
      trajectory: annualResults.map(s => ({
        period: s.period / 4,
        emploi: s.emploiTotal
      }))
    },

    pouvoirAchat: {
      basRevenus: calculateRealWageGrowth(finalState, 'low'),
      revenusMoyens: calculateRealWageGrowth(finalState, 'medium'),
      hautsRevenus: calculateRealWageGrowth(finalState, 'high'),
      trajectory: annualResults.map(s => ({
        period: s.period / 4,
        realWage: s.salaireReel
      }))
    },

    inflation: {
      supplementaire: (finalState.inflation - DONNEES_BASE.inflation.actuelle) * 100,
      totale: finalState.inflation * 100,
      trajectory: annualResults.map(s => ({
        period: s.period / 4,
        inflation: s.inflation * 100
      }))
    },

    pib: {
      variation: ((finalState.PIB - DONNEES_BASE.pib) / DONNEES_BASE.pib) * 100,
      valeur: finalState.PIB / 1e9,
      composantes: {
        consommation: finalState.consommation / 1e9,
        investissement: finalState.investissement / 1e9,
        exportations: finalState.exportations / 1e9,
        importations: finalState.importations / 1e9
      }
    },

    anticipations: finalState.anticipations,
    rawTrajectory: annualResults
  };
}

/**
 * Simulation Agent-Based
 */
function runABMSimulation(shock, periods, params) {
  const abm = new ABMEngine(10000, 1000);
  const trajectory = abm.simulate(shock, periods);

  const finalState = trajectory[trajectory.length - 1];

  return {
    emploi: {
      absolu: finalState.emploi - DONNEES_BASE.emploi.total,
      pourcent: ((finalState.emploi - DONNEES_BASE.emploi.total) / DONNEES_BASE.emploi.total) * 100,
      trajectory: trajectory.map((s, i) => ({
        period: i,
        emploi: s.emploi
      }))
    },

    pouvoirAchat: {
      basRevenus: ((finalState.salaireMoyen - DONNEES_BASE.salaireMedian) / DONNEES_BASE.salaireMedian) * 100,
      distribution: calculateWageDistribution(abm.households)
    },

    inflation: {
      supplementaire: finalState.inflation * 100,
      totale: (DONNEES_BASE.inflation.actuelle + finalState.inflation) * 100
    },

    heterogeneite: {
      parAge: calculateAgeEffects(abm.households),
      parQualification: calculateQualificationEffects(abm.households),
      parSecteur: calculateSectorEffects(abm.households)
    },

    effetsEmergents: {
      segregation: calculateSegregationIndex(abm.households),
      mobilite: calculateMobilityRate(abm.households),
      inequality: calculateGiniCoefficient(abm.households)
    }
  };
}

/**
 * Simulation hybride (DSGE macro + ABM micro)
 */
function runHybridSimulation(shock, periods, params) {
  const results = hybridSimulation(shock, periods);

  return {
    ...runDSGESimulation(shock, periods, params),
    microFoundations: results.micro,
    emergentEffects: results.emergentEffects,
    aggregationBias: calculateAggregationBias(results)
  };
}

/**
 * Calcule les effets sectoriels détaillés
 */
function calculateDetailedSectoralEffects(shock, params) {
  const secteurs = {};

  Object.keys(SECTEURS).forEach(secteurKey => {
    const secteur = SECTEURS[secteurKey];

    // Impact direct sur le secteur
    const directImpact = shock.increase * secteur.partSalairesVA * secteur.sensibiliteCout;

    // Emploi
    const emploiInitial = secteur.emplois;
    const elasticite = params.elasticiteEmploi * secteur.sensibiliteCout;
    const variationEmploi = emploiInitial * elasticite * directImpact;

    // Production
    const productionInitiale = secteur.valeurAjoutee;
    const variationProduction = productionInitiale * directImpact * 0.6; // Effet partiel

    // Prix
    const variationPrix = directImpact * params.transmissionPrix;

    // Substitution K/L (automatisation)
    const substitutionKL = calculateCapitalLaborSubstitution(
      secteur,
      shock.increase,
      secteur.elasticiteSubstitution
    );

    // Effets par catégorie de travailleurs
    const substitutionTravail = calculateSubstitutionEffects(shock, secteurKey);

    secteurs[secteurKey] = {
      nom: secteur.nom,
      emploi: {
        initial: emploiInitial,
        variation: Math.round(variationEmploi),
        final: Math.round(emploiInitial + variationEmploi)
      },
      production: {
        initiale: productionInitiale / 1e9,
        variation: variationProduction / 1e9,
        finale: (productionInitiale + variationProduction) / 1e9
      },
      prix: {
        variation: variationPrix * 100
      },
      substitution: {
        capitalTravail: substitutionKL,
        entreCategories: substitutionTravail
      },
      masseSalariale: {
        initiale: secteur.masseSalariale / 1e9,
        variation: (secteur.masseSalariale * shock.increase * 0.6) / 1e9
      }
    };
  });

  return secteurs;
}

/**
 * Substitution capital/travail (automatisation)
 */
function calculateCapitalLaborSubstitution(secteur, wageIncrease, sigma) {
  // Élasticité de substitution CES : σ = d(ln(K/L)) / d(ln(w/r))
  // Si salaire augmente, substitution vers le capital

  const capitalLaborRatio = secteur.intensiteCapital;
  const newRatio = capitalLaborRatio * Math.pow(1 + wageIncrease, sigma);
  
  const laborReduction = (newRatio - capitalLaborRatio) / capitalLaborRatio;
  const capitalIncrease = laborReduction * 1.5; // Investissement compensatoire

  return {
    reductionEmploi: laborReduction * secteur.emplois,
    augmentationCapital: capitalIncrease * secteur.valeurAjoutee * secteur.intensiteCapital / 1e9,
    nouveauRatio: newRatio
  };
}

/**
 * Effets de substituabilité agrégés
 */
function calculateAggregatedSubstitutionEffects(shock) {
  let totalEffects = {
    jeunes: { pertes: 0, gains: 0 },
    seniors: { pertes: 0, gains: 0 },
    qualifies: { pertes: 0, gains: 0 },
    nonQualifies: { pertes: 0, gains: 0 }
  };

  Object.keys(SECTEURS).forEach(secteur => {
    const effects = calculateSubstitutionEffects(shock, secteur);
    const emploiSecteur = SECTEURS[secteur].emplois;

    totalEffects.jeunes.pertes += effects.jeunes * emploiSecteur;
    totalEffects.seniors.gains += effects.seniors * emploiSecteur;
    totalEffects.nonQualifies.pertes += effects.nonQualifies * emploiSecteur;
    totalEffects.qualifies.gains += effects.qualifies * emploiSecteur;
  });

  return {
    parAge: {
      jeunes: Math.round(totalEffects.jeunes.pertes),
      seniors: Math.round(totalEffects.seniors.gains),
      net: Math.round(totalEffects.jeunes.pertes + totalEffects.seniors.gains)
    },
    parQualification: {
      nonQualifies: Math.round(totalEffects.nonQualifies.pertes),
      qualifies: Math.round(totalEffects.qualifies.gains),
      net: Math.round(totalEffects.nonQualifies.pertes + totalEffects.qualifies.gains)
    }
  };
}

/**
 * Effets Input-Output (propagation intersectorielle)
 */
function calculateInputOutputEffects(secteursEffects) {
  const effects = {};
  const iterations = 5; // Nombre de rounds de propagation

  // Initialiser avec effets directs
  Object.keys(secteursEffects).forEach(secteur => {
    effects[secteur] = {
      direct: secteursEffects[secteur].production.variation,
      indirect: 0,
      total: secteursEffects[secteur].production.variation
    };
  });

  // Itérer pour capturer les effets indirects
  for (let iter = 0; iter < iterations; iter++) {
    Object.keys(MATRICE_IO).forEach(secteurI => {
      let indirectEffect = 0;

      Object.keys(MATRICE_IO[secteurI]).forEach(secteurJ => {
        const coefficient = MATRICE_IO[secteurI][secteurJ];
        const demandChange = effects[secteurJ].total;
        indirectEffect += coefficient * demandChange;
      });

      effects[secteurI].indirect += indirectEffect * Math.pow(0.7, iter); // Amortissement
      effects[secteurI].total = effects[secteurI].direct + effects[secteurI].indirect;
    });
  }

  return effects;
}

/**
 * Boucles de rétroaction (consommation → production → emploi → consommation...)
 */
function calculateFeedbackLoops(results, periods) {
  const loops = [];
  
  // Boucle emploi-consommation
  for (let t = 1; t <= periods; t++) {
    const emploiChange = results.emploi.absolu * (1 - Math.exp(-0.3 * t));
    const consommationChange = emploiChange * results.pouvoirAchat.basRevenus * 0.01 * DONNEES_BASE.salaireMedian * 12;
    const productionChange = consommationChange * 1.3; // Multiplicateur
    const emploiInduit = productionChange / (DONNEES_BASE.pib / DONNEES_BASE.emploi.total);

    loops.push({
      period: t,
      emploiDirect: emploiChange,
      consommationInduite: consommationChange / 1e9,
      productionInduite: productionChange / 1e9,
      emploiInduit: Math.round(emploiInduit),
      emploiTotal: Math.round(emploiChange + emploiInduit)
    });
  }

  return loops;
}

/**
 * Application des effets de seuil (non-linéarités)
 */
function applyThresholdsToResults(results, shock) {
  // Seuils d'effets explosifs
  const thresholds = [
    { level: 0.15, multiplier: 1.5, steepness: 5 }, // Au-delà de +15% de hausse salariale
    { level: 0.25, multiplier: 2.5, steepness: 8 }  // Au-delà de +25%
  ];

  if (shock.increase > 0.15) {
    // Appliquer effets non-linéaires
    results.emploi.absolu = applyThresholdEffects(results.emploi.absolu, thresholds);
    results.inflation.supplementaire = applyThresholdEffects(results.inflation.supplementaire, thresholds);
  }

  return results;
}

// Fonctions utilitaires

function aggregateToAnnual(quarterlyData, years) {
  const annual = [];
  for (let y = 0; y < years; y++) {
    const startQ = y * 4;
    const endQ = startQ + 4;
    const yearData = quarterlyData.slice(startQ, endQ);
    
    annual.push({
      period: y,
      ...averageState(yearData)
    });
  }
  return annual;
}

function averageState(states) {
  const avg = {};
  const keys = Object.keys(states[0]);
  
  keys.forEach(key => {
    if (typeof states[0][key] === 'number') {
      avg[key] = states.reduce((sum, s) => sum + s[key], 0) / states.length;
    } else {
      avg[key] = states[states.length - 1][key]; // Prendre dernier état pour objets
    }
  });
  
  return avg;
}

function extractSectoralEmployment(state) {
  const sectoral = {};
  Object.keys(state.secteurs).forEach(s => {
    sectoral[s] = state.secteurs[s].emploi;
  });
  return sectoral;
}

function calculateRealWageGrowth(state, incomeLevel) {
  const nominalGrowth = {
    low: 0.15,
    medium: 0.05,
    high: 0.02
  }[incomeLevel] || 0.05;
  
  return (nominalGrowth - state.inflation) * 100;
}

function calculateWageDistribution(households) {
  const wages = households.filter(h => h.employe).map(h => h.salaire).sort((a, b) => a - b);
  
  return {
    p10: wages[Math.floor(wages.length * 0.1)],
    p25: wages[Math.floor(wages.length * 0.25)],
    median: wages[Math.floor(wages.length * 0.5)],
    p75: wages[Math.floor(wages.length * 0.75)],
    p90: wages[Math.floor(wages.length * 0.9)]
  };
}

function calculateAgeEffects(households) {
  const jeunes = households.filter(h => h.age < 30);
  const moyens = households.filter(h => h.age >= 30 && h.age < 55);
  const seniors = households.filter(h => h.age >= 55);
  
  return {
    jeunes: { tauxEmploi: jeunes.filter(h => h.employe).length / jeunes.length },
    moyens: { tauxEmploi: moyens.filter(h => h.employe).length / moyens.length },
    seniors: { tauxEmploi: seniors.filter(h => h.employe).length / seniors.length }
  };
}

function calculateQualificationEffects(households) {
  const nq = households.filter(h => h.qualification === 'non_qualifie');
  const q = households.filter(h => h.qualification === 'qualifie');
  const tq = households.filter(h => h.qualification === 'tres_qualifie');
  
  return {
    nonQualifies: { tauxEmploi: nq.filter(h => h.employe).length / nq.length },
    qualifies: { tauxEmploi: q.filter(h => h.employe).length / q.length },
    tresQualifies: { tauxEmploi: tq.filter(h => h.employe).length / tq.length }
  };
}

function calculateSectorEffects(households) {
  const bySector = {};
  Object.keys(SECTEURS).forEach(s => {
    const inSector = households.filter(h => h.secteur === s);
    bySector[s] = {
      emploi: inSector.filter(h => h.employe).length,
      salaireMoyen: inSector.filter(h => h.employe).reduce((sum, h) => sum + h.salaire, 0) / inSector.filter(h => h.employe).length
    };
  });
  return bySector;
}

function calculateGiniCoefficient(households) {
  const wages = households.filter(h => h.employe).map(h => h.salaire).sort((a, b) => a - b);
  const n = wages.length;
  let sum = 0;
  
  wages.forEach((wage, i) => {
    sum += (2 * (i + 1) - n - 1) * wage;
  });
  
  const meanWage = wages.reduce((s, w) => s + w, 0) / n;
  return sum / (n * n * meanWage);
}

function calculateSegregationIndex(households) {
  // Index de ségrégation résidentielle/professionnelle simplifié
  return 0.3; // Placeholder
}

function calculateMobilityRate(households) {
  // Taux de mobilité inter-sectorielle
  return 0.05; // Placeholder
}

function calculateAggregationBias(results) {
  // Différence entre micro et macro
  return {
    emploi: results.micro[results.micro.length - 1].emploi - results.macro[results.macro.length - 1].emploiTotal,
    consommation: results.micro[results.micro.length - 1].consommation - results.macro[results.macro.length - 1].consommation
  };
}

export { runDSGESimulation, runABMSimulation, runHybridSimulation };
