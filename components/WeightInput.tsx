import React from 'react';

interface WeightInputProps {
  percentage: number;
  weight: number | string;
  reps: number | string;
  onWeightChange: (percentage: number, newWeight: string) => void;
}

export const WeightInput: React.FC<WeightInputProps> = ({ percentage, weight, reps, onWeightChange }) => {
  const isOneRm = percentage === 100;
  
  const labelText = isOneRm ? "1RM" : `${percentage}%`;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWeightChange(percentage, e.target.value);
  };

  const numericWeight = typeof weight === 'string' && weight !== '' ? parseFloat(weight) : (typeof weight === 'number' ? weight : NaN);
  let weightPerSide: string = '-';

  if (!isNaN(numericWeight) && numericWeight > 0) {
    if (numericWeight > 20) {
      const calculated = (numericWeight - 20) / 2;
      const rounded = Math.round(calculated * 4) / 4;
      weightPerSide = rounded.toString();
    } else {
      weightPerSide = '0';
    }
  }

  return (
    <div className="grid grid-cols-4 items-center gap-4 bg-slate-700/50 rounded-lg p-3">
      <label htmlFor={`weight-${percentage}`} className={`text-lg font-semibold ${isOneRm ? 'text-sky-400' : 'text-slate-300'}`}>
        {labelText}
      </label>
      
      <span className="text-lg font-mono text-center text-slate-400">{reps}</span>

      <span className="text-lg font-mono text-center text-slate-300">
        {weightPerSide}{weightPerSide !== '-' ? <span className="text-sm text-slate-500 ml-1">kg</span> : ''}
      </span>

      <div className="relative">
        <input
          id={`weight-${percentage}`}
          type="number"
          value={weight}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
          step="0.1"
          className="w-full bg-slate-900/80 border-2 border-slate-600 text-white text-lg font-mono text-right rounded-md py-2 pr-10 pl-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          kg
        </span>
      </div>
    </div>
  );
};