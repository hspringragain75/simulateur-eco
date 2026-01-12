import React, { useState, useMemo } from 'react';
import { Briefcase, DollarSign, TrendingUp, Building2, Settings, Zap } from 'lucide-react';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import SectoralResults from '../components/SectoralResults';
import FeedbackLoops from '../components/FeedbackLoops';
import SubstitutionEffects from '../components/SubstitutionEffects';
import { SCENARIOS, DONNEES_BASE } from '../data/modeles';
import { calculerImpactSMICAvance } from '../utils/calculsAvances';
import { formatNumber, formatPourcent, formatEuro } from '../utils/calculs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SimulateurSMICAvance() {
  const scenario = SCENARIOS.smicAugmentation;
  
  const [params, setParams] = useState({
    smicHoraire: scenario.curseurs.smicHoraire.default,
    elasticiteEmploi: scenario.curseurs.elasticiteEmploi.default,
    transmissionPrix: scenario.curseurs.transmissionPrix.default,
    propensionConsommer: scenario.curseurs.propensionConsommer.default,
    horizonTemporel: scenario.curseurs.horizonTemporel.default,
    diffusionAutresSalaires: scenario.curseurs.diffusionAutresSalaires.default,
    
    // Paramètres avancés
    modeSimulation: 'dsge', // 'dsge', 'abm', 'hybrid'
    includeThresholds: true,
    includeAnticipations: true,
    includeSectoralEffects: true,
    aversionRisque: 1.5,
    elasticiteOffreTravail: 1.0
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Calcul avec les modèles avancés
  const resultats = useMemo(() => {
    setCalculating(true);
    try {
      const results = calculerImpactSMICAvance(params);
      return results;
    } catch (error) {
      console.error('Erreur de calcul:', error);
      return null;
    } finally {
      setTimeout(() => setCalculating(false), 500);
    }
  }, [params]);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const variationSMIC = ((params.smicHoraire - DONNEES_BASE.smic.horaireBrut) / DONNEES_BASE.smic.horaireBrut) * 100;

  if (!resultats) {
    return <div className="p-8 text-center">Chargement des modèles économiques...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête avec badge de mode */}
      <div className="bg-gradient-to-r from-cftc-blue to-blue-700 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">
            🇫🇷 Et si la France passait le SMIC à {params.smicHoraire.toFixed(2)}€/h ?
          </h2>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              params.modeSimulation === 'dsge' ? 'bg-purple-500' :
              params.modeSimulation === 'abm' ? 'bg-green-500' :
              'bg-yellow-500'
            }`}>
              {params.modeSimulation === 'dsge' ? '🔬 DSGE' :
               params.modeSimulation === 'abm' ? '👥 Agent-Based' :
               '🔄 Hybride'}
            </span>
            {params.includeAnticipations && (
              <span className="px-3 py-1 bg-blue-400 rounded-full text-xs font-bold">
                🔮 Anticipations
              </span>
            )}
            {params.includeThresholds && (
              <span className="px-3 py-1 bg-red-400 rounded-full text-xs font-bold">
                ⚠️ Seuils
              </span>
            )}
          </div>
        </div>
        <p className="text-blue-100">{scenario.description}</p>
        <div className="mt-4 flex gap-6 text-sm flex-wrap">
          <div>
            <span className="opacity-75">SMIC actuel: </span>
            <span className="font-bold">{DONNEES_BASE.smic.horaireBrut}€/h</span>
          </div>
          <div>
            <span className="opacity-75">Variation: </span>
            <span className="font-bold">{variationSMIC > 0 ? '+' : ''}{variationSMIC.toFixed(1)}%</span>
          </div>
          <div>
            <span className="opacity-75">Modèle: </span>
            <span className="font-bold">
              {params.modeSimulation === 'dsge' ? 'Équilibre Général Dynamique' :
               params.modeSimulation === 'abm' ? 'Simulation multi-agents (10k ménages)' :
               'Hybride DSGE+ABM'}
            </span>
          </div>
        </div>
      </div>

      {calculating && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-800">
              Calcul en cours avec le modèle {params.modeSimulation.toUpperCase()}...
            </span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panneau de contrôle */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Paramètres de simulation</h3>
            
            {/* Paramètres de base */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Paramètres de base</h4>
              
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
                info={scenario.curseurs.elasticiteEmploi.info}
              />

              <Slider
                label={scenario.curseurs.transmissionPrix.label}
                value={params.transmissionPrix}
                onChange={(val) => updateParam('transmissionPrix', val)}
                min={scenario.curseurs.transmissionPrix.min}
                max={scenario.curseurs.transmissionPrix.max}
                step={scenario.curseurs.transmissionPrix.step}
                info={scenario.curseurs.transmissionPrix.info}
              />

              <Slider
                label={scenario.curseurs.diffusionAutresSalaires.label}
                value={params.diffusionAutresSalaires}
                onChange={(val) => updateParam('diffusionAutresSalaires', val)}
                min={scenario.curseurs.diffusionAutresSalaires.min}
                max={scenario.curseurs.diffusionAutresSalaires.max}
                step={scenario.curseurs.diffusionAutresSalaires.step}
                info={scenario.curseurs.diffusionAutresSalaires.info}
              />
            </div>

            {/* Paramètres avancés (collapsible) */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                  <Settings className="w-5 h-5" />
                  Paramètres avancés
                </span>
                <span className="text-sm text-gray-600">{showAdvanced ? '▲' : '▼'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-4 p-4 bg-purple-50 rounded-lg">
                  {/* Mode de simulation */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mode de simulation
                    </label>
                    <div className="space-y-2">
                      {['dsge', 'abm', 'hybrid'].map(mode => (
                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="mode"
                            checked={params.modeSimulation === mode}
                            onChange={() => updateParam('modeSimulation', mode)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">
                            {mode === 'dsge' && '🔬 DSGE (Équilibre Général)'}
                            {mode === 'abm' && '👥 Agent-Based (Micro-simulation)'}
                            {mode === 'hybrid' && '🔄 Hybride (DSGE + ABM)'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Options de modélisation
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={params.includeAnticipations}
                          onChange={(e) => updateParam('includeAnticipations', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Inclure anticipations rationnelles</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={params.includeThresholds}
                          onChange={(e) => updateParam('includeThresholds', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Inclure effets de seuil</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={params.includeSectoralEffects}
                          onChange={(e) => updateParam('includeSectoralEffects', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Analyse sectorielle détaillée</span>
                      </label>
                    </div>
                  </div>

                  {/* Paramètres DSGE */}
                  {(params.modeSimulation === 'dsge' || params.modeSimulation === 'hybrid') && (
                    <>
                      <Slider
                        label="Aversion au risque (σ)"
                        value={params.aversionRisque}
                        onChange={(val) => updateParam('aversionRisque', val)}
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        info="Coefficient d'aversion relative au risque. Plus élevé = ménages plus prudents."
                      />
                      <Slider
                        label="Élasticité offre de travail (φ)"
                        value={params.elasticiteOffreTravail}
                        onChange={(val) => updateParam('elasticiteOffreTravail', val)}
                        min={0.3}
                        max={2.0}
                        step={0.1}
                        info="Élasticité de Frisch. Sensibilité de l'offre de travail au salaire réel."
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Horizon temporel */}
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
                ℹ️ Modèle DSGE avec {params.includeAnticipations ? 'anticipations rationnelles' : 'anticipations adaptatives'}, 
                {params.includeThresholds ? 'effets de seuil' : 'linéarité'}, 
                et analyse {params.includeSectoralEffects ? 'sectorielle complète (10 secteurs)' : 'agrégée'}.
              </p>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Résultats clés agrégés */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Résultats estimés (modèle {params.modeSimulation.toUpperCase()})</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ResultCard
                icon={Briefcase}
                titre="Impact sur l'emploi"
                valeur={formatNumber(resultats.emploi?.absolu || 0)}
                unite="emplois"
                tendance={resultats.emploi?.absolu < 0 ? 'negatif' : 'positif'}
                fourchette={resultats.emploi?.fourchette && {
                  min: formatNumber(resultats.emploi.fourchette.min),
                  max: formatNumber(resultats.emploi.fourchette.max)
                }}
                description={`${formatPourcent(resultats.emploi?.pourcent || 0, 2)} de l'emploi total`}
                alerte={Math.abs(resultats.emploi?.absolu || 0) > 300000}
              />

              <ResultCard
                icon={DollarSign}
                titre="Pouvoir d'achat (bas revenus)"
                valeur={formatPourcent(resultats.pouvoirAchat?.basRevenus || 0, 1, true)}
                tendance={resultats.pouvoirAchat?.basRevenus > 0 ? 'positif' : 'negatif'}
                description="Variation réelle (après inflation)"
              />

              <ResultCard
                icon={TrendingUp}
                titre="Inflation supplémentaire"
                valeur={formatPourcent(resultats.inflation?.supplementaire || 0, 2, true)}
                unite="points"
                tendance={resultats.inflation?.supplementaire > 1 ? 'negatif' : 'neutre'}
                description={`Inflation totale: ${formatPourcent(resultats.inflation?.totale || 0, 1)}`}
              />

              <ResultCard
                icon={Building2}
                titre="PIB"
                valeur={formatPourcent(resultats.pib?.variation || 0, 2, true)}
                tendance={resultats.pib?.variation > 0 ? 'positif' : 'negatif'}
                description={`${formatEuro((resultats.pib?.valeur || 0), 0)} (${formatEuro((resultats.pib?.composantes?.consommation || 0), 0)} C + ${formatEuro((resultats.pib?.composantes?.investissement || 0), 0)} I)`}
              />
            </div>
          </div>

          {/* Trajectoire temporelle */}
          {resultats.emploi?.trajectory && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Évolution temporelle</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resultats.emploi.trajectory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" label={{ value: 'Années', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="emploi" stroke="#003D7A" strokeWidth={3} name="Emploi total" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Effets de substituabilité */}
          {resultats.substitution && (
            <SubstitutionEffects substitution={resultats.substitution} />
          )}

          {/* Effets sectoriels */}
          {params.includeSectoralEffects && resultats.secteurs && (
            <SectoralResults secteurs={resultats.secteurs} />
          )}

          {/* Boucles de rétroaction */}
          {resultats.feedbackLoops && (
            <FeedbackLoops loops={resultats.feedbackLoops} />
          )}

          {/* Méthodologie avancée */}
          <div className="bg-blue-50 border-l-4 border-cftc-blue rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🔬 Méthodologie avancée</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>Modèle utilisé:</strong>
                {params.modeSimulation === 'dsge' && (
                  <p>DSGE (Dynamic Stochastic General Equilibrium) inspiré de Smets & Wouters (2007). 
                  Résolution d'équilibre général avec anticipations {params.includeAnticipations ? 'rationnelles' : 'adaptatives'}, 
                  rigidités nominales (Calvo θ=0.75), et substitution capital-travail (CES).</p>
                )}
                {params.modeSimulation === 'abm' && (
                  <p>Agent-Based Model avec 10 000 ménages hétérogènes et 1 000 entreprises (TPE/PME/GE). 
                  Décisions micro-fondées avec matching probabiliste sur le marché du travail. Capture l'hétérogénéité 
                  par âge, qualification, et secteur.</p>
                )}
                {params.modeSimulation === 'hybrid' && (
                  <p>Modèle hybride combinant équilibre général macro (DSGE) et simulation micro (ABM). 
                  Permet d'identifier les biais d'agrégation et les effets émergents non-capturés par les modèles représentatifs.</p>
                )}
              </div>
              
              {params.includeSectoralEffects && (
                <div>
                  <strong>Analyse Input-Output:</strong>
                  <p>Matrice de Leontief avec 10 secteurs. Propagation intersectorielle sur 5 itérations. 
                  Effets directs + indirects + induits. Calibration sur TES 2019 INSEE.</p>
                </div>
              )}
              
              {params.includeThresholds && (
                <div>
                  <strong>Effets de seuil:</strong>
                  <p>Modélisation des non-linéarités avec fonctions sigmoïdes. Au-delà de +15% de hausse salariale, 
                  amplification des effets (multiplicateur ×1.5). Au-delà de +25%, effets explosifs (×2.5).</p>
                </div>
              )}
              
              <div>
                <strong>Sources:</strong>
                <p>Smets & Wouters (2007) DSGE, Hamermesh (1993) élasticités, Card & Lemieux (2001) substituabilité, 
                INSEE TES 2019, DARES 2023, Banque de France 2024.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
