import React, { useState } from 'react';
import { BookOpen, Github } from 'lucide-react';
import ScenarioSelector from './components/ScenarioSelector';
import SimulateurSMIC from './simulateurs/SimulateurSMIC';
import SimulateurSMICAvance from './simulateurs/SimulateurSMICAvance';
import Simulateur32h from './simulateurs/Simulateur32h';

const SCENARIOS_DISPONIBLES = [
  { id: 'smic', nom: '💶 SMIC à 15€/h (Simple)' },
  { id: 'smic-avance', nom: '🔬 SMIC Avancé (DSGE/ABM)' },
  { id: '32h', nom: '⏰ Semaine de 32h' }
];

function App() {
  const [scenarioActif, setScenarioActif] = useState('smic');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-cftc-blue sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-cftc-blue text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                🇫🇷
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Et si la France...</h1>
                <p className="text-sm text-gray-600">Simulateur économique interactif • CFTC</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a 
                href="https://github.com/cftc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Code source</span>
              </a>
              <a 
                href="#methodologie" 
                className="flex items-center gap-2 px-3 py-2 bg-cftc-blue hover:bg-blue-800 text-white rounded-lg transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Méthodologie</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            🔬 Un laboratoire pour explorer les politiques économiques
          </h2>
          <p className="text-gray-700 mb-4">
            Ce simulateur vous permet d'explorer les effets économiques de différentes politiques publiques 
            en ajustant les paramètres selon vos propres hypothèses. Les modèles utilisés s'appuient sur 
            la littérature académique et les données officielles (INSEE, DARES, OCDE).
          </p>
          <div className="bg-blue-50 border-l-4 border-cftc-blue p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>💡 Mode d'emploi:</strong> Choisissez un scénario, ajustez les curseurs selon vos hypothèses, 
              et observez les impacts estimés sur l'emploi, les salaires, les prix, les finances publiques, etc. 
              Les fourchettes reflètent l'incertitude inhérente aux modèles économiques.
            </p>
          </div>
        </div>

        {/* Sélecteur de scénario */}
        <ScenarioSelector 
          scenarios={SCENARIOS_DISPONIBLES}
          selectedScenario={scenarioActif}
          onSelect={setScenarioActif}
        />

        {/* Simulateur actif */}
        <div className="mt-6">
          {scenarioActif === 'smic' && <SimulateurSMIC />}
          {scenarioActif === 'smic-avance' && <SimulateurSMICAvance />}
          {scenarioActif === '32h' && <Simulateur32h />}
        </div>

        {/* Footer / Méthodologie */}
        <div id="methodologie" className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 À propos de ce simulateur</h2>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-bold text-lg mb-2">🎯 Objectif</h3>
              <p>
                Ce simulateur a été conçu pour permettre à chacun·e d'explorer de manière interactive 
                les effets économiques potentiels de différentes mesures de politique économique. 
                Il vise à rendre accessible la modélisation économique tout en restant rigoureux 
                sur le plan méthodologique.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">🔬 Méthodologie</h3>
              <p>
                Les modèles utilisés s'appuient sur :
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Des <strong>élasticités économiques</strong> issues de la littérature académique (OCDE, CAE, OFCE, etc.)</li>
                <li>Des <strong>données officielles</strong> (INSEE, DARES, Banque de France)</li>
                <li>Des <strong>modèles macroéconomiques simplifiés</strong> mais cohérents</li>
                <li>Une <strong>transparence totale</strong> sur les hypothèses et leurs sources</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">⚠️ Limites et avertissements</h3>
              <p>
                Les résultats présentés sont des <strong>estimations indicatives</strong> et comportent 
                de nombreuses incertitudes :
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Les modèles économiques ne peuvent capturer toute la complexité de l'économie réelle</li>
                <li>Les élasticités varient selon le contexte et la période</li>
                <li>Les effets de second ordre et les réactions des agents sont partiellement modélisés</li>
                <li>Le contexte international et les politiques d'accompagnement jouent un rôle majeur</li>
              </ul>
              <p className="mt-2">
                Les <strong>fourchettes</strong> affichées reflètent cette incertitude et doivent être 
                considérées comme des ordres de grandeur plutôt que des prévisions précises.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">👥 Contributions</h3>
              <p>
                Ce simulateur est un projet open source. Les contributions, suggestions et critiques 
                méthodologiques sont les bienvenues pour améliorer la qualité des modèles.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">📚 Sources principales</h3>
              <div className="grid md:grid-cols-2 gap-3 mt-2 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Données économiques</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• INSEE - Comptes nationaux</li>
                    <li>• DARES - Emploi et salaires</li>
                    <li>• Banque de France</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Études académiques</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Conseil d'Analyse Économique (CAE)</li>
                    <li>• OCDE Employment Outlook</li>
                    <li>• OFCE - Modèles macro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Simulateur développé par la CFTC • 2026 • 
              <a href="#" className="text-cftc-blue hover:underline ml-1">Mentions légales</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
