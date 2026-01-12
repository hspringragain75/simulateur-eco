import React, { useState, useMemo } from 'react';
import { Clock, Briefcase, DollarSign, TrendingUp, Building2, Leaf, Heart } from 'lucide-react';
import Slider from '../components/Slider';
import ResultCard from '../components/ResultCard';
import { SCENARIOS, DONNEES_BASE } from '../data/modeles';
import { calculerImpact32h, formatNumber, formatPourcent, formatEuro } from '../utils/calculs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Simulateur32h() {
  const scenario = SCENARIOS.semaine32h;
  
  const [params, setParams] = useState({
    heuresHebdo: scenario.curseurs.heuresHebdo.default,
    maintienSalaire: scenario.curseurs.maintienSalaire.default,
    embauches: scenario.curseurs.embauches.default,
    gainProductivite: scenario.curseurs.gainProductivite.default,
    elasticiteEmploi: scenario.curseurs.elasticiteEmploi.default,
    transmissionPrix: scenario.curseurs.transmissionPrix.default,
    horizonTemporel: scenario.curseurs.horizonTemporel.default
  });

  const resultats = useMemo(() => calculerImpact32h(params), [params]);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Données pour le graphique emploi
  const donneesEmploi = [
    { categorie: 'Créations', valeur: resultats.emploi.creations, fill: '#2A9D8F' },
    { categorie: 'Destructions', valeur: Math.abs(resultats.emploi.destructions), fill: '#E63946' },
    { categorie: 'Net', valeur: resultats.emploi.net, fill: resultats.emploi.net > 0 ? '#2A9D8F' : '#E63946' }
  ];

  // Données pour l'évolution temporelle
  const donneesTemporelles = useMemo(() => {
    const data = [];
    for (let annee = 0; annee <= params.horizonTemporel; annee++) {
      const facteurProgression = annee / params.horizonTemporel;
      data.push({
        annee: `An ${annee}`,
        emploi: resultats.emploi.net * facteurProgression,
        chomage: DONNEES_BASE.tauxChomage * 100 + (resultats.emploi.nouveauTauxChomage - DONNEES_BASE.tauxChomage * 100) * facteurProgression,
      });
    }
    return data;
  }, [params.horizonTemporel, resultats]);

  const reductionTemps = ((35 - params.heuresHebdo) / 35) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cftc-blue to-blue-700 text-white p-6 rounded-lg mb-6">
        <h2 className="text-3xl font-bold mb-2">🇫🇷 Et si la France passait à {params.heuresHebdo}h hebdomadaires ?</h2>
        <p className="text-blue-100">{scenario.description}</p>
        <div className="mt-4 flex gap-6 text-sm flex-wrap">
          <div>
            <span className="opacity-75">Durée actuelle: </span>
            <span className="font-bold">35h/semaine</span>
          </div>
          <div>
            <span className="opacity-75">Réduction: </span>
            <span className="font-bold">-{reductionTemps.toFixed(1)}%</span>
          </div>
          <div>
            <span className="opacity-75">Temps libéré: </span>
            <span className="font-bold">{resultats.tempsLibere.joursEquivalents} jours/an</span>
          </div>
          <div>
            <span className="opacity-75">Maintien salaire: </span>
            <span className="font-bold">{(params.maintienSalaire * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panneau de contrôle */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Paramètres de simulation</h3>
            
            <Slider
              label="Heures hebdomadaires"
              value={params.heuresHebdo}
              onChange={(val) => updateParam('heuresHebdo', val)}
              min={scenario.curseurs.heuresHebdo.min}
              max={scenario.curseurs.heuresHebdo.max}
              step={scenario.curseurs.heuresHebdo.step}
              unite={scenario.curseurs.heuresHebdo.unite}
              info="Nombre d'heures travaillées par semaine. Actuellement 35h en France."
            />

            <Slider
              label={scenario.curseurs.maintienSalaire.label}
              value={params.maintienSalaire}
              onChange={(val) => updateParam('maintienSalaire', val)}
              min={scenario.curseurs.maintienSalaire.min}
              max={scenario.curseurs.maintienSalaire.max}
              step={scenario.curseurs.maintienSalaire.step}
              unite={scenario.curseurs.maintienSalaire.unite}
              info={scenario.curseurs.maintienSalaire.info}
            />

            <Slider
              label={scenario.curseurs.embauches.label}
              value={params.embauches}
              onChange={(val) => updateParam('embauches', val)}
              min={scenario.curseurs.embauches.min}
              max={scenario.curseurs.embauches.max}
              step={scenario.curseurs.embauches.step}
              unite={scenario.curseurs.embauches.unite}
              info={scenario.curseurs.embauches.info}
            />

            <Slider
              label={scenario.curseurs.gainProductivite.label}
              value={params.gainProductivite}
              onChange={(val) => updateParam('gainProductivite', val)}
              min={scenario.curseurs.gainProductivite.min}
              max={scenario.curseurs.gainProductivite.max}
              step={scenario.curseurs.gainProductivite.step}
              unite={scenario.curseurs.gainProductivite.unite}
              info={scenario.curseurs.gainProductivite.info}
            />

            <Slider
              label={scenario.curseurs.elasticiteEmploi.label}
              value={params.elasticiteEmploi}
              onChange={(val) => updateParam('elasticiteEmploi', val)}
              min={scenario.curseurs.elasticiteEmploi.min}
              max={scenario.curseurs.elasticiteEmploi.max}
              step={scenario.curseurs.elasticiteEmploi.step}
              unite={scenario.curseurs.elasticiteEmploi.unite}
              info="Sensibilité de l'emploi à une hausse du coût horaire du travail."
            />

            <Slider
              label={scenario.curseurs.transmissionPrix.label}
              value={params.transmissionPrix}
              onChange={(val) => updateParam('transmissionPrix', val)}
              min={scenario.curseurs.transmissionPrix.min}
              max={scenario.curseurs.transmissionPrix.max}
              step={scenario.curseurs.transmissionPrix.step}
              unite={scenario.curseurs.transmissionPrix.unite}
              info="Part de la hausse des coûts répercutée dans les prix de vente."
            />

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Horizon temporel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {scenario.curseurs.horizonTemporel.options.map(option => (
                  <button
                    key={option}
                    onClick={() => updateParam('horizonTemporel', option)}
                    className={`py-2 rounded-lg font-medium transition-colors ${
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
                ℹ️ La réduction du temps de travail a des effets complexes : embauches compensatoires, 
                gains de productivité, mais aussi hausse du coût horaire.
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
                titre="Impact emploi net"
                valeur={formatNumber(resultats.emploi.net)}
                unite="emplois"
                tendance={resultats.emploi.net > 0 ? 'positif' : 'negatif'}
                fourchette={{
                  min: formatNumber(resultats.emploi.fourchette.min),
                  max: formatNumber(resultats.emploi.fourchette.max)
                }}
                description={`Taux de chômage: ${formatPourcent(resultats.emploi.nouveauTauxChomage, 1)}`}
                alerte={resultats.emploi.net < -200000}
              />

              <ResultCard
                icon={Clock}
                titre="Temps libéré"
                valeur={resultats.tempsLibere.joursEquivalents}
                unite="jours/an"
                tendance="positif"
                description={`${resultats.tempsLibere.heuresAnnuelles}h/an = ${Math.round(resultats.tempsLibere.heuresAnnuelles / 7)} semaines de 7h`}
              />

              <ResultCard
                icon={DollarSign}
                titre="Pouvoir d'achat"
                valeur={formatPourcent(resultats.pouvoirAchat.variation, 1, true)}
                tendance={resultats.pouvoirAchat.variation > 0 ? 'positif' : 'negatif'}
                description={`Salaire maintenu à ${formatPourcent(resultats.pouvoirAchat.maintienSalaireNet, 0)} (net)`}
              />

              <ResultCard
                icon={TrendingUp}
                titre="Inflation supplémentaire"
                valeur={formatPourcent(resultats.inflation.supplementaire, 2, true)}
                unite="points"
                tendance={resultats.inflation.supplementaire > 1.5 ? 'negatif' : 'neutre'}
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
                description="Solde net annuel"
              />

              <ResultCard
                icon={Leaf}
                titre="Impact environnemental"
                valeur={formatPourcent(resultats.environnement.reductionEmissions, 1, true)}
                unite="émissions CO2"
                tendance="positif"
                description={`Économies santé: ${formatEuro(resultats.environnement.economiesSante, 1)}`}
              />
            </div>
          </div>

          {/* Graphique emploi détaillé */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💼 Décomposition de l'impact sur l'emploi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donneesEmploi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categorie" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Bar dataKey="valeur" fill="#003D7A" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">{formatNumber(resultats.emploi.creations)}</div>
                <div className="text-gray-600">Embauches compensatoires</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600">{formatNumber(resultats.emploi.destructions)}</div>
                <div className="text-gray-600">Pertes (coût horaire)</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${resultats.emploi.net > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatNumber(resultats.emploi.net)}
                </div>
                <div className="text-gray-600">Solde net</div>
              </div>
            </div>
          </div>

          {/* Évolution du chômage */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📉 Évolution du taux de chômage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donneesTemporelles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis domain={[5, 8]} />
                <Tooltip formatter={(value, name) => [formatPourcent(value, 1), 'Taux de chômage']} />
                <Legend />
                <Line type="monotone" dataKey="chomage" stroke="#003D7A" strokeWidth={3} name="Taux de chômage (%)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 text-sm text-gray-600">
              Taux actuel: {formatPourcent(DONNEES_BASE.tauxChomage * 100, 1)} 
              → Nouveau taux: {formatPourcent(resultats.emploi.nouveauTauxChomage, 1)}
            </div>
          </div>

          {/* Coût pour les entreprises */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏭 Coût pour les entreprises</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Augmentation masse salariale</span>
                <span className="font-semibold text-red-600">+{formatEuro(resultats.coutEntreprises.augmentationTotale, 1)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Dont hausse coût horaire</span>
                <span className="font-semibold text-gray-900">{formatPourcent(resultats.coutEntreprises.augmentationHoraire, 1, true)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Coût embauches compensatoires</span>
                <span className="font-semibold text-red-600">+{formatEuro(resultats.coutEntreprises.coutEmbauches, 1)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Gains de productivité</span>
                <span className="font-semibold text-green-600">-{formatEuro(resultats.coutEntreprises.compensationProductivite, 1)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                <span className="text-gray-900 font-bold">Coût net</span>
                <span className="font-bold text-lg text-red-600">
                  +{formatEuro(resultats.coutEntreprises.augmentationTotale, 1)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <strong>Compensation par la productivité:</strong> {formatPourcent(resultats.productivite.compensationCout, 0)} du surcoût
            </div>
          </div>

          {/* Bénéfices qualitatifs */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Bénéfices qualitatifs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Santé et bien-être</div>
                  <div className="text-sm text-gray-600">Réduction du stress, des burn-outs et des arrêts maladie. 
                  Économies santé estimées: {formatEuro(resultats.environnement.economiesSante, 1)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Environnement</div>
                  <div className="text-sm text-gray-600">Réduction des déplacements et de l'activité économique. 
                  Émissions CO2: {formatPourcent(resultats.environnement.reductionEmissions, 1)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Temps libre</div>
                  <div className="text-sm text-gray-600">{resultats.tempsLibere.joursEquivalents} jours/an pour la famille, 
                  les loisirs, la formation, l'engagement associatif</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Productivité</div>
                  <div className="text-sm text-gray-600">Salariés plus reposés, plus motivés. 
                  Gain productivité horaire: {formatPourcent(resultats.productivite.gainHoraire, 1, true)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Méthodologie et sources */}
          <div className="bg-blue-50 border-l-4 border-cftc-blue rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📚 Méthodologie & Sources</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Embauches compensatoires:</strong> Expérience 35h (1998-2000), études DARES</p>
              <p><strong>Gains de productivité:</strong> Méta-analyses sur réduction temps de travail (Pencavel 2015, ILO 2018)</p>
              <p><strong>Élasticité emploi:</strong> Hamermesh (1993), Crépon & Kramarz (2002)</p>
              <p><strong>Impact santé:</strong> Études scandinaves sur 6h/jour, rapport Santé Publique France</p>
              <p><strong>Impact environnemental:</strong> Modèles INPUT-OUTPUT, études sur décroissance du temps de travail</p>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-gray-600">
                ⚠️ <strong>Avertissement:</strong> La réduction du temps de travail a des effets très débattus. 
                Les résultats dépendent fortement des modalités de mise en œuvre (accompagnement, progressivité, 
                aides publiques) et du contexte économique. Les bénéfices qualitatifs (santé, bien-être, environnement) 
                sont réels mais difficilement quantifiables avec précision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
