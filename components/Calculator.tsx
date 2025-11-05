import React from 'react';
import { WeightEntry } from '../types';
import { REP_MAP } from '../constants';
import { WeightInput } from './WeightInput';

interface CalculatorProps {
  weights: WeightEntry[];
  onWeightChange: (changedPercentage: number, newWeightStr: string) => void;
  onReset: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ weights, onWeightChange, onReset }) => {
  return (
    <main className="bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-4 gap-4 px-3 text-sm font-bold text-slate-400 uppercase tracking-wider">
        <span className="text-left">%RM</span>
        <span className="text-center">REPS MAX</span>
        <span className="text-center">Peso / Lado</span>
        <span className="text-right">Peso Total</span>
      </div>
      <div className="space-y-4">
        {weights.map(({ percentage, weight }) => (
          <WeightInput
            key={percentage}
            percentage={percentage}
            weight={weight}
            reps={REP_MAP[percentage]}
            onWeightChange={onWeightChange}
          />
        ))}
      </div>
      <button
        onClick={onReset}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Limpiar
      </button>
    </main>
  );
};
