import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertOctagon,
  ShieldCheck,
  Stethoscope,
  Lightbulb,
  Info,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DiagnosticResult } from '../types/diagnosis';

interface DiagnosticCardProps {
  result: DiagnosticResult;
  onReset: () => void;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ result, onReset }) => {
  const {
    isPlantLeaf,
    status,
    diseaseName,
    confidence,
    observedSymptoms,
    recommendation,
    cropIdentified,
    notLeafExplanation,
  } = result;

  // Handle case where uploaded image was not a plant leaf
  if (!isPlantLeaf) {
    return (
      <div className="w-full bg-white rounded-2xl border border-amber-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                Not a Plant Leaf
              </span>
              <span className="text-xs text-slate-500 font-medium">Evaluation Terminated</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Unrecognized or Non-Vegetative Specimen
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {notLeafExplanation ||
                'The uploaded image does not appear to contain a plant leaf. AgriVision is specialized strictly for tomato foliage pathology and cannot diagnose non-plant objects, humans, or processed foods.'}
            </p>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-900">
                <Info className="w-3.5 h-3.5" />
                <span>Tips for accurate leaf analysis:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-amber-800">
                <li>Capture a clear, well-lit photo of a single tomato leaf blade.</li>
                <li>Hold the camera 6 to 12 inches away to focus on lesion textures.</li>
                <li>Avoid excessive glare or harsh shadows across the leaf surface.</li>
              </ul>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload a Tomato Leaf</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Plant Leaf Diagnosis
  const isHealthy = status === 'Healthy';
  const isDiseased = status === 'Diseased';
  const isUncertain = status === 'Uncertain';

  // Confidence styling
  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            High Certainty
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Medium Certainty
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Low Certainty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Uncertain
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Banner Status Bar */}
      <div
        className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${
          isHealthy
            ? 'bg-emerald-50/70 border-emerald-100'
            : isDiseased
              ? 'bg-amber-50/70 border-amber-100'
              : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
              isHealthy
                ? 'bg-emerald-600 text-white'
                : isDiseased
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-600 text-white'
            }`}
          >
            {isHealthy && <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />}
            {isDiseased && <AlertTriangle className="w-5 h-5 stroke-[2.2]" />}
            {isUncertain && <HelpCircle className="w-5 h-5 stroke-[2.2]" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isHealthy
                    ? 'text-emerald-800'
                    : isDiseased
                      ? 'text-amber-900'
                      : 'text-slate-700'
                }`}
              >
                {isHealthy ? 'Healthy Specimen' : isDiseased ? 'Pathology Detected' : 'Uncertain Diagnosis'}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                {cropIdentified || 'Tomato (Solanum lycopersicum)'}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">
              {isHealthy
                ? 'Healthy Leaf — No Active Disease Detected'
                : isDiseased
                  ? diseaseName || 'Unspecified Disease Symptom'
                  : 'Symptom Pattern Ambiguous'}
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          {getConfidenceBadge(confidence)}
        </div>
      </div>

      {/* Main Diagnostic Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Metric / Diagnosis Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Plant Health Status</span>
            </div>
            <div
              className={`text-lg font-bold ${
                isHealthy
                  ? 'text-emerald-700'
                  : isDiseased
                    ? 'text-amber-700'
                    : 'text-slate-700'
              }`}
            >
              {status}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHealthy
                ? 'Chlorophyll lamina intact'
                : isDiseased
                  ? 'Active foliar infection'
                  : 'Inconclusive visual evidence'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-600" />
              <span>Identified Pathology</span>
            </div>
            <div className="text-lg font-bold text-slate-900 truncate">
              {isHealthy
                ? 'None (Clean foliar structure)'
                : isDiseased
                  ? diseaseName || 'Pathological lesion detected'
                  : 'Undetermined'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Certainty rated strictly as {confidence} without speculative metrics
            </div>
          </div>
        </div>

        {/* Observed Visual Symptoms Section */}
        {observedSymptoms && (
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Observed Visual Symptoms</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans">
              {observedSymptoms}
            </div>
          </div>
        )}

        {/* Practical Farmer Recommendation (High-Priority Action Box) */}
        <div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
            <span>Practical Recommendation for the Farmer</span>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-emerald-950 mb-1">
                {isHealthy
                  ? 'Recommended Maintenance Practice'
                  : isDiseased
                    ? 'Recommended Treatment & Containment'
                    : 'Recommended Follow-up Steps'}
              </div>
              <p className="text-sm text-emerald-900 leading-relaxed font-sans">
                {recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footnotes & Reset */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>Focus crop: Tomato</span>
            <span aria-hidden="true">·</span>
            <span>Stateless analysis</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Vision</span>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another Leaf</span>
          </button>
        </div>
      </div>
    </div>
  );
};
