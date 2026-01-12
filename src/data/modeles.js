// Sources académiques et institutionnelles
export const SOURCES = {
  elasticiteEmploi: {
    courtTerme: {
      min: -0.3,
      max: -0.5,
      sources: [
        "Cahuc & Carcillo (2012) - Les conséquences des allégements de cotisations sociales, CAE",
        "OCDE (2019) - Employment Outlook",
        "Crépon & Desplatz (2001) - Une nouvelle évaluation des effets des allégements de charges sociales"
      ]
    },
    longTerme: {
      min: -0.7,
      max: -1.0,
      sources: [
        "Hamermesh (1993) - Labor Demand",
        "Lichter et al. (2015) - The long-term costs of job displacement"
      ]
    }
  },
  transmissionPrix: {
    min: 0.3,
    max: 0.6,
    sources: [
      "Biscourp et al. (2005) - Les salaires sont-ils rigides ?, INSEE",
      "Gautier & Roux (2019) - Transmission des coûts salariaux aux prix, Banque de France"
    ]
  },
  propensionConsommer: {
    basRevenus: 0.9,
    revenusMoyens: 0.7,
    hautsRevenus: 0.4,
    sources: [
      "INSEE (2020) - Enquête Budget des Familles",
      "Garbinti et al. (2018) - Income inequality in France 1900-2014, WID"
    ]
  },
  multiplicateurKeynesien: {
    value: 1.3,
    range: [1.1, 1.5],
    sources: [
      "OFCE (2020) - Les multiplicateurs budgétaires en France",
      "IMF (2012) - World Economic Outlook"
    ]
  }
};

// Données de base France 2024
export const DONNEES_BASE = {
  smic: {
    horaireBrut: 11.88,
    mensuelBrut: 1801.80, // 151.67h
    mensuelNet: 1426.30,
    salariesConcernes: 3200000,
    sourcesSalaries: "DARES (2023) - Portrait statistique des salariés au SMIC"
  },
  emploi: {
    total: 29800000,
    prives: 20500000,
    publics: 5600000,
    independants: 3700000,
    source: "INSEE (2024) - Emploi, chômage, revenus du travail"
  },
  masseSalariale: {
    totale: 782000000000, // 782 Md€
    privee: 540000000000,
    source: "INSEE Comptes nationaux 2023"
  },
  tauxCotisations: {
    patronales: 0.42, // 42% du brut
    salariales: 0.22, // 22% du brut
    source: "URSSAF 2024"
  },
  inflation: {
    actuelle: 0.025, // 2.5%
    cible: 0.02,
    source: "INSEE - IPC décembre 2024"
  },
  pib: 2950000000000, // 2950 Md€
  tauxChomage: 0.073, // 7.3%
  salaireMedian: 2091, // net mensuel
  sources: {
    pib: "INSEE - Comptes nationaux T3 2024",
    chomage: "INSEE - Taux de chômage T4 2024",
    salaireMedian: "INSEE - DADS 2022"
  }
};

// Modèles économiques par scénario
export const SCENARIOS = {
  smicAugmentation: {
    nom: "SMIC à 15€/h",
    description: "Augmentation du SMIC horaire brut de 11,88€ à 15€",
    curseurs: {
      smicHoraire: {
        min: 11.88,
        max: 20,
        default: 15,
        step: 0.1,
        unite: "€/h"
      },
      elasticiteEmploi: {
        min: -1.0,
        max: -0.3,
        default: -0.5,
        step: 0.1,
        unite: "",
        label: "Élasticité emploi/coût du travail",
        info: "Sensibilité de l'emploi à une hausse du coût du travail. -0.5 = une hausse de 10% du coût entraîne -5% d'emplois"
      },
      transmissionPrix: {
        min: 0.2,
        max: 0.7,
        default: 0.45,
        step: 0.05,
        unite: "",
        label: "Transmission aux prix",
        info: "Part de la hausse des coûts répercutée dans les prix. 0.45 = 45% de la hausse transmise"
      },
      propensionConsommer: {
        min: 0.7,
        max: 0.95,
        default: 0.85,
        step: 0.05,
        unite: "",
        label: "Propension à consommer (bas revenus)",
        info: "Part du revenu supplémentaire consommée. 0.85 = 85% consommé, 15% épargné"
      },
      horizonTemporel: {
        options: [1, 3, 5],
        default: 3,
        unite: "ans",
        label: "Horizon temporel"
      },
      diffusionAutresSalaires: {
        min: 0,
        max: 0.5,
        default: 0.2,
        step: 0.05,
        unite: "",
        label: "Diffusion aux salaires supérieurs",
        info: "Effet d'entraînement sur les salaires juste au-dessus du SMIC"
      }
    }
  },
  semaine32h: {
    nom: "Semaine de 32h",
    description: "Passage à 32h hebdomadaires sans perte de salaire",
    curseurs: {
      heuresHebdo: {
        min: 30,
        max: 35,
        default: 32,
        step: 0.5,
        unite: "h/sem"
      },
      maintienSalaire: {
        min: 0.8,
        max: 1.0,
        default: 1.0,
        step: 0.05,
        unite: "",
        label: "Maintien du salaire",
        info: "1.0 = 100% du salaire maintenu, 0.9 = 90% maintenu"
      },
      embauches: {
        min: 0,
        max: 0.15,
        default: 0.08,
        step: 0.01,
        unite: "",
        label: "Taux d'embauches compensatoires",
        info: "Part des heures réduites compensées par des embauches. 0.08 = 8% de compensation"
      },
      gainProductivite: {
        min: 0,
        max: 0.1,
        default: 0.03,
        step: 0.01,
        unite: "",
        label: "Gain de productivité",
        info: "Amélioration de la productivité horaire. 0.03 = +3%"
      },
      elasticiteEmploi: {
        min: -1.2,
        max: -0.4,
        default: -0.7,
        step: 0.1,
        unite: "",
        label: "Élasticité emploi/coût horaire"
      },
      transmissionPrix: {
        min: 0.3,
        max: 0.8,
        default: 0.55,
        step: 0.05,
        unite: "",
        label: "Transmission aux prix"
      },
      horizonTemporel: {
        options: [1, 3, 5, 10],
        default: 5,
        unite: "ans"
      }
    }
  }
};

// Formules de calcul
export const FORMULES = {
  // Impact emploi : ΔEmploi = Emploi × Élasticité × ΔCoûtTravail
  impactEmploi: (emploiBase, elasticite, variationCout) => {
    return emploiBase * elasticite * variationCout;
  },
  
  // Impact prix : ΔPrix = TransmissionPrix × ΔCoûtUnitaire
  impactPrix: (transmissionPrix, variationCoutUnitaire) => {
    return transmissionPrix * variationCoutUnitaire;
  },
  
  // Impact consommation : ΔConso = ΔRevenuDisponible × PropensionConsommer
  impactConsommation: (variationRevenu, propension) => {
    return variationRevenu * propension;
  },
  
  // Effet multiplicateur : ImpactPIB = ImpactInitial × Multiplicateur
  effetMultiplicateur: (impactInitial, multiplicateur) => {
    return impactInitial * multiplicateur;
  },
  
  // Cotisations sociales
  cotisationsSociales: (masseSalariale, tauxPatronales, tauxSalariales) => {
    return masseSalariale * (tauxPatronales + tauxSalariales);
  },
  
  // Coût du travail (superbrut)
  coutTravail: (salaireBrut, tauxCotisationsPatronales) => {
    return salaireBrut * (1 + tauxCotisationsPatronales);
  }
};
