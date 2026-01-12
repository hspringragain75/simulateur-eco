import React from 'react';
import { Users, Briefcase, GraduationCap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function SubstitutionEffects({ substitution }) {
  if (!substitution) return null;

  const COLORS = {
    pertes: '#E63946',
    gains: '#2A9D8F',
    net: '#003D7A'
  };

  // Données pour graphique âge
  const ageData = [
    { name: 'Jeunes (-30 ans)', value: Math.abs(substitution.parAge.jeunes), type: 'pertes' },
    { name: 'Seniors (+55 ans)', value: Math.abs(substitution.parAge.seniors), type: 'gains' }
  ];

  // Données pour graphique qualification
  const qualifData = [
    { name: 'Non-qualifiés', value: Math.abs(substitution.parQualification.nonQualifies), type: 'pertes' },
    { name: 'Qualifiés', value: Math.abs(substitution.parQualification.qualifies), type: 'gains' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 Effets de substituabilité</h3>

      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Mécanisme :</strong> Face à une hausse du coût de certains types de travailleurs, 
          les entreprises peuvent substituer vers d'autres catégories (seniors vs jeunes, qualifiés vs non-qualifiés).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Substitution par âge */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-cftc-blue" />
            <h4 className="font-semibold text-gray-800">Par tranche d'âge</h4>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'pertes' ? COLORS.pertes : COLORS.gains} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString() + ' emplois'} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <div>
                <div className="font-semibold text-gray-800">Jeunes (-30 ans)</div>
                <div className="text-xs text-gray-600">Pertes d'emplois</div>
              </div>
              <div className="text-xl font-bold text-red-600">
                {substitution.parAge.jeunes.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div>
                <div className="font-semibold text-gray-800">Seniors (+55 ans)</div>
                <div className="text-xs text-gray-600">Gains d'emplois</div>
              </div>
              <div className="text-xl font-bold text-green-600">
                +{substitution.parAge.seniors.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-100 rounded border-2 border-blue-300">
              <div>
                <div className="font-bold text-gray-800">Effet net</div>
              </div>
              <div className={`text-xl font-bold ${substitution.parAge.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {substitution.parAge.net >= 0 ? '+' : ''}{substitution.parAge.net.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Mécanisme :</strong> Les jeunes/non-qualifiés étant plus touchés par la hausse du SMIC, 
            les entreprises peuvent favoriser l'embauche de seniors/qualifiés dont le coût relatif baisse.
          </div>
        </div>

        {/* Substitution par qualification */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-cftc-blue" />
            <h4 className="font-semibold text-gray-800">Par niveau de qualification</h4>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={qualifData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {qualifData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'pertes' ? COLORS.pertes : COLORS.gains} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString() + ' emplois'} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <div>
                <div className="font-semibold text-gray-800">Non-qualifiés</div>
                <div className="text-xs text-gray-600">Pertes d'emplois</div>
              </div>
              <div className="text-xl font-bold text-red-600">
                {substitution.parQualification.nonQualifies.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div>
                <div className="font-semibold text-gray-800">Qualifiés</div>
                <div className="text-xs text-gray-600">Gains d'emplois</div>
              </div>
              <div className="text-xl font-bold text-green-600">
                +{substitution.parQualification.qualifies.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-100 rounded border-2 border-blue-300">
              <div>
                <div className="font-bold text-gray-800">Effet net</div>
              </div>
              <div className={`text-xl font-bold ${substitution.parQualification.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {substitution.parQualification.net >= 0 ? '+' : ''}{substitution.parQualification.net.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Élasticité de substitution :</strong> Les entreprises substituent plus facilement 
            entre jeunes/seniors (σ=0.7) qu'entre qualifiés/non-qualifiés (σ=0.5).
          </div>
        </div>
      </div>

      {/* Synthèse globale */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">📊 Synthèse des effets de substitution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-600 mb-1">Total pertes</div>
            <div className="text-2xl font-bold text-red-600">
              {(Math.abs(substitution.parAge.jeunes) + Math.abs(substitution.parQualification.nonQualifies)).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Total gains</div>
            <div className="text-2xl font-bold text-green-600">
              +{(substitution.parAge.seniors + substitution.parQualification.qualifies).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Effet net</div>
            <div className={`text-2xl font-bold ${
              (substitution.parAge.net + substitution.parQualification.net) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(substitution.parAge.net + substitution.parQualification.net) >= 0 ? '+' : ''}
              {(substitution.parAge.net + substitution.parQualification.net).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Taux compensation</div>
            <div className="text-2xl font-bold text-cftc-blue">
              {(((substitution.parAge.seniors + substitution.parQualification.qualifies) / 
                (Math.abs(substitution.parAge.jeunes) + Math.abs(substitution.parQualification.nonQualifies))) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Note méthodologique */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-xs text-gray-700">
          <strong>📚 Sources :</strong> Élasticités de substitution calibrées sur Hamermesh (1993) "Labor Demand", 
          Card & Lemieux (2001) sur la substituabilité jeunes/vieux, et Autor et al. (2003) sur qualifiés/non-qualifiés.
        </p>
      </div>
    </div>
  );
}
