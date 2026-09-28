import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UploadDropzone } from './components/UploadDropzone';
import { SamplePicker } from './components/SamplePicker';
import { DiagnosticCard } from './components/DiagnosticCard';
import { GuideModal } from './components/GuideModal';
import { ImagePayload, urlToImagePayload } from './utils/imageUtils';
import { SampleLeaf } from './data/samples';
import { DiagnosticResult } from './types/diagnosis';
import { Leaf, ShieldCheck, Microscope, Sprout } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Inspecting leaf architecture & chlorophyll distribution...',
  'Screening for necrotic lesions, chlorotic rings, & mold...',
  'Evaluating pathogen signatures against tomato pathology database...',
  'Formulating certainty rating & practical recommendations...',
];

export default function App() {
  const [currentImage, setCurrentImage] = useState<ImagePayload | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStageIndex, setAnalysisStageIndex] = useState(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle through diagnostic stage messages during analysis
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalysisStageIndex(0);
      interval = setInterval(() => {
        setAnalysisStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Handle user uploaded or dragged image
  const handleImageSelected = (payload: ImagePayload) => {
    setCurrentImage(payload);
    setSelectedSampleId(null);
    setDiagnosticResult(null);
    setErrorMessage(null);
  };

  // Handle selection of curated sample leaves
  const handleSelectSample = async (sample: SampleLeaf) => {
    try {
      setErrorMessage(null);
      setDiagnosticResult(null);
      setSelectedSampleId(sample.id);

      const payload = await urlToImagePayload(sample.imageSrc, `${sample.id}.jpg`);
      setCurrentImage(payload);
    } catch (err: any) {
      setErrorMessage('Failed to load sample image. Please try again.');
    }
  };

  const handleClearImage = () => {
    setCurrentImage(null);
    setSelectedSampleId(null);
    setDiagnosticResult(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    handleClearImage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Run Diagnosis
  const handleDiagnose = async () => {
    if (!currentImage) {
      setErrorMessage('Please upload or select a tomato leaf image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setDiagnosticResult(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: currentImage.base64,
          mimeType: currentImage.mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete leaf diagnosis.');
      }

      setDiagnosticResult(data as DiagnosticResult);

      // Smooth scroll to the result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while communicating with the diagnostic engine.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar */}
      <Header
        onReset={handleReset}
        onOpenGuide={() => setIsGuideOpen(true)}
        hasActiveImage={!!currentImage || !!diagnosticResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tomato Leaf Diagnostic Tool</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            Precision Foliar Disease Diagnosis for Tomato Crops
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Upload or snap a close-up photo of a tomato leaf to instantly identify foliar diseases, evaluate symptom certainty, and receive actionable agronomic recommendations.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>Visual Symptom Analysis</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Certainty Rating (No Fake %)</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Practical Grower Guidance</span>
            </span>
          </div>
        </section>

        {/* Quick Test Leaf Samples */}
        <section aria-label="Sample Test Leaves">
          <SamplePicker
            onSelectSample={handleSelectSample}
            selectedSampleId={selectedSampleId}
            disabled={isAnalyzing}
          />
        </section>

        {/* Upload & Dropzone Area */}
        <section aria-label="Leaf Photo Upload">
          <UploadDropzone
            currentImage={currentImage}
            onImageSelected={handleImageSelected}
            onClearImage={handleClearImage}
            onDiagnose={handleDiagnose}
            isAnalyzing={isAnalyzing}
            analysisStageText={ANALYSIS_STAGES[analysisStageIndex]}
            errorMessage={errorMessage}
          />
        </section>

        {/* Diagnostic Results Section (rendered directly below upload area) */}
        {diagnosticResult && (
          <section ref={resultRef} aria-label="Diagnostic Results" className="scroll-mt-20">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Diagnostic Assessment
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Model: Gemini 3.8 Flash Vision
              </span>
            </div>
            <DiagnosticCard result={diagnosticResult} onReset={handleReset} />
          </section>
        )}
      </main>

      {/* Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Agricultural Disclaimer Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">AgriVision</span>
            <span aria-hidden="true">·</span>
            <span>Tomato Leaf Health Diagnostics</span>
          </div>
          <div className="text-center sm:text-right max-w-md">
            For critical commercial cultivation or widespread blights, cross-verify visual assessments with local agricultural extension specialists.
          </div>
        </div>
      </footer>
    </div>
  );
}
