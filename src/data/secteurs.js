// Données sectorielles de l'économie française (10 secteurs agrégés)
// Sources : INSEE Comptes nationaux, Tableaux Entrées-Sorties (TES) 2019

export const SECTEURS = {
  agriculture: {
    nom: "Agriculture, sylviculture et pêche",
    code: "AZ",
    emplois: 730000,
    valeurAjoutee: 34000000000, // 34 Md€
    masseSalariale: 14000000000,
    partSalairesVA: 0.41,
    partCapitalVA: 0.59,
    intensiteCapital: 2.1, // Capital/Travail
    elasticiteSubstitution: 0.4, // σ entre K et L
    partExport: 0.18,
    partBiensSalaires: 0.35, // Part des biens de conso dans la production
    sensibiliteCout: 0.6 // Sensibilité à la hausse des coûts salariaux
  },
  
  industrie: {
    nom: "Industrie manufacturière",
    code: "C",
    emplois: 3200000,
    valeurAjoutee: 265000000000,
    masseSalariale: 145000000000,
    partSalairesVA: 0.55,
    partCapitalVA: 0.45,
    intensiteCapital: 1.8,
    elasticiteSubstitution: 0.8,
    partExport: 0.42,
    partBiensSalaires: 0.55,
    sensibiliteCout: 0.85
  },
  
  construction: {
    nom: "Construction",
    code: "F",
    emplois: 1450000,
    valeurAjoutee: 88000000000,
    masseSalariale: 58000000000,
    partSalairesVA: 0.66,
    partCapitalVA: 0.34,
    intensiteCapital: 0.9,
    elasticiteSubstitution: 0.5,
    partExport: 0.05,
    partBiensSalaires: 0.15,
    sensibiliteCout: 0.7
  },
  
  commerce: {
    nom: "Commerce; réparation d'automobiles",
    code: "G",
    emplois: 3850000,
    valeurAjoutee: 238000000000,
    masseSalariale: 128000000000,
    partSalairesVA: 0.54,
    partCapitalVA: 0.46,
    intensiteCapital: 1.2,
    elasticiteSubstitution: 0.6,
    partExport: 0.12,
    partBiensSalaires: 0.72,
    sensibiliteCout: 0.65
  },
  
  transport: {
    nom: "Transports et entreposage",
    code: "H",
    emplois: 1450000,
    valeurAjoutee: 95000000000,
    masseSalariale: 56000000000,
    partSalairesVA: 0.59,
    partCapitalVA: 0.41,
    intensiteCapital: 1.5,
    elasticiteSubstitution: 0.55,
    partExport: 0.22,
    partBiensSalaires: 0.30,
    sensibiliteCout: 0.75
  },
  
  hebergementRestauration: {
    nom: "Hébergement et restauration",
    code: "I",
    emplois: 1280000,
    valeurAjoutee: 75000000000,
    masseSalariale: 48000000000,
    partSalairesVA: 0.64,
    partCapitalVA: 0.36,
    intensiteCapital: 0.8,
    elasticiteSubstitution: 0.4,
    partExport: 0.15,
    partBiensSalaires: 0.85,
    sensibiliteCout: 0.5
  },
  
  information: {
    nom: "Information et communication",
    code: "J",
    emplois: 890000,
    valeurAjoutee: 115000000000,
    masseSalariale: 72000000000,
    partSalairesVA: 0.63,
    partCapitalVA: 0.37,
    intensiteCapital: 2.5,
    elasticiteSubstitution: 0.9,
    partExport: 0.28,
    partBiensSalaires: 0.45,
    sensibiliteCout: 0.8
  },
  
  financesAssurances: {
    nom: "Activités financières et d'assurance",
    code: "K",
    emplois: 850000,
    valeurAjoutee: 125000000000,
    masseSalariale: 68000000000,
    partSalairesVA: 0.54,
    partCapitalVA: 0.46,
    intensiteCapital: 3.2,
    elasticiteSubstitution: 0.7,
    partExport: 0.18,
    partBiensSalaires: 0.25,
    sensibiliteCout: 0.6
  },
  
  servicesEntreprises: {
    nom: "Services aux entreprises",
    code: "MN",
    emplois: 4650000,
    valeurAjoutee: 385000000000,
    masseSalariale: 242000000000,
    partSalairesVA: 0.63,
    partCapitalVA: 0.37,
    intensiteCapital: 1.1,
    elasticiteSubstitution: 0.75,
    partExport: 0.32,
    partBiensSalaires: 0.40,
    sensibiliteCout: 0.7
  },
  
  servicesPublics: {
    nom: "Administration publique, enseignement, santé",
    code: "OPQ",
    emplois: 8950000,
    valeurAjoutee: 465000000000,
    masseSalariale: 352000000000,
    partSalairesVA: 0.76,
    partCapitalVA: 0.24,
    intensiteCapital: 0.6,
    elasticiteSubstitution: 0.3,
    partExport: 0.02,
    partBiensSalaires: 0.55,
    sensibiliteCout: 0.3 // Moins sensible (services publics)
  }
};

// Matrice Input-Output simplifiée (coefficients techniques)
// Lecture : matrice[i][j] = part de la production du secteur i utilisée par le secteur j
export const MATRICE_IO = {
  agriculture: {
    agriculture: 0.15,
    industrie: 0.25,
    construction: 0.01,
    commerce: 0.05,
    transport: 0.02,
    hebergementRestauration: 0.35,
    information: 0.01,
    financesAssurances: 0.01,
    servicesEntreprises: 0.02,
    servicesPublics: 0.08
  },
  
  industrie: {
    agriculture: 0.20,
    industrie: 0.35,
    construction: 0.45,
    commerce: 0.60,
    transport: 0.15,
    hebergementRestauration: 0.15,
    information: 0.10,
    financesAssurances: 0.05,
    servicesEntreprises: 0.10,
    servicesPublics: 0.12
  },
  
  construction: {
    agriculture: 0.05,
    industrie: 0.03,
    construction: 0.02,
    commerce: 0.02,
    transport: 0.01,
    hebergementRestauration: 0.03,
    information: 0.08,
    financesAssurances: 0.12,
    servicesEntreprises: 0.05,
    servicesPublics: 0.08
  },
  
  commerce: {
    agriculture: 0.08,
    industrie: 0.10,
    construction: 0.05,
    commerce: 0.05,
    transport: 0.08,
    hebergementRestauration: 0.12,
    information: 0.05,
    financesAssurances: 0.08,
    servicesEntreprises: 0.08,
    servicesPublics: 0.06
  },
  
  transport: {
    agriculture: 0.12,
    industrie: 0.08,
    construction: 0.05,
    commerce: 0.15,
    transport: 0.10,
    hebergementRestauration: 0.05,
    information: 0.08,
    financesAssurances: 0.06,
    servicesEntreprises: 0.12,
    servicesPublics: 0.05
  },
  
  hebergementRestauration: {
    agriculture: 0.02,
    industrie: 0.01,
    construction: 0.01,
    commerce: 0.01,
    transport: 0.05,
    hebergementRestauration: 0.02,
    information: 0.02,
    financesAssurances: 0.03,
    servicesEntreprises: 0.08,
    servicesPublics: 0.02
  },
  
  information: {
    agriculture: 0.03,
    industrie: 0.05,
    construction: 0.02,
    commerce: 0.05,
    transport: 0.08,
    hebergementRestauration: 0.03,
    information: 0.15,
    financesAssurances: 0.12,
    servicesEntreprises: 0.18,
    servicesPublics: 0.08
  },
  
  financesAssurances: {
    agriculture: 0.05,
    industrie: 0.04,
    construction: 0.03,
    commerce: 0.06,
    transport: 0.06,
    hebergementRestauration: 0.04,
    information: 0.08,
    financesAssurances: 0.15,
    servicesEntreprises: 0.12,
    servicesPublics: 0.05
  },
  
  servicesEntreprises: {
    agriculture: 0.15,
    industrie: 0.12,
    construction: 0.20,
    commerce: 0.10,
    transport: 0.18,
    hebergementRestauration: 0.08,
    information: 0.25,
    financesAssurances: 0.20,
    servicesEntreprises: 0.25,
    servicesPublics: 0.15
  },
  
  servicesPublics: {
    agriculture: 0.05,
    industrie: 0.03,
    construction: 0.02,
    commerce: 0.02,
    transport: 0.05,
    hebergementRestauration: 0.02,
    information: 0.05,
    financesAssurances: 0.03,
    servicesEntreprises: 0.08,
    servicesPublics: 0.20
  }
};

// Distribution des salariés au SMIC par secteur (%)
export const PART_SMIC_PAR_SECTEUR = {
  agriculture: 0.08,
  industrie: 0.06,
  construction: 0.10,
  commerce: 0.22,
  transport: 0.09,
  hebergementRestauration: 0.35,
  information: 0.02,
  financesAssurances: 0.01,
  servicesEntreprises: 0.12,
  servicesPublics: 0.05
};

// Structure d'âge par secteur (% de jeunes -30 ans, seniors +55 ans)
export const STRUCTURE_AGE = {
  agriculture: { jeunes: 0.15, seniors: 0.28 },
  industrie: { jeunes: 0.18, seniors: 0.24 },
  construction: { jeunes: 0.22, seniors: 0.18 },
  commerce: { jeunes: 0.28, seniors: 0.15 },
  transport: { jeunes: 0.16, seniors: 0.26 },
  hebergementRestauration: { jeunes: 0.35, seniors: 0.12 },
  information: { jeunes: 0.32, seniors: 0.10 },
  financesAssurances: { jeunes: 0.20, seniors: 0.18 },
  servicesEntreprises: { jeunes: 0.24, seniors: 0.16 },
  servicesPublics: { jeunes: 0.15, seniors: 0.28 }
};

// Structure de qualification (% non-qualifiés, qualifiés, très qualifiés)
export const STRUCTURE_QUALIFICATION = {
  agriculture: { nonQualifies: 0.45, qualifies: 0.40, tresQualifies: 0.15 },
  industrie: { nonQualifies: 0.25, qualifies: 0.50, tresQualifies: 0.25 },
  construction: { nonQualifies: 0.35, qualifies: 0.50, tresQualifies: 0.15 },
  commerce: { nonQualifies: 0.40, qualifies: 0.45, tresQualifies: 0.15 },
  transport: { nonQualifies: 0.35, qualifies: 0.50, tresQualifies: 0.15 },
  hebergementRestauration: { nonQualifies: 0.55, qualifies: 0.35, tresQualifies: 0.10 },
  information: { nonQualifies: 0.10, qualifies: 0.40, tresQualifies: 0.50 },
  financesAssurances: { nonQualifies: 0.15, qualifies: 0.45, tresQualifies: 0.40 },
  servicesEntreprises: { nonQualifies: 0.25, qualifies: 0.45, tresQualifies: 0.30 },
  servicesPublics: { nonQualifies: 0.20, qualifies: 0.50, tresQualifies: 0.30 }
};

// Élasticités de substitution entre catégories de travailleurs
export const ELASTICITES_SUBSTITUTION_TRAVAIL = {
  jeunesSeniors: 0.7, // Substituabilité jeunes/seniors
  qualifiesNonQualifies: 0.5, // Plus difficile de substituer
  capitalTravail: 0.8 // Substituabilité K/L (automatisation)
};
