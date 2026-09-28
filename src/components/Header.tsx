import React from 'react';
import { Leaf, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenGuide: () => void;
  hasActiveImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenGuide, hasActiveImage }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single-element brand wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Leaf className="w-4 h-4" />
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <span>AgriVision</span>
            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Tomato Focus
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation / Scope indicator */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
          <span>Solanum lycopersicum</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Visual Pathology Engine</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Gemini Vision</span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 whitespace-nowrap cursor-pointer"
            title="View Leaf Photography & Symptom Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Pathology Guide</span>
          </button>

          {hasActiveImage && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="Reset and start new diagnosis"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>New Scan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
