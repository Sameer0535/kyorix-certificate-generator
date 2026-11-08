import React, { useState, useRef } from 'react';
import { CertificateTemplate, CertificateType, SupportedFileType, TemplateOrientation } from '@/types';
import { renderPdfToImage } from '@/lib/pdf-renderer';
import { DEFAULT_TEMPLATE_LAYOUT, DEFAULT_PORTRAIT_LAYOUT } from '@/lib/default-layout';
import {
  Upload,
  FileImage,
  FileText,
  Trash2,
  RefreshCw,
  Check,
  Tag,
  AlertCircle,
  Sliders,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TemplateManagerProps {
  templates: CertificateTemplate[];
  onSaveTemplate: (template: CertificateTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenCalibrator: (template: CertificateTemplate) => void;
}

const ALL_CERT_TYPES: CertificateType[] = [
  'Gold Medal',
  'Silver Medal',
  'Bronze Medal',
  'Participation',
];

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onSaveTemplate,
  onDeleteTemplate,
  onOpenCalibrator,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  // New template modal/drawer state
  const [templateName, setTemplateName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<CertificateType[]>(['Gold Medal']);
  const [pendingFileDataUrl, setPendingFileDataUrl] = useState<string | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
  const [pendingOrientation, setPendingOrientation] = useState<TemplateOrientation>('landscape');
  const [pendingAspectRatio, setPendingAspectRatio] = useState<number>(1.414);
  const [pendingFileMeta, setPendingFileMeta] = useState<{
    name: string;
    size: number;
    type: SupportedFileType;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    setUploadError(null);
    const validTypes: SupportedFileType[] = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(file.type as SupportedFileType)) {
      setUploadError('Unsupported format. Please upload a PNG, JPG, or PDF template.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB limit. Please upload an optimized file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      setPendingFileDataUrl(dataUrl);
      setPendingFileMeta({
        name: file.name,
        size: file.size,
        type: file.type as SupportedFileType,
      });

      if (!templateName) {
        setTemplateName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }

      // If PDF, render its page to image
      if (file.type === 'application/pdf') {
        setIsProcessingPdf(true);
        try {
          const pdfResult = await renderPdfToImage(dataUrl);
          setPendingPreviewUrl(pdfResult.imageDataUrl);
          setPendingOrientation(pdfResult.orientation);
          setPendingAspectRatio(pdfResult.aspectRatio);
        } catch (pdfErr) {
          console.error('Failed to render PDF preview:', pdfErr);
          setUploadError('Failed to parse PDF pages. Ensure PDF is not password protected.');
        } finally {
          setIsProcessingPdf(false);
        }
      } else {
        // If PNG/JPG image, determine dimensions
        const img = new Image();
        img.onload = () => {
          const isLandscape = img.width >= img.height;
          setPendingOrientation(isLandscape ? 'landscape' : 'portrait');
          setPendingAspectRatio(img.width / img.height);
          setPendingPreviewUrl(dataUrl);
        };
        img.src = dataUrl;
      }

      setIsUploading(true);
    };

    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!pendingFileDataUrl || !pendingFileMeta) return;
    if (!templateName.trim()) {
      setUploadError('Please provide a name for this template.');
      return;
    }
    if (selectedTypes.length === 0) {
      setUploadError('Please assign at least one certificate category.');
      return;
    }

    const defaultLayout =
      pendingOrientation === 'portrait' ? DEFAULT_PORTRAIT_LAYOUT : DEFAULT_TEMPLATE_LAYOUT;

    const newTemplate: CertificateTemplate = {
      id: `template-${Date.now()}`,
      name: templateName.trim(),
      fileName: pendingFileMeta.name,
      fileType: pendingFileMeta.type,
      fileSize: pendingFileMeta.size,
      dataUrl: pendingFileDataUrl,
      previewImageUrl: pendingPreviewUrl || undefined,
      assignedTypes: selectedTypes,
      uploadedAt: new Date().toISOString(),
      isDefault: false,
      orientation: pendingOrientation,
      aspectRatio: pendingAspectRatio,
      layoutConfig: {
        ...defaultLayout,
        orientation: pendingOrientation,
        aspectRatio: pendingAspectRatio,
        useCustomLayout: true,
      },
    };

    onSaveTemplate(newTemplate);
    handleResetModal();
  };

  const handleResetModal = () => {
    setIsUploading(false);
    setPendingFileDataUrl(null);
    setPendingPreviewUrl(null);
    setPendingFileMeta(null);
    setTemplateName('');
    setSelectedTypes(['Gold Medal']);
    setUploadError(null);
    setIsProcessingPdf(false);
  };

  const handleTriggerReplace = (templateId: string) => {
    setReplacingId(templateId);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleExecuteReplace = async (file: File) => {
    if (!replacingId) return;
    const target = templates.find(t => t.id === replacingId);
    if (!target) return;

    const validTypes: SupportedFileType[] = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!validTypes.includes(file.type as SupportedFileType)) {
      alert('Unsupported file type. Please provide PNG, JPG, or PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUrl = e.target?.result as string;
      let previewUrl = dataUrl;
      let orientation: TemplateOrientation = 'landscape';
      let aspectRatio = 1.414;

      if (file.type === 'application/pdf') {
        try {
          const pdfResult = await renderPdfToImage(dataUrl);
          previewUrl = pdfResult.imageDataUrl;
          orientation = pdfResult.orientation;
          aspectRatio = pdfResult.aspectRatio;
        } catch (err) {
          console.error(err);
        }
      } else {
        const img = new Image();
        img.src = dataUrl;
        await new Promise(r => {
          img.onload = () => {
            orientation = img.width >= img.height ? 'landscape' : 'portrait';
            aspectRatio = img.width / img.height;
            r(true);
          };
        });
      }

      const updated: CertificateTemplate = {
        ...target,
        fileName: file.name,
        fileType: file.type as SupportedFileType,
        fileSize: file.size,
        dataUrl,
        previewImageUrl: previewUrl,
        uploadedAt: new Date().toISOString(),
        isDefault: false,
        orientation,
        aspectRatio,
        layoutConfig: target.layoutConfig
          ? { ...target.layoutConfig, orientation, aspectRatio }
          : undefined,
      };

      onSaveTemplate(updated);
      setReplacingId(null);
    };

    reader.readAsDataURL(file);
  };

  const toggleCategoryAssignment = (template: CertificateTemplate, type: CertificateType) => {
    let updatedTypes: CertificateType[];
    if (template.assignedTypes.includes(type)) {
      if (template.assignedTypes.length <= 1) {
        alert('Each template must be assigned to at least one certificate category.');
        return;
      }
      updatedTypes = template.assignedTypes.filter(t => t !== type);
    } else {
      updatedTypes = [...template.assignedTypes, type];
    }

    onSaveTemplate({
      ...template,
      assignedTypes: updatedTypes,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleExecuteReplace(e.target.files[0]);
        }}
      />

      {/* Header & Upload Banner */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold">Certificate Template Repository</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Upload official certificate backdrops in PNG, JPG, or PDF. Assign templates to
              individual podium or participation categories and calibrate exact text coordinates.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            Upload New Template
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer transition-all bg-white hover:bg-amber-50/20 group"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 group-hover:bg-amber-100/70 text-slate-600 group-hover:text-amber-600 flex items-center justify-center mb-3 transition">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Click to select or drag and drop your certificate template
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, and PDF certificate blanks • Auto-renders PDF to high-res background • Max 15MB
            </p>
          </div>

          {uploadError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Configuration Modal */}
      {isUploading && pendingFileMeta && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                Configure Uploaded Template
              </h3>
              <button
                onClick={handleResetModal}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="e.g. 2026 Gold Medalist Official A4"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Preview & File Info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                {pendingPreviewUrl ? (
                  <img
                    src={pendingPreviewUrl}
                    alt="Preview"
                    className="w-14 h-10 object-cover rounded border border-slate-300 shadow-sm"
                  />
                ) : pendingFileMeta.type === 'application/pdf' ? (
                  <FileText className="w-8 h-8 text-rose-500 flex-shrink-0" />
                ) : (
                  <FileImage className="w-8 h-8 text-amber-600 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{pendingFileMeta.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(pendingFileMeta.size)} • {pendingOrientation.toUpperCase()} (
                    {pendingAspectRatio.toFixed(2)})
                  </p>
                  {isProcessingPdf && (
                    <p className="text-[10px] text-amber-600 font-bold animate-pulse mt-0.5">
                      Rendering PDF page 1 to high-res canvas...
                    </p>
                  )}
                </div>
              </div>

              {/* Assign to categories */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Assign to Certificate Types:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_CERT_TYPES.map(type => {
                    const isAssigned = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          if (isAssigned) {
                            setSelectedTypes(prev => prev.filter(t => t !== type));
                          } else {
                            setSelectedTypes(prev => [...prev, type]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-bold text-left flex items-center justify-between transition ${
                          isAssigned
                            ? 'bg-amber-50 border-amber-400 text-amber-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{type}</span>
                        {isAssigned && <Check className="w-4 h-4 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleResetModal}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={isProcessingPdf}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider disabled:opacity-50"
              >
                Save & Assign Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => {
          const isPdf = template.fileType === 'application/pdf';
          const visualImage = template.previewImageUrl || (template.dataUrl && !isPdf ? template.dataUrl : null);
          const isCalibrated = template.layoutConfig && template.layoutConfig.useCustomLayout;

          return (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail Area */}
                <div className="h-44 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                  {visualImage ? (
                    <img
                      src={visualImage}
                      alt={template.name}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                    />
                  ) : isPdf ? (
                    <div className="text-center p-4">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                        <FileText className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-slate-200">PDF Document Template</span>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-amber-300">
                        Official Kyorix Vector Standard
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {template.isDefault && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                        Default System
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/60 text-slate-200 backdrop-blur-sm">
                      {isPdf ? 'PDF (RENDERED)' : template.fileType.replace('image/', '').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-900/80 text-amber-400 border border-amber-400/30">
                      {template.orientation || 'LANDSCAPE'}
                    </span>
                  </div>

                  {/* Calibrated Indicator */}
                  {isCalibrated && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                      <Check className="w-3 h-3" /> Calibrated
                    </div>
                  )}
                </div>

                {/* Content details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    File: <span className="font-mono text-slate-700">{template.fileName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Size: {formatFileSize(template.fileSize)} • Added:{' '}
                    {new Date(template.uploadedAt).toLocaleDateString()}
                  </p>

                  {/* Assigned Categories */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Assigned To Categories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_CERT_TYPES.map(cat => {
                        const isAssigned = template.assignedTypes.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategoryAssignment(template, cat)}
                            title="Click to toggle assignment"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                              isAssigned
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 hover:text-slate-600'
                            }`}
                          >
                            <span>{cat}</span>
                            {isAssigned && <Check className="w-3 h-3 text-amber-700" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Visual Calibrate Button */}
                <button
                  type="button"
                  onClick={() => onOpenCalibrator(template)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Calibrate Text Positions
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerReplace(template.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg transition"
                    title="Replace Template Blank"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {!template.isDefault && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
                          onDeleteTemplate(template.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
