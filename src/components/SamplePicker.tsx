import React from 'react';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/samples';
import { Sparkles, Check } from 'lucide-react';

interface SamplePickerProps {
  onSelectSample: (sample: SampleLeaf) => void;
  selectedSampleId: string | null;
  disabled: boolean;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  selectedSampleId,
  disabled,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Test Leaf Samples</span>
        </div>
        <span className="text-xs text-slate-500">
          Click any specimen to run test diagnosis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_LEAVES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSample(sample)}
              className={`group text-left p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 bg-white ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200/80">
                <img
                  src={sample.imageSrc}
                  alt={sample.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                  {sample.name}
                </div>
                <div className="text-xs text-slate-500 italic truncate font-sans">
                  {sample.pathology}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      sample.expectedStatus === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-[11px] font-medium text-slate-600">
                    {sample.expectedStatus}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
