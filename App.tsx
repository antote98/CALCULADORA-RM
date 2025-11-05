
import React, { useState, useCallback } from 'react';
import { AllWeights, WeightEntry } from './types';
import { PERCENTAGES, TABS, EXERCISES } from './constants';
import { Tabs } from './components/Tabs';
import { Calculator } from './components/Calculator';
import { SummaryTable } from './components/SummaryTable';

const initialWeightEntry: WeightEntry[] = PERCENTAGES.map(p => ({
  percentage: p,
  weight: '',
}));

const initialAllWeights: AllWeights = EXERCISES.reduce((acc, exercise) => {
    acc[exercise] = JSON.parse(JSON.stringify(initialWeightEntry)); // Deep copy
    return acc;
}, {} as AllWeights);


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [allWeights, setAllWeights] = useState<AllWeights>(initialAllWeights);

  const handleWeightChange = useCallback((changedPercentage: number, newWeightStr: string) => {
    if (EXERCISES.indexOf(activeTab) === -1) return; // Do nothing on summary tab

    const exercise = activeTab;

    if (newWeightStr === '' || isNaN(parseFloat(newWeightStr))) {
      setAllWeights(prev => ({
        ...prev,
        [exercise]: JSON.parse(JSON.stringify(initialWeightEntry))
      }));
      return;
    }

    const newWeight = parseFloat(newWeightStr);
    if (newWeight <= 0) {
      setAllWeights(prev => ({
        ...prev,
        [exercise]: JSON.parse(JSON.stringify(initialWeightEntry))
      }));
      return;
    }
    
    const oneRm = (newWeight / changedPercentage) * 100;

    const newWeightsForExercise = PERCENTAGES.map(p => {
      const calculatedWeight = (oneRm * p) / 100;
      const roundedWeight = Math.round(calculatedWeight * 2) / 2;
      return {
        percentage: p,
        weight: roundedWeight,
      };
    });

    setAllWeights(prev => ({
        ...prev,
        [exercise]: newWeightsForExercise
    }));
  }, [activeTab]);

  const handleReset = useCallback(() => {
    if (EXERCISES.indexOf(activeTab) === -1) return;
    const exercise = activeTab;
    setAllWeights(prev => ({
        ...prev,
        [exercise]: JSON.parse(JSON.stringify(initialWeightEntry))
    }));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto mt-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Calculadora de RM
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Selecciona un ejercicio, introduce un peso y calcula tu 1RM al instante.
          </p>
        </header>

        <Tabs tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />

        {activeTab !== 'Resumen' ? (
           <div className="w-full max-w-2xl mx-auto">
             <Calculator
              weights={allWeights[activeTab]}
              onWeightChange={handleWeightChange}
              onReset={handleReset}
            />
           </div>
        ) : (
            <SummaryTable allWeights={allWeights} />
        )}
        
        <footer className="text-center mt-8 mb-4">
            <p className="text-slate-500 text-sm">Diseñado para atletas de fuerza.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
