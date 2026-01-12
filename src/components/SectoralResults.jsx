import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SectoralResults({ secteurs }) {
  const [expandedSector, setExpandedSector] = useState(null);
  const [viewMode, setViewMode] = useState('emploi'); // 'emploi', 'production', 'prix'

  if (!secteurs) return null;

  const secteursList = Object.entries(secteurs).map(([key, data]) => ({
    key,
    ...data
  }));

  // Préparer données pour le graphique
  const chartData = secteursList.map(s => ({
    nom: s.nom.split(',')[0], // Nom court
    emploi: s.emploi.variation,
    production: s.production.variation,
    prix: s.prix.variation
  }));

  const getVariationColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVariationIcon = (value) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Activity;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🏭 Effets sectoriels détaillés</h3>
      
      {/* Sélecteur de vue */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('emploi')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'emploi' 
              ? 'bg-cftc-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Emploi
        </button>
        <button
          onClick={() => setViewMode('production')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'production' 
              ? 'bg-cftc-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Production
        </button>
        <button
          onClick={() => setViewMode('prix')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'prix' 
              ? 'bg-cftc-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Prix
        </button>
      </div>

      {/* Graphique comparatif */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nom" angle={-45} textAnchor="end" height={100} fontSize={11} />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey={viewMode} 
            fill="#003D7A"
            name={viewMode === 'emploi' ? 'Emplois' : viewMode === 'production' ? 'Production (Md€)' : 'Prix (%)'}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Liste détaillée des secteurs */}
      <div className="mt-6 space-y-2">
        {secteursList.map(secteur => {
          const Icon = getVariationIcon(secteur.emploi.variation);
          const isExpanded = expandedSector === secteur.key;
          
          return (
            <div key={secteur.key} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header - toujours visible */}
              <button
                onClick={() => setExpandedSector(isExpanded ? null : secteur.key)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${getVariationColor(secteur.emploi.variation)}`} />
                  <span className="font-medium text-gray-800">{secteur.nom}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-semibold ${getVariationColor(secteur.emploi.variation)}`}>
                      {secteur.emploi.variation > 0 ? '+' : ''}{secteur.emploi.variation.toLocaleString()} emplois
                    </div>
                    <div className="text-xs text-gray-500">
                      {secteur.emploi.initial.toLocaleString()} → {secteur.emploi.final.toLocaleString()}
                    </div>
                  </div>
                  
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Détails - expansible */}
              {isExpanded && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                  {/* Production */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Production</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Initiale:</span>
                          <span className="font-medium">{secteur.production.initiale.toFixed(1)} Md€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Variation:</span>
                          <span className={`font-medium ${getVariationColor(secteur.production.variation)}`}>
                            {secteur.production.variation > 0 ? '+' : ''}{secteur.production.variation.toFixed(2)} Md€
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Finale:</span>
                          <span className="font-medium">{secteur.production.finale.toFixed(1)} Md€</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">💰 Masse salariale</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Initiale:</span>
                          <span className="font-medium">{secteur.masseSalariale.initiale.toFixed(1)} Md€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Variation:</span>
                          <span className={`font-medium ${getVariationColor(secteur.masseSalariale.variation)}`}>
                            {secteur.masseSalariale.variation > 0 ? '+' : ''}{secteur.masseSalariale.variation.toFixed(2)} Md€
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Substitution capital-travail */}
                  {secteur.substitution?.capitalTravail && (
                    <div className="bg-blue-50 rounded p-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">🤖 Substitution capital/travail (automatisation)</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Réduction emploi:</span>
                          <span className="ml-2 font-medium text-red-600">
                            {Math.round(secteur.substitution.capitalTravail.reductionEmploi).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Investissement capital:</span>
                          <span className="ml-2 font-medium text-green-600">
                            +{secteur.substitution.capitalTravail.augmentationCapital.toFixed(2)} Md€
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Substitution entre catégories */}
                  {secteur.substitution?.entreCategories && (
                    <div className="bg-purple-50 rounded p-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">👥 Effets par catégorie de travailleurs</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Jeunes (pertes):</span>
                          <span className="ml-2 font-medium text-red-600">
                            {Math.round(secteur.substitution.entreCategories.jeunes * secteur.emploi.initial).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Seniors (gains):</span>
                          <span className="ml-2 font-medium text-green-600">
                            +{Math.round(secteur.substitution.entreCategories.seniors * secteur.emploi.initial).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Non-qualifiés (pertes):</span>
                          <span className="ml-2 font-medium text-red-600">
                            {Math.round(secteur.substitution.entreCategories.nonQualifies * secteur.emploi.initial).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Qualifiés (gains):</span>
                          <span className="ml-2 font-medium text-green-600">
                            +{Math.round(secteur.substitution.entreCategories.qualifies * secteur.emploi.initial).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prix */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Impact sur les prix:</span>
                    <span className={`font-semibold ${getVariationColor(secteur.prix.variation)}`}>
                      {secteur.prix.variation > 0 ? '+' : ''}{secteur.prix.variation.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Résumé global */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">📊 Résumé agrégé</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Emploi total</div>
            <div className={`text-lg font-bold ${getVariationColor(
              secteursList.reduce((sum, s) => sum + s.emploi.variation, 0)
            )}`}>
              {secteursList.reduce((sum, s) => sum + s.emploi.variation, 0) > 0 ? '+' : ''}
              {Math.round(secteursList.reduce((sum, s) => sum + s.emploi.variation, 0)).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Production totale</div>
            <div className={`text-lg font-bold ${getVariationColor(
              secteursList.reduce((sum, s) => sum + s.production.variation, 0)
            )}`}>
              {secteursList.reduce((sum, s) => sum + s.production.variation, 0) > 0 ? '+' : ''}
              {secteursList.reduce((sum, s) => sum + s.production.variation, 0).toFixed(1)} Md€
            </div>
          </div>
          <div>
            <div className="text-gray-600">Secteurs en croissance</div>
            <div className="text-lg font-bold text-green-600">
              {secteursList.filter(s => s.emploi.variation > 0).length} / {secteursList.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
