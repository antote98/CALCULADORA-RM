
import React, { useRef } from 'react';
import { AllWeights } from '../types';
import { PERCENTAGES, REP_MAP, EXERCISES } from '../constants';

declare const jspdf: any;
declare const html2canvas: any;

interface SummaryTableProps {
  allWeights: AllWeights;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ allWeights }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const doc = new jspdf.jsPDF();

    doc.text("Resumen de Pesos RM", 14, 15);

    const tableHead = [['%RM', 'REPS MAX', ...EXERCISES]];
    const tableBody = PERCENTAGES.map(p => {
        const rowData = [
            p === 100 ? '1RM' : `${p}%`,
            REP_MAP[p].toString(),
        ];

        EXERCISES.forEach(exercise => {
            const entry = allWeights[exercise]?.find(item => item.percentage === p);
            const weight = entry?.weight;
            rowData.push(weight && weight !== '' ? `${weight} kg` : '-');
        });

        return rowData;
    });

    doc.autoTable({
      head: tableHead,
      body: tableBody,
      startY: 20,
      headStyles: { fillColor: [30, 41, 59] }, // slate-800
      styles: { halign: 'center' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      }
    });

    doc.save('RM_Resumen.pdf');
  };

  const handleDownloadPNG = async () => {
    if (!tableContainerRef.current) return;

    try {
      const canvas = await html2canvas(tableContainerRef.current, {
        backgroundColor: '#1e293b', // slate-800
        scale: 2, // Higher resolution
      });
      const link = document.createElement('a');
      link.download = 'RM_Resumen.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PNG image:', error);
    }
  };

  return (
    <>
      <div ref={tableContainerRef} className="bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 p-4 md:p-6 overflow-x-auto">
        <table className="w-full min-w-max text-left table-auto">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="p-3 text-sm font-bold text-slate-400 uppercase tracking-wider">%RM</th>
              <th className="p-3 text-sm font-bold text-slate-400 uppercase tracking-wider text-center">REPS MAX</th>
              {EXERCISES.map((exercise) => (
                <th key={exercise} className="p-3 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">
                  {exercise}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERCENTAGES.map((p) => (
              <tr key={p} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className={`p-3 font-semibold ${p === 100 ? 'text-sky-400' : 'text-slate-300'}`}>
                  {p === 100 ? '1RM' : `${p}%`}
                </td>
                <td className="p-3 font-mono text-center text-slate-400">{REP_MAP[p]}</td>
                {EXERCISES.map((exercise) => {
                  const entry = allWeights[exercise]?.find(item => item.percentage === p);
                  const weight = entry?.weight || '-';
                  return (
                    <td key={`${exercise}-${p}`} className="p-3 font-mono text-right text-white">
                      {weight}{weight !== '-' ? ' kg' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 shadow-md"
        >
          Descargar PDF
        </button>
        <button
          onClick={handleDownloadPNG}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 shadow-md"
        >
          Descargar PNG
        </button>
      </div>
    </>
  );
};