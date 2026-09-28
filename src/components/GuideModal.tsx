import React from 'react';
import { X, CheckCircle2, AlertTriangle, Camera, ShieldAlert } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tomato Leaf Pathology Guide</h3>
            <p className="text-xs text-slate-500">Diagnostic references & imaging recommendations</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Section 1: Target Focus */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>How to Capture Leaves for Best Results</span>
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs leading-relaxed">
              <p>• <strong>Distance:</strong> Photograph 6 to 12 inches away from the leaf blade.</p>
              <p>• <strong>Lighting:</strong> Use diffuse natural daylight. Avoid harsh shadows or direct blinding camera flash.</p>
              <p>• <strong>Detail:</strong> Ensure distinct lesion edges, target rings, or spot centers are in sharp focus.</p>
              <p>• <strong>Single Leaf:</strong> Focus on one representative leaf rather than the entire bush.</p>
            </div>
          </div>

          {/* Section 2: Common Tomato Foliage Diseases */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Common Tomato Leaf Diseases Screened</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900">Early Blight (Alternaria solani)</div>
                <div className="text-slate-600 mt-0.5">
                  Characterized by brown to black concentric rings resembling a target board, commonly surrounded by a chlorotic yellow halo on older lower leaves.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900">Late Blight (Phytophthora infestans)</div>
                <div className="text-slate-600 mt-0.5">
                  Large, irregular, water-soaked greyish-green lesions that rapidly turn dark brown or black, often with delicate white fungal mold on leaf undersides in humid conditions.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900">Septoria Leaf Spot (Septoria lycopersici)</div>
                <div className="text-slate-600 mt-0.5">
                  Numerous circular spots (1/8 inch across) with dark brown margins and light tan or grey centers, often dotted with tiny black fruiting bodies.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900">Tomato Leaf Mold (Passalora fulva)</div>
                <div className="text-slate-600 mt-0.5">
                  Pale green or yellowish spots with indefinite margins on upper leaf surfaces, corresponding to olive-green or velvety brown mold underneath.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Diagnostic Philosophy */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Confidence Policy</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AgriVision relies strictly on visible leaf symptoms. It will never guess or output fabricated percentage probabilities. If the specimen is ambiguous or out of focus, it reports &ldquo;Uncertain&rdquo; with clear guidance on re-testing.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
