import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelect }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedScenario === scenario.id
              ? 'bg-cftc-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {scenario.nom}
        </button>
      ))}
    </div>
  );
}
