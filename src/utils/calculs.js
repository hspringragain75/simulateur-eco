import { DONNEES_BASE, FORMULES } from '../data/modeles';

// Calcul détaillé pour le scénario SMIC à X€
export function calculerImpactSMIC(params) {
  const {
    smicHoraire,
    elasticiteEmploi,
    transmissionPrix,
    propensionConsommer,
    horizonTemporel,
    diffusionAutresSalaires
  } = params;

  // 1. Calcul de la variation du SMIC
  const variationSMIC = (smicHoraire - DONNEES_BASE.smic.horaireBrut) / DONNEES_BASE.smic.horaireBrut;
  const nouveauSMICMensuel = smicHoraire * 151.67; // mensualisation
  const augmentationMensuelle = nouveauSMICMensuel - DONNEES_BASE.smic.mensuelBrut;

  // 2. Impact sur la masse salariale directe (salariés au SMIC)
  const masseSalarialeSMIC = DONNEES_BASE.smic.mensuelBrut * 12 * DONNEES_BASE.smic.salariesConcernes;
  const nouvelleMasseSMIC = nouveauSMICMensuel * 12 * DONNEES_BASE.smic.salariesConcernes;
  const augmentationMasseSMIC = nouvelleMasseSMIC - masseSalarialeSMIC;

  // 3. Effet de diffusion aux salaires supérieurs (1.0 à 1.5 SMIC)
  const salariesProches = DONNEES_BASE.smic.salariesConcernes * 1.5; // estimation
  const augmentationDiffusion = augmentationMasseSMIC * diffusionAutresSalaires;
  
  const augmentationMasseTotale = augmentationMasseSMIC + augmentationDiffusion;

  // 4. Impact sur le coût du travail (avec cotisations patronales)
  const augmentationCoutTravail = augmentationMasseTotale * (1 + DONNEES_BASE.tauxCotisations.patronales);
  const variationCoutTravail = augmentationCoutTravail / (DONNEES_BASE.masseSalariale.totale * (1 + DONNEES_BASE.tauxCotisations.patronales));

  // 5. Impact sur l'emploi (effet négatif)
  // Ajustement selon l'horizon : élasticité augmente avec le temps
  const elasticiteAjustee = elasticiteEmploi * (horizonTemporel === 1 ? 0.6 : horizonTemporel === 3 ? 0.85 : 1.0);
  
  const pertesEmploi = FORMULES.impactEmploi(
    DONNEES_BASE.emploi.prives,
    elasticiteAjustee,
    variationCoutTravail
  );

  const pertesEmploiPourcent = (pertesEmploi / DONNEES_BASE.emploi.total) * 100;

  // 6. Impact sur les prix (inflation supplémentaire)
  // Part des salaires dans la valeur ajoutée : ~65%
  const partSalairesVA = 0.65;
  const impactCoutUnitaire = variationCoutTravail * partSalairesVA;
  const inflationSupplementaire = FORMULES.impactPrix(transmissionPrix, impactCoutUnitaire);

  // 7. Impact sur le pouvoir d'achat
  // Effet nominal (hausse salaire) - effet réel (inflation)
  const gainNominalBasRevenus = variationSMIC;
  const gainReelBasRevenus = gainNominalBasRevenus - inflationSupplementaire;

  // Pour les revenus moyens/hauts : seulement l'effet inflation négatif (sauf diffusion)
  const gainReelRevenusMoyens = (diffusionAutresSalaires * variationSMIC * 0.3) - inflationSupplementaire;

  // 8. Impact sur la consommation
  const gainRevenuDisponible = augmentationMasseTotale * (1 - DONNEES_BASE.tauxCotisations.salariales);
  const gainRevenuDisponibleNet = gainRevenuDisponible - (pertesEmploi * DONNEES_BASE.salaireMedian * 12);
  
  const augmentationConso = FORMULES.impactConsommation(gainRevenuDisponibleNet, propensionConsommer);

  // 9. Impact sur les finances publiques
  // Recettes : cotisations sociales + TVA sur conso
  const recettesCotisations = augmentationMasseTotale * (DONNEES_BASE.tauxCotisations.patronales + DONNEES_BASE.tauxCotisations.salariales);
  const recettesTVA = augmentationConso * 0.15; // TVA moyenne effective ~15%
  
  // Dépenses : allocations chômage pour pertes d'emploi
  const depensesChomage = Math.abs(pertesEmploi) * DONNEES_BASE.salaireMedian * 12 * 0.57 * 0.7; // 57% du salaire, 70% des chômeurs indemnisés
  
  const impactFinancesPubliques = recettesCotisations + recettesTVA - depensesChomage;

  // 10. Impact sur les marges des entreprises
  // Hausse coûts non répercutée = pression sur les marges
  const hausseNonRepercutee = augmentationCoutTravail * (1 - transmissionPrix);
  const tauxMargeActuel = 0.32; // 32% en moyenne
  const variationMarge = -hausseNonRepercutee / DONNEES_BASE.pib;
  const nouveauTauxMarge = tauxMargeActuel + variationMarge;

  // 11. Impact sur le commerce extérieur
  // Perte de compétitivité-prix
  const elasticiteExport = -0.8;
  const partExportPIB = 0.32;
  const variationExport = DONNEES_BASE.pib * partExportPIB * elasticiteExport * inflationSupplementaire;

  // 12. Impact net sur le PIB (effet multiplicateur)
  const impactDirectPIB = augmentationConso + variationExport;
  const impactTotalPIB = FORMULES.effetMultiplicateur(impactDirectPIB, 1.3);
  const variationPIBPourcent = (impactTotalPIB / DONNEES_BASE.pib) * 100;

  return {
    // Emploi
    pertesEmploi: {
      absolu: Math.round(pertesEmploi),
      pourcent: pertesEmploiPourcent,
      fourchette: {
        min: Math.round(pertesEmploi * 0.7),
        max: Math.round(pertesEmploi * 1.3)
      }
    },
    
    // Pouvoir d'achat
    pouvoirAchat: {
      basRevenus: gainReelBasRevenus * 100,
      revenusMoyens: gainReelRevenusMoyens * 100,
      smicNet: nouveauSMICMensuel * (1 - DONNEES_BASE.tauxCotisations.salariales),
      gainMensuel: augmentationMensuelle * (1 - DONNEES_BASE.tauxCotisations.salariales)
    },
    
    // Inflation
    inflation: {
      supplementaire: inflationSupplementaire * 100,
      totale: (DONNEES_BASE.inflation.actuelle + inflationSupplementaire) * 100,
      fourchette: {
        min: inflationSupplementaire * 0.6 * 100,
        max: inflationSupplementaire * 1.4 * 100
      }
    },
    
    // Finances publiques
    financesPubliques: {
      recettesCotisations: recettesCotisations / 1e9,
      recettesTVA: recettesTVA / 1e9,
      depensesChomage: depensesChomage / 1e9,
      soldeNet: impactFinancesPubliques / 1e9,
      fourchette: {
        min: impactFinancesPubliques * 0.5 / 1e9,
        max: impactFinancesPubliques * 1.5 / 1e9
      }
    },
    
    // Marges entreprises
    margesEntreprises: {
      variationPoints: variationMarge * 100,
      nouveauTaux: nouveauTauxMarge * 100,
      montant: hausseNonRepercutee / 1e9
    },
    
    // Commerce extérieur
    commerceExterieur: {
      variationExport: variationExport / 1e9,
      pourcentPIB: (variationExport / DONNEES_BASE.pib) * 100
    },
    
    // PIB
    pib: {
      variation: impactTotalPIB / 1e9,
      pourcentage: variationPIBPourcent,
      fourchette: {
        min: variationPIBPourcent * 0.6,
        max: variationPIBPourcent * 1.4
      }
    },
    
    // Masse salariale
    masseSalariale: {
      augmentation: augmentationMasseTotale / 1e9,
      salariesConcernes: DONNEES_BASE.smic.salariesConcernes + salariesProches * diffusionAutresSalaires
    }
  };
}

// Calcul pour le scénario 32h
export function calculerImpact32h(params) {
  const {
    heuresHebdo,
    maintienSalaire,
    embauches,
    gainProductivite,
    elasticiteEmploi,
    transmissionPrix,
    horizonTemporel
  } = params;

  // 1. Réduction du temps de travail
  const reductionTemps = (35 - heuresHebdo) / 35;
  const heuresMensuelles = heuresHebdo * 52 / 12;
  
  // 2. Impact sur le coût horaire
  // Si maintien 100% du salaire : coût horaire augmente proportionnellement
  const augmentationCoutHoraire = maintienSalaire * reductionTemps / (1 - reductionTemps);
  
  // 3. Impact brut sur le coût du travail
  const masseSalarialeTotale = DONNEES_BASE.masseSalariale.totale;
  const augmentationMasseBrute = masseSalarialeTotale * (maintienSalaire - 1) + masseSalarialeTotale * reductionTemps * maintienSalaire;
  
  // Avec cotisations patronales
  const augmentationCoutTravailBrut = augmentationMasseBrute * (1 + DONNEES_BASE.tauxCotisations.patronales);

  // 4. Compensation par embauches
  const heuresManquantes = DONNEES_BASE.emploi.total * 151.67 * reductionTemps;
  const emploisCrees = (heuresManquantes / 151.67) * embauches;
  
  // Coût des embauches (au salaire médian)
  const coutEmbauches = emploisCrees * DONNEES_BASE.salaireMedian * 12 * (1 + DONNEES_BASE.tauxCotisations.patronales);
  
  const augmentationCoutTravailNet = augmentationCoutTravailBrut + coutEmbauches;

  // 5. Gain de productivité (compense partiellement)
  const compensationProductivite = masseSalarialeTotale * gainProductivite;
  const augmentationCoutTravailFinal = augmentationCoutTravailNet - compensationProductivite;

  // 6. Impact sur l'emploi (effet dual)
  // Effet positif : embauches compensatoires
  // Effet négatif : hausse du coût horaire
  const variationCoutHoraire = augmentationCoutHoraire - gainProductivite;
  const pertesEmploiCout = FORMULES.impactEmploi(
    DONNEES_BASE.emploi.prives,
    elasticiteEmploi * (horizonTemporel <= 3 ? 0.7 : 1.0),
    variationCoutHoraire
  );
  
  const emploiNet = emploisCrees + pertesEmploiCout;
  const variationChomage = -emploiNet / DONNEES_BASE.emploi.total * DONNEES_BASE.tauxChomage;

  // 7. Impact sur les prix
  const variationCoutTravailRel = augmentationCoutTravailFinal / (masseSalarialeTotale * (1 + DONNEES_BASE.tauxCotisations.patronales));
  const inflationSupplementaire = FORMULES.impactPrix(transmissionPrix, variationCoutTravailRel * 0.65);

  // 8. Impact sur le pouvoir d'achat et qualité de vie
  // Gain en temps libre
  const heuresLibereesAnnuelles = (35 - heuresHebdo) * 52;
  const joursLiberes = heuresLibereesAnnuelles / 7; // équivalent jours de 7h
  
  // Pouvoir d'achat : maintien nominal - inflation
  const gainPouvoirAchat = (maintienSalaire - 1) - inflationSupplementaire;

  // 9. Impact sur les finances publiques
  const recettesCotisations = augmentationMasseBrute * (DONNEES_BASE.tauxCotisations.patronales + DONNEES_BASE.tauxCotisations.salariales);
  const economiesChomage = emploiNet > 0 ? emploiNet * DONNEES_BASE.salaireMedian * 12 * 0.57 * 0.7 : 0;
  const depensesSupplementaires = emploiNet < 0 ? Math.abs(emploiNet) * DONNEES_BASE.salaireMedian * 12 * 0.57 * 0.7 : 0;
  
  const impactFinancesPubliques = recettesCotisations + economiesChomage - depensesSupplementaires;

  // 10. Impact environnemental (estimé)
  // Réduction activité économique + mobilité
  const emissionsCO2Evitees = reductionTemps * 0.7; // -70% de la réduction du temps (trajets, production)

  // 11. Impact santé (qualitatif -> quantifié via études)
  // Réduction burn-out, arrêts maladie
  // Études montrent 15-20% de réduction des arrêts avec 32h
  const economiesSante = DONNEES_BASE.pib * 0.08 * 0.18; // 8% PIB = santé, 18% réduction arrêts

  return {
    // Emploi
    emploi: {
      creations: Math.round(emploisCrees),
      destructions: Math.round(pertesEmploiCout),
      net: Math.round(emploiNet),
      pourcentage: (emploiNet / DONNEES_BASE.emploi.total) * 100,
      nouveauTauxChomage: (DONNEES_BASE.tauxChomage + variationChomage) * 100,
      fourchette: {
        min: Math.round(emploiNet * 0.5),
        max: Math.round(emploiNet * 1.8)
      }
    },
    
    // Temps de travail
    tempsLibere: {
      heuresAnnuelles: heuresLibereesAnnuelles,
      joursEquivalents: Math.round(joursLiberes),
      heuresMensuelles: heuresMensuelles
    },
    
    // Pouvoir d'achat
    pouvoirAchat: {
      variation: gainPouvoirAchat * 100,
      maintienSalaireNet: maintienSalaire * (1 - DONNEES_BASE.tauxCotisations.salariales) * 100,
      inflation: inflationSupplementaire * 100
    },
    
    // Coût pour les entreprises
    coutEntreprises: {
      augmentationTotale: augmentationCoutTravailFinal / 1e9,
      augmentationHoraire: augmentationCoutHoraire * 100,
      compensationProductivite: compensationProductivite / 1e9,
      coutEmbauches: coutEmbauches / 1e9
    },
    
    // Finances publiques
    financesPubliques: {
      recettes: recettesCotisations / 1e9,
      economiesChomage: economiesChomage / 1e9,
      depenses: depensesSupplementaires / 1e9,
      soldeNet: impactFinancesPubliques / 1e9,
      fourchette: {
        min: impactFinancesPubliques * 0.4 / 1e9,
        max: impactFinancesPubliques * 1.6 / 1e9
      }
    },
    
    // Inflation
    inflation: {
      supplementaire: inflationSupplementaire * 100,
      totale: (DONNEES_BASE.inflation.actuelle + inflationSupplementaire) * 100
    },
    
    // Environnement
    environnement: {
      reductionEmissions: emissionsCO2Evitees * 100,
      economiesSante: economiesSante / 1e9
    },
    
    // Productivité
    productivite: {
      gainHoraire: gainProductivite * 100,
      compensationCout: (compensationProductivite / augmentationCoutTravailBrut) * 100
    }
  };
}

// Utilitaire pour formater les nombres
export function formatNumber(num, decimals = 0) {
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(decimals) + ' Md';
  }
  if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(decimals) + ' M';
  }
  if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(decimals) + ' k';
  }
  return num.toFixed(decimals);
}

export function formatPourcent(num, decimals = 1, withSign = false) {
  const sign = withSign && num > 0 ? '+' : '';
  return sign + num.toFixed(decimals) + '%';
}

export function formatEuro(num, decimals = 0) {
  return formatNumber(num, decimals) + '€';
}
