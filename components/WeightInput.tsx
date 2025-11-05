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
    <div className="grid grid-cols-12 items-center gap-2 sm:gap-4 bg-slate-700/50 rounded-lg p-3">
      <label htmlFor={`weight-${percentage}`} className={`col-span-2 text-base sm:text-lg font-semibold ${isOneRm ? 'text-sky-400' : 'text-slate-300'}`}>
        {labelText}
      </label>
      
      <span className="col-span-3 text-base sm:text-lg font-mono text-center text-slate-400">{reps}</span>

      <span className="col-span-3 text-base sm:text-lg font-mono text-center text-slate-300">
        {weightPerSide}{weightPerSide !== '-' ? <span className="text-xs sm:text-sm text-slate-500 ml-1">kg</span> : ''}
      </span>

      <div className="col-span-4 flex items-center">
        <input
          id={`weight-${percentage}`}
          type="number"
          value={weight}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
          step="0.1"
          className="w-full bg-slate-900/80 border-2 border-slate-600 text-white text-base sm:text-lg font-mono text-right rounded-md py-2 px-1 sm:px-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
        />
        <span className="ml-2 flex-shrink-0 text-slate-400 text-sm sm:text-base">
          kg
        </span>
      </div>
    </div>
  );
};
