import React, { useRef, useState, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, X, Scan, Loader2, AlertCircle } from 'lucide-react';
import { ImagePayload, formatBytes, validateImageFile, fileToImagePayload } from '../utils/imageUtils';

interface UploadDropzoneProps {
  currentImage: ImagePayload | null;
  onImageSelected: (payload: ImagePayload) => void;
  onClearImage: () => void;
  onDiagnose: () => void;
  isAnalyzing: boolean;
  analysisStageText: string;
  errorMessage: string | null;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  currentImage,
  onImageSelected,
  onClearImage,
  onDiagnose,
  isAnalyzing,
  analysisStageText,
  errorMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnalyzing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isAnalyzing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
    // reset input so same file can be re-selected if desired
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error || 'Invalid file format.');
      return;
    }

    try {
      const payload = await fileToImagePayload(file);
      onImageSelected(payload);
    } catch (err: any) {
      alert(err?.message || 'Error processing selected image.');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isAnalyzing}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isAnalyzing}
      />

      {!currentImage ? (
        /* Empty Upload State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'bg-emerald-50/70 border-2 border-dashed border-emerald-500'
              : 'hover:bg-slate-50/70 border-2 border-dashed border-slate-300'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-700 shadow-xs transition-transform group-hover:scale-105">
            <UploadCloud className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">
            Upload a close-up photo of a tomato leaf
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Drag and drop your leaf photo here, or browse from your device. Make sure the leaf veins and lesions are in clear focus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Take Photo</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-600">
            <span>Supports JPG, PNG, WEBP</span>
            <span aria-hidden="true">·</span>
            <span>Up to 15MB</span>
            <span aria-hidden="true">·</span>
            <span>Macro leaf view recommended</span>
          </div>
        </div>
      ) : (
        /* Image Preview & Active State */
        <div className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Image Preview Container */}
            <div className="w-full lg:w-1/2 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-4/3 flex items-center justify-center group">
              <img
                src={currentImage.previewUrl}
                alt="Selected tomato leaf"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {/* Scanning Laser Animation during Analysis */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Corner Targets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                  {/* Moving Laser Beam */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-line" />

                  {/* Realtime stage badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-lg p-2.5 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
                    <span className="truncate font-mono">{analysisStageText}</span>
                  </div>
                </div>
              )}

              {/* Clear button overlay (when not analyzing) */}
              {!isAnalyzing && (
                <button
                  type="button"
                  onClick={onClearImage}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls & Metadata Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {currentImage.fileName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatBytes(currentImage.fileSizeBytes)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="uppercase">{currentImage.mimeType.replace('image/', '')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Ready for diagnosis</span>
                    </div>
                  </div>

                  {!isAnalyzing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Change photo
                    </button>
                  )}
                </div>

                {/* Diagnostic Guidelines info */}
                <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inspection Checklist:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    <li>Single crop focus: Tomato (Solanum lycopersicum) leaves.</li>
                    <li>Evaluates lesion shape, concentric rings, chlorosis, and molds.</li>
                    <li>If ambiguous or non-vegetative, the model returns &ldquo;Uncertain&rdquo;.</li>
                  </ul>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Analysis Failed</div>
                      <div>{errorMessage}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={onDiagnose}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isAnalyzing
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      <span>Analyzing Visual Leaf Symptoms...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      <span>Diagnose Leaf Health</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
