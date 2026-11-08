import React, { useState, useRef } from 'react';
import { AthleteDetails, CertificateTemplate } from '@/types';
import { CertificateRenderer } from './CertificateRenderer';
import { exportCertificateToPdf } from '@/lib/pdf-generator';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface CertificatePreviewProps {
  athlete: AthleteDetails;
  template: CertificateTemplate | null;
  availableTemplates?: CertificateTemplate[];
  onSelectTemplate?: (template: CertificateTemplate) => void;
  onCertificateGenerated?: (athlete: AthleteDetails, template: CertificateTemplate | null) => void;
  onBackToEdit?: () => void;
  onOpenCalibrator?: (template: CertificateTemplate) => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  athlete,
  template,
  availableTemplates = [],
  onSelectTemplate,
  onCertificateGenerated,
  onBackToEdit,
  onOpenCalibrator,
}) => {
  const isPortrait = template?.orientation === 'portrait';
  const [zoomLevel, setZoomLevel] = useState<number>(isPortrait ? 0.7 : 0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const certContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const certElement = document.getElementById('kyorix-printable-certificate');
    if (!certElement) {
      alert('Certificate element not found.');
      return;
    }

    try {
      setIsExporting(true);
      const safeName = athlete.athleteName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeType = athlete.certificateType.replace(/\s+/g, '_');
      const fileName = `Kyorix_${safeType}_${safeName || 'Athlete'}.pdf`;

      await exportCertificateToPdf(certElement, {
        fileName,
        quality: 0.98,
        scale: 2.5,
        orientation: template?.orientation || 'landscape',
      });

      setDownloadSuccess(true);
      if (onCertificateGenerated) {
        onCertificateGenerated(athlete, template);
      }

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Workspace Top Toolbar */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToEdit && (
            <button
              onClick={onBackToEdit}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Return to form editor"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">Certificate Preview Workspace</h2>
              {template?.layoutConfig?.useCustomLayout && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Calibrated Layout
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Active Template:{' '}
              <span className="font-semibold text-slate-700">
                {template ? template.name : 'System Default Vector Standard'}
              </span>{' '}
              ({isPortrait ? 'Portrait' : 'Landscape'})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Calibrate Layout Button */}
          {template && onOpenCalibrator && (
            <button
              onClick={() => onOpenCalibrator(template)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition shadow-sm border border-slate-700"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Calibrate Text Layout</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-slate-700 select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.3, Number((prev + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(isPortrait ? 0.7 : 0.85)}
              className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Reset
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-2 hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating {isPortrait ? 'Portrait' : 'Landscape'} PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Template switcher banner if multiple matching templates exist */}
      {availableTemplates.length > 1 && onSelectTemplate && (
        <div className="bg-white text-slate-800 rounded-xl p-3 px-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Layers className="w-4 h-4 text-cyan-600" />
            <span className="text-slate-600 font-medium">Switch applied template for preview:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {availableTemplates.map(t => {
              const isActive = template?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTemplate(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.name} ({t.orientation || 'landscape'})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Preview Canvas Area */}
      <div className="bg-slate-100 rounded-2xl p-6 md:p-10 border border-slate-200 shadow-inner flex items-center justify-center overflow-auto min-h-[580px]">
        <div
          ref={certContainerRef}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shadow-2xl rounded-sm my-4"
        >
          <CertificateRenderer
            athlete={athlete}
            template={template}
            isExporting={isExporting}
          />
        </div>
      </div>
    </div>
  );
};
