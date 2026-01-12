import React, { useState, useMemo } from 'react';
import { Briefcase, DollarSign, TrendingUp, Building2, ShoppingCart, Globe } from 'lucide-react';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { SCENARIOS, DONNEES_BASE } from '../data/modeles';
import { calculerImpactSMIC, formatNumber, formatPourcent, formatEuro } from '../utils/calculs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function SimulateurSMIC() {
  const scenario = SCENARIOS.smicAugmentation;
  
  const [params, setParams] = useState({
    smicHoraire: scenario.curseurs.smicHoraire.default,
    elasticiteEmploi: scenario.curseurs.elasticiteEmploi.default,
    transmissionPrix: scenario.curseurs.transmissionPrix.default,
    propensionConsommer: scenario.curseurs.propensionConsommer.default,
    horizonTemporel: scenario.curseurs.horizonTemporel.default,
    diffusionAutresSalaires: scenario.curseurs.diffusionAutresSalaires.default
  });

  const resultats = useMemo(() => calculerImpactSMIC(params), [params]);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Données pour le graphique d'évolution temporelle
  const donneesTemporelles = useMemo(() => {
    const data = [];
    for (let annee = 0; annee <= params.horizonTemporel; annee++) {
      const facteurProgression = annee / params.horizonTemporel;
      data.push({
        annee: `Année ${annee}`,
        emploi: resultats.pertesEmploi.absolu * facteurProgression,
        pouvoirAchat: resultats.pouvoirAchat.basRevenus * facteurProgression,
        inflation: resultats.inflation.supplementaire * facteurProgression
      });
    }
    return data;
  }, [params.horizonTemporel, resultats]);

  const variationSMIC = ((params.smicHoraire - DONNEES_BASE.smic.horaireBrut) / DONNEES_BASE.smic.horaireBrut) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cftc-blue to-blue-700 text-white p-6 rounded-lg mb-6">
        <h2 className="text-3xl font-bold mb-2">🇫🇷 Et si la France passait le SMIC à {params.smicHoraire.toFixed(2)}€/h ?</h2>
        <p className="text-blue-100">{scenario.description}</p>
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="opacity-75">SMIC actuel: </span>
            <span className="font-bold">{DONNEES_BASE.smic.horaireBrut}€/h</span>
          </div>
          <div>
            <span className="opacity-75">Variation: </span>
            <span className="font-bold">{variationSMIC > 0 ? '+' : ''}{variationSMIC.toFixed(1)}%</span>
          </div>
          <div>
            <span className="opacity-75">Salariés concernés: </span>
            <span className="font-bold">{formatNumber(resultats.masseSalariale.salariesConcernes, 1)}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panneau de contrôle */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Paramètres de simulation</h3>
            
            <Slider
              label="SMIC horaire brut"
              value={params.smicHoraire}
              onChange={(val) => updateParam('smicHoraire', val)}
              min={scenario.curseurs.smicHoraire.min}
              max={scenario.curseurs.smicHoraire.max}
              step={scenario.curseurs.smicHoraire.step}
              unite={scenario.curseurs.smicHoraire.unite}
              info="Salaire minimum horaire brut. Actuellement 11,88€, certains syndicats demandent 15€."
            />

            <Slider
              label={scenario.curseurs.elasticiteEmploi.label}
              value={params.elasticiteEmploi}
              onChange={(val) => updateParam('elasticiteEmploi', val)}
              min={scenario.curseurs.elasticiteEmploi.min}
              max={scenario.curseurs.elasticiteEmploi.max}
              step={scenario.curseurs.elasticiteEmploi.step}
              unite={scenario.curseurs.elasticiteEmploi.unite}
              info={scenario.curseurs.elasticiteEmploi.info}
            />

            <Slider
              label={scenario.curseurs.transmissionPrix.label}
              value={params.transmissionPrix}
              onChange={(val) => updateParam('transmissionPrix', val)}
              min={scenario.curseurs.transmissionPrix.min}
              max={scenario.curseurs.transmissionPrix.max}
              step={scenario.curseurs.transmissionPrix.step}
              unite={scenario.curseurs.transmissionPrix.unite}
              info={scenario.curseurs.transmissionPrix.info}
            />

            <Slider
              label={scenario.curseurs.propensionConsommer.label}
              value={params.propensionConsommer}
              onChange={(val) => updateParam('propensionConsommer', val)}
              min={scenario.curseurs.propensionConsommer.min}
              max={scenario.curseurs.propensionConsommer.max}
              step={scenario.curseurs.propensionConsommer.step}
              unite={scenario.curseurs.propensionConsommer.unite}
              info={scenario.curseurs.propensionConsommer.info}
            />

            <Slider
              label={scenario.curseurs.diffusionAutresSalaires.label}
              value={params.diffusionAutresSalaires}
              onChange={(val) => updateParam('diffusionAutresSalaires', val)}
              min={scenario.curseurs.diffusionAutresSalaires.min}
              max={scenario.curseurs.diffusionAutresSalaires.max}
              step={scenario.curseurs.diffusionAutresSalaires.step}
              unite={scenario.curseurs.diffusionAutresSalaires.unite}
              info={scenario.curseurs.diffusionAutresSalaires.info}
            />

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Horizon temporel
              </label>
              <div className="flex gap-2">
                {scenario.curseurs.horizonTemporel.options.map(option => (
                  <button
                    key={option}
                    onClick={() => updateParam('horizonTemporel', option)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      params.horizonTemporel === option
                        ? 'bg-cftc-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option} an{option > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                ℹ️ Ces paramètres permettent d'ajuster le modèle selon différentes hypothèses économiques. 
                Les valeurs par défaut reflètent le consensus académique.
              </p>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Résultats clés */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Résultats estimés</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ResultCard
                icon={Briefcase}
                titre="Impact sur l'emploi"
                valeur={formatNumber(resultats.pertesEmploi.absolu)}
                unite="emplois"
                tendance={resultats.pertesEmploi.absolu < 0 ? 'negatif' : 'positif'}
                fourchette={{
                  min: formatNumber(resultats.pertesEmploi.fourchette.min),
                  max: formatNumber(resultats.pertesEmploi.fourchette.max)
                }}
                description={`${formatPourcent(resultats.pertesEmploi.pourcent, 2)} de l'emploi total`}
                alerte={Math.abs(resultats.pertesEmploi.absolu) > 300000}
              />

              <ResultCard
                icon={DollarSign}
                titre="Pouvoir d'achat (bas revenus)"
                valeur={formatPourcent(resultats.pouvoirAchat.basRevenus, 1, true)}
                tendance={resultats.pouvoirAchat.basRevenus > 0 ? 'positif' : 'negatif'}
                description={`Nouveau SMIC net: ${Math.round(resultats.pouvoirAchat.smicNet)}€/mois (+${Math.round(resultats.pouvoirAchat.gainMensuel)}€)`}
              />

              <ResultCard
                icon={TrendingUp}
                titre="Inflation supplémentaire"
                valeur={formatPourcent(resultats.inflation.supplementaire, 2, true)}
                unite="points"
                tendance={resultats.inflation.supplementaire > 1 ? 'negatif' : 'neutre'}
                fourchette={{
                  min: formatPourcent(resultats.inflation.fourchette.min, 2),
                  max: formatPourcent(resultats.inflation.fourchette.max, 2)
                }}
                description={`Inflation totale: ${formatPourcent(resultats.inflation.totale, 1)}`}
              />

              <ResultCard
                icon={Building2}
                titre="Finances publiques"
                valeur={formatEuro(resultats.financesPubliques.soldeNet, 1)}
                tendance={resultats.financesPubliques.soldeNet > 0 ? 'positif' : 'negatif'}
                fourchette={{
                  min: formatEuro(resultats.financesPubliques.fourchette.min, 1),
                  max: formatEuro(resultats.financesPubliques.fourchette.max, 1)
                }}
                description="Solde net (recettes - dépenses)"
              />

              <ResultCard
                icon={ShoppingCart}
                titre="Marges des entreprises"
                valeur={formatPourcent(resultats.margesEntreprises.variationPoints, 2, true)}
                unite="points"
                tendance={resultats.margesEntreprises.variationPoints < 0 ? 'negatif' : 'positif'}
                description={`Nouveau taux de marge: ${formatPourcent(resultats.margesEntreprises.nouveauTaux, 1)}`}
              />

              <ResultCard
                icon={Globe}
                titre="Balance commerciale"
                valeur={formatEuro(resultats.commerceExterieur.variationExport, 1)}
                tendance={resultats.commerceExterieur.variationExport < 0 ? 'negatif' : 'positif'}
                description={`${formatPourcent(resultats.commerceExterieur.pourcentPIB, 2)} du PIB`}
              />
            </div>
          </div>

          {/* Graphique d'évolution temporelle */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Évolution sur {params.horizonTemporel} an{params.horizonTemporel > 1 ? 's' : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donneesTemporelles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'emploi') return [formatNumber(value), 'Emplois perdus'];
                    if (name === 'pouvoirAchat') return [formatPourcent(value, 1), 'Pouvoir d\'achat'];
                    if (name === 'inflation') return [formatPourcent(value, 2), 'Inflation'];
                    return value;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="emploi" stroke="#E63946" name="Emplois perdus" strokeWidth={2} />
                <Line type="monotone" dataKey="pouvoirAchat" stroke="#2A9D8F" name="Pouvoir d'achat (%)" strokeWidth={2} />
                <Line type="monotone" dataKey="inflation" stroke="#F4A261" name="Inflation (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Détails des finances publiques */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏛️ Détail des finances publiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Recettes cotisations sociales</span>
                <span className="font-semibold text-green-600">+{formatEuro(resultats.financesPubliques.recettesCotisations, 1)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Recettes TVA (sur consommation)</span>
                <span className="font-semibold text-green-600">+{formatEuro(resultats.financesPubliques.recettesTVA, 1)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Dépenses chômage</span>
                <span className="font-semibold text-red-600">-{formatEuro(resultats.financesPubliques.depensesChomage, 1)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                <span className="text-gray-900 font-bold">Solde net</span>
                <span className={`font-bold text-lg ${resultats.financesPubliques.soldeNet > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {resultats.financesPubliques.soldeNet > 0 ? '+' : ''}{formatEuro(resultats.financesPubliques.soldeNet, 1)}
                </span>
              </div>
            </div>
          </div>

          {/* Méthodologie et sources */}
          <div className="bg-blue-50 border-l-4 border-cftc-blue rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📚 Méthodologie & Sources</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Élasticité emploi/coût:</strong> Cahuc & Carcillo (2012), OCDE (2019), Crépon & Desplatz (2001)</p>
              <p><strong>Transmission aux prix:</strong> Biscourp et al. (2005) INSEE, Gautier & Roux (2019) Banque de France</p>
              <p><strong>Propension à consommer:</strong> INSEE Enquête Budget des Familles 2020, Garbinti et al. (2018) WID</p>
              <p><strong>Données de base:</strong> INSEE Comptes nationaux 2023-2024, DARES Portrait statistique 2023</p>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-gray-600">
                ⚠️ <strong>Avertissement:</strong> Ces estimations sont indicatives et sujettes à de fortes incertitudes. 
                Les effets économiques réels dépendent de nombreux facteurs non modélisés (réactions des agents, 
                contexte international, politiques d'accompagnement, etc.). Les fourchettes reflètent cette incertitude.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
