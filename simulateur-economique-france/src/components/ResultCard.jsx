import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

export default function ResultCard({ 
  icon: Icon, 
  titre, 
  valeur, 
  unite = '', 
  variation,
  fourchette,
  description,
  tendance = 'neutre', // 'positif', 'negatif', 'neutre'
  alerte = false
}) {
  const getTendanceColor = () => {
    if (tendance === 'positif') return 'text-green-600 bg-green-50';
    if (tendance === 'negatif') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTendanceIcon = () => {
    if (tendance === 'positif') return TrendingUp;
    if (tendance === 'negatif') return TrendingDown;
    return Minus;
  };

  const TendanceIcon = getTendanceIcon();

  return (
    <div className={`bg-white border-2 rounded-lg p-4 ${alerte ? 'border-yellow-400' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-cftc-blue" />
          <h3 className="font-semibold text-gray-800">{titre}</h3>
        </div>
        {alerte && <AlertCircle className="w-5 h-5 text-yellow-500" />}
      </div>
      
      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{valeur}</span>
          {unite && <span className="text-lg text-gray-600">{unite}</span>}
          {variation !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getTendanceColor()}`}>
              <TendanceIcon className="w-4 h-4" />
              <span>{variation > 0 ? '+' : ''}{variation}</span>
            </div>
          )}
        </div>
        
        {fourchette && (
          <div className="mt-2 text-sm text-gray-600">
            Fourchette: {fourchette.min} à {fourchette.max}{unite}
          </div>
        )}
        
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
}
