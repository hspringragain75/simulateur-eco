import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  unite = '', 
  info,
  disabled = false 
}) {
  const [showInfo, setShowInfo] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {info && (
            <div className="relative">
              <Info 
                className="w-4 h-4 text-gray-400 cursor-help" 
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              />
              {showInfo && (
                <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-cftc-blue">
          {typeof value === 'number' ? value.toFixed(step >= 1 ? 0 : step === 0.1 ? 1 : 2) : value}
          {unite}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #003D7A 0%, #003D7A ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unite}</span>
          <span>{max}{unite}</span>
        </div>
      </div>
    </div>
  );
}
