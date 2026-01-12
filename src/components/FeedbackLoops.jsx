import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { RefreshCw, TrendingUp } from 'lucide-react';

export default function FeedbackLoops({ loops }) {
  if (!loops || loops.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-6 h-6 text-cftc-blue" />
        <h3 className="text-xl font-bold text-gray-800">🔄 Boucles de rétroaction</h3>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Mécanisme :</strong> Emploi → Revenus → Consommation → Production → Emploi...
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Les effets initiaux se propagent et s'amplifient (ou s'atténuent) à travers l'économie via ces boucles.
        </p>
      </div>

      {/* Graphique des boucles */}
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={loops}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" label={{ value: 'Années', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Emplois', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value, name) => {
              const labels = {
                emploiDirect: 'Effet direct',
                emploiInduit: 'Effet induit',
                emploiTotal: 'Total'
              };
              return [Math.round(value).toLocaleString(), labels[name] || name];
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="emploiDirect" 
            stackId="1"
            stroke="#003D7A" 
            fill="#003D7A" 
            name="Effet direct"
            fillOpacity={0.8}
          />
          <Area 
            type="monotone" 
            dataKey="emploiInduit" 
            stackId="1"
            stroke="#2A9D8F" 
            fill="#2A9D8F" 
            name="Effet induit (boucles)"
            fillOpacity={0.6}
          />
          <Line 
            type="monotone" 
            dataKey="emploiTotal" 
            stroke="#E63946" 
            strokeWidth={3}
            name="Total"
            dot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Tableau détaillé */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-3 text-gray-700">Année</th>
              <th className="text-right py-2 px-3 text-gray-700">Emploi direct</th>
              <th className="text-right py-2 px-3 text-gray-700">Conso induite (Md€)</th>
              <th className="text-right py-2 px-3 text-gray-700">Prod. induite (Md€)</th>
              <th className="text-right py-2 px-3 text-gray-700">Emploi induit</th>
              <th className="text-right py-2 px-3 text-gray-700 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {loops.map((loop, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{loop.period}</td>
                <td className="text-right py-2 px-3">
                  {Math.round(loop.emploiDirect).toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-green-600">
                  +{loop.consommationInduite.toFixed(2)}
                </td>
                <td className="text-right py-2 px-3 text-blue-600">
                  +{loop.productionInduite.toFixed(2)}
                </td>
                <td className="text-right py-2 px-3 text-green-600">
                  +{loop.emploiInduit.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 font-bold">
                  {loop.emploiTotal > 0 ? '+' : ''}{loop.emploiTotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Multiplicateur effectif */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Multiplicateur effectif</h4>
            <p className="text-xs text-gray-600">
              Rapport entre l'effet total et l'effet direct (dernière année)
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cftc-blue">
              {(loops[loops.length - 1].emploiTotal / loops[loops.length - 1].emploiDirect).toFixed(2)}×
            </div>
            <div className="text-xs text-gray-600">
              {loops[loops.length - 1].emploiInduit > 0 ? 'Amplification' : 'Atténuation'}
            </div>
          </div>
        </div>
      </div>

      {/* Explication */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-xs text-gray-700">
          <strong>💡 Interprétation :</strong> Un choc initial sur l'emploi se propage via la consommation 
          (les nouveaux employés consomment) et la production (les entreprises produisent plus). 
          Ce mécanisme crée des emplois supplémentaires de manière endogène, amplifiant (ou atténuant) l'effet initial.
          C'est le multiplicateur keynésien en action.
        </p>
      </div>
    </div>
  );
}
