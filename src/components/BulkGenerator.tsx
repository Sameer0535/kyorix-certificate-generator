import React, { useState, useRef } from 'react';
import {
  BulkAthleteRow,
  BulkBatchSummary,
  CertificateTemplate,
  CertificateType,
  GeneratedCertificateRecord,
  AthleteDetails,
} from '@/types';
import {
  parseSpreadsheetFile,
  downloadSampleExcelTemplate,
  downloadSampleCsvTemplate,
  validateAthleteRow,
  SAMPLE_ATHLETE_RECORDS,
  normalizeCertificateType,
} from '@/lib/spreadsheet';
import { generateCertificatePdfBlob } from '@/lib/pdf-generator';
import { downloadCertificatesAsZip } from '@/lib/zip-generator';
import { CertificateRenderer } from './CertificateRenderer';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Play,
  RotateCcw,
  Trash2,
  Edit2,
  Archive,
  Layers,
  Sparkles,
  Shield,
  Eye,
  Check,
  Filter,
} from 'lucide-react';

interface BulkGeneratorProps {
  templates: CertificateTemplate[];
  onBatchCompleted: (records: GeneratedCertificateRecord[]) => void;
  onPreviewAthlete: (athlete: AthleteDetails, template: CertificateTemplate | null) => void;
}

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({
  templates,
  onBatchCompleted,
  onPreviewAthlete,
}) => {
  const [rows, setRows] = useState<BulkAthleteRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Filter state for table
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'invalid' | 'duplicates'>('all');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalToGenerate, setTotalToGenerate] = useState<number>(0);
  const [currentAthleteName, setCurrentAthleteName] = useState<string>('');
  const [zipSuccessToast, setZipSuccessToast] = useState<boolean>(false);

  // Active rendering athlete & template for offscreen DOM capture
  const [renderingAthlete, setRenderingAthlete] = useState<AthleteDetails | null>(null);
  const [renderingTemplate, setRenderingTemplate] = useState<CertificateTemplate | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Statistics
  const totalCount = rows.length;
  const validCount = rows.filter(r => r.isValid).length;
  const invalidCount = rows.filter(r => !r.isValid).length;
  const duplicateCount = rows.filter(r => r.isDuplicateKukkiwonId).length;
  const completedCount = rows.filter(r => r.generationStatus === 'success').length;
  const failedCount = rows.filter(r => r.generationStatus === 'failed').length;
  const selectedValidCount = rows.filter(r => r.isValid && r.selectedForDownload).length;

  const progressPercent =
    totalToGenerate > 0
      ? Math.min(100, Math.round((currentIndex / totalToGenerate) * 100))
      : validCount > 0
      ? Math.min(100, Math.round((completedCount / validCount) * 100))
      : 0;

  // Handle file selection
  const handleFileChange = async (file: File) => {
    setParseError(null);
    setIsParsing(true);
    setFileName(file.name);

    try {
      const parsedRows = await parseSpreadsheetFile(file);
      if (parsedRows.length === 0) {
        setParseError('Spreadsheet contains no athlete rows.');
      } else {
        setRows(parsedRows);
      }
    } catch (err: any) {
      console.error('Failed to parse spreadsheet:', err);
      setParseError('Failed to parse spreadsheet. Please ensure it is a valid .xlsx, .xls, or .csv file.');
    } finally {
      setIsParsing(false);
    }
  };

  // Load sample demo data
  const handleLoadDemoData = () => {
    setParseError(null);
    setFileName('Kyorix_National_Championship_Roster_Demo.xlsx');

    const demoRows: BulkAthleteRow[] = SAMPLE_ATHLETE_RECORDS.map((item, idx) => {
      const kukkiwonId = item['Kukkiwon ID'];
      const raw: Omit<BulkAthleteRow, 'isValid' | 'errors' | 'warnings'> = {
        rowId: `demo-${idx}`,
        originalIndex: idx + 1,
        kukkiwonId,
        athleteName: item['Athlete Name'],
        academyName: item['Academy Name'],
        weightCategory: item['Weight Category'],
        championshipName: item['Championship Name'],
        championshipDate: item['Championship Date'],
        certificateType: normalizeCertificateType(item['Certificate Type']) || 'Participation',
        medalResult: item['Medal Result'],
        generationStatus: 'pending',
        selectedForDownload: true,
      };

      const { isValid, errors, warnings, isDuplicateKukkiwonId } = validateAthleteRow(raw, [raw]);
      return {
        ...raw,
        isValid,
        errors,
        warnings,
        isDuplicateKukkiwonId,
      };
    });

    setRows(demoRows);
  };

  // Inline edit handler
  const handleCellEdit = (
    rowId: string,
    field: keyof Omit<BulkAthleteRow, 'rowId' | 'originalIndex' | 'isValid' | 'errors' | 'warnings'>,
    value: string
  ) => {
    setRows(prev => {
      const updated = prev.map(row => {
        if (row.rowId === rowId) {
          return { ...row, [field]: value };
        }
        return row;
      });

      // Re-validate all rows to maintain cross-record duplicate warnings
      return updated.map(r => {
        const { isValid, errors, warnings, isDuplicateKukkiwonId } = validateAthleteRow(r, updated);
        return {
          ...r,
          isValid,
          errors,
          warnings,
          isDuplicateKukkiwonId,
        };
      });
    });
  };

  // Delete row
  const handleDeleteRow = (rowId: string) => {
    setRows(prev => {
      const filtered = prev.filter(r => r.rowId !== rowId);
      return filtered.map(r => {
        const { isValid, errors, warnings, isDuplicateKukkiwonId } = validateAthleteRow(r, filtered);
        return {
          ...r,
          isValid,
          errors,
          warnings,
          isDuplicateKukkiwonId,
        };
      });
    });
  };

  // Toggle selection for zip download
  const handleToggleSelect = (rowId: string) => {
    setRows(prev =>
      prev.map(r => (r.rowId === rowId ? { ...r, selectedForDownload: !r.selectedForDownload } : r))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setRows(prev => prev.map(r => ({ ...r, selectedForDownload: select })));
  };

  // Get matching template for an athlete
  const getTemplateForAthlete = (certType: CertificateType): CertificateTemplate | null => {
    // Custom assigned first
    const custom = templates.find(t => !t.isDefault && t.assignedTypes.includes(certType));
    if (custom) return custom;
    const def = templates.find(t => t.assignedTypes.includes(certType));
    return def || templates[0] || null;
  };

  // Bulk Generation Execution
  const handleStartBulkGeneration = async (onlySelected: boolean = false) => {
    const targetRows = rows.filter(r => r.isValid && (!onlySelected || r.selectedForDownload));
    if (targetRows.length === 0) {
      alert(
        onlySelected
          ? 'No valid selected athlete records to generate.'
          : 'No valid athlete records to generate certificates for.'
      );
      return;
    }

    setIsGenerating(true);
    setIsCancelled(false);
    isCancelledRef.current = false;
    setTotalToGenerate(targetRows.length);
    setCurrentIndex(0);

    const generatedHistoryRecords: GeneratedCertificateRecord[] = [];
    let processedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      if (isCancelledRef.current) break;

      const currentRow = rows[i];
      if (!currentRow.isValid) continue;
      if (onlySelected && !currentRow.selectedForDownload) continue;

      processedCount++;
      setCurrentIndex(processedCount);
      setCurrentAthleteName(currentRow.athleteName);

      // Update row status to processing
      setRows(prev =>
        prev.map(r => (r.rowId === currentRow.rowId ? { ...r, generationStatus: 'processing' } : r))
      );

      try {
        const normType = normalizeCertificateType(currentRow.certificateType) || 'Participation';
        const template = getTemplateForAthlete(normType);
        const certNumber = `KYX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const athlete: AthleteDetails = {
          kukkiwonId: currentRow.kukkiwonId,
          athleteName: currentRow.athleteName,
          academyName: currentRow.academyName,
          weightCategory: currentRow.weightCategory,
          championshipName: currentRow.championshipName,
          championshipDate: currentRow.championshipDate,
          certificateType: normType,
          medalResult: currentRow.medalResult,
          certificateNumber: certNumber,
          issueDate: new Date().toISOString(),
        };

        // Render to offscreen DOM
        setRenderingAthlete(athlete);
        setRenderingTemplate(template);

        // Wait for React to paint the DOM element
        await new Promise(r => setTimeout(r, 60));

        const certElement = document.getElementById('kyorix-bulk-render-node');
        if (!certElement) {
          throw new Error('Offscreen certificate node not found.');
        }

        const safeName = athlete.athleteName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeType = normType.replace(/\s+/g, '_');
        const generatedFileName = `Kyorix_${safeType}_${safeName || 'Athlete'}.pdf`;

        // Generate PDF Blob
        const pdfBlob = await generateCertificatePdfBlob(certElement, {
          quality: 0.95,
          scale: 2.0,
          orientation: template?.orientation || 'landscape',
        });

        // Update row status
        setRows(prev =>
          prev.map(r =>
            r.rowId === currentRow.rowId
              ? {
                  ...r,
                  generationStatus: 'success',
                  pdfBlob,
                  fileName: generatedFileName,
                  certificateNumber: certNumber,
                }
              : r
          )
        );

        // Record in audit log
        generatedHistoryRecords.push({
          id: `bulk-${Date.now()}-${i}`,
          certificateNumber: certNumber,
          athleteDetails: athlete,
          templateId: template?.id,
          templateName: template?.name,
          generatedAt: new Date().toISOString(),
          isBulk: true,
          batchId: `batch-${fileName || 'spreadsheet'}`,
        });

        // Small breathing delay to prevent browser locking
        await new Promise(r => setTimeout(r, 40));
      } catch (err: any) {
        console.error(`Failed to generate certificate for ${currentRow.athleteName}:`, err);
        setRows(prev =>
          prev.map(r =>
            r.rowId === currentRow.rowId
              ? {
                  ...r,
                  generationStatus: 'failed',
                  errorMessage: err.message || 'Generation failed',
                }
              : r
          )
        );
      }
    }

    setIsGenerating(false);
    setRenderingAthlete(null);
    setRenderingTemplate(null);

    // Save batch to history
    if (generatedHistoryRecords.length > 0) {
      onBatchCompleted(generatedHistoryRecords);
    }
  };

  const handleCancelGeneration = () => {
    isCancelledRef.current = true;
    setIsCancelled(true);
    setIsGenerating(false);
  };

  // Download all generated PDFs as a single ZIP
  const handleDownloadZip = async () => {
    const successRows = rows.filter(r => r.generationStatus === 'success' && r.pdfBlob);
    if (successRows.length === 0) {
      alert('No generated certificates available to download.');
      return;
    }

    const filesToZip = successRows.map(r => ({
      fileName: r.fileName || `Kyorix_Certificate_${r.athleteName.replace(/\s+/g, '_')}.pdf`,
      blob: r.pdfBlob!,
    }));

    try {
      const cleanBatchName = (fileName || 'Batch').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      await downloadCertificatesAsZip(filesToZip, `Kyorix_Certificates_${cleanBatchName}.zip`);
      setZipSuccessToast(true);
      setTimeout(() => setZipSuccessToast(false), 3500);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
      alert('Failed to package ZIP archive.');
    }
  };

  // Download only selected rows as ZIP
  const handleDownloadSelectedZip = async () => {
    const selectedSuccess = rows.filter(
      r => r.selectedForDownload && r.generationStatus === 'success' && r.pdfBlob
    );
    if (selectedSuccess.length === 0) {
      alert('No selected generated certificates found to download.');
      return;
    }

    const filesToZip = selectedSuccess.map(r => ({
      fileName: r.fileName || `Kyorix_Certificate_${r.athleteName.replace(/\s+/g, '_')}.pdf`,
      blob: r.pdfBlob!,
    }));

    await downloadCertificatesAsZip(filesToZip, 'Kyorix_Certificates_Selected.zip');
  };

  // Download individual row PDF
  const handleDownloadSinglePdf = (row: BulkAthleteRow) => {
    if (!row.pdfBlob) return;
    const url = URL.createObjectURL(row.pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = row.fileName || `Kyorix_Certificate_${row.athleteName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered rows
  const filteredRows = rows.filter(row => {
    if (filterMode === 'valid') return row.isValid;
    if (filterMode === 'invalid') return !row.isValid;
    if (filterMode === 'duplicates') return row.isDuplicateKukkiwonId;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
        }}
      />

      {/* OFFSCREEN DOM NODE FOR CAPTURING PDF CANVAS */}
      <div
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'visible',
          pointerEvents: 'none',
        }}
      >
        {renderingAthlete && (
          <div id="kyorix-bulk-render-node">
            <CertificateRenderer athlete={renderingAthlete} template={renderingTemplate} />
          </div>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 bg-white text-slate-900 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">Bulk Certificate Generation & Excel Import</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold">
                Production Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Upload competition rosters in Excel (.xlsx, .xls) or CSV. The system automatically
              validates Kukkiwon records, pairs them with calibrated templates, and outputs
              individual PDFs and bundled ZIP packages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={downloadSampleExcelTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition"
              title="Download standard Excel template with proper column headers"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Excel (.xlsx)</span>
            </button>
            <button
              onClick={downloadSampleCsvTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition"
              title="Download standard CSV template"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Sample CSV</span>
            </button>
            <button
              onClick={handleLoadDemoData}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Roster</span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="p-6 bg-slate-50/60 border-b border-slate-200">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-white hover:bg-cyan-50/20 group"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 group-hover:bg-cyan-100 text-slate-600 group-hover:text-cyan-600 flex items-center justify-center mb-3 transition">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Drag and drop your athlete spreadsheet, or <span className="text-amber-600 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports .xlsx, .xls, and .csv with columns: Kukkiwon ID, Athlete Name, Academy Name,
              Weight Category, Championship Name, Date, Certificate Type, Medal Result
            </p>
          </div>

          {parseError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
              <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Roster Overview & Generation Workspace */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-6">
          {/* Status Metrics Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Loaded Spreadsheet:</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {fileName || 'athletes.xlsx'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review athlete records, correct flagged entries, and trigger batch PDF generation.
              </p>
            </div>

            {/* Metric Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                Total: {totalCount}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Valid: {validCount}
              </span>
              {invalidCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Invalid: {invalidCount}
                </span>
              )}
              {duplicateCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Duplicates: {duplicateCount}
                </span>
              )}
            </div>
          </div>

          {/* Active Generation Progress Bar */}
          {isGenerating && (
            <div className="px-6 py-4 bg-cyan-50/60 border-y border-cyan-200/80 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-950 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                    Generating Certificate {currentIndex} of {totalToGenerate || validCount}...
                  </span>
                  <p className="text-xs text-slate-600 font-medium">
                    Athlete: <span className="font-bold text-slate-900">{currentAthleteName}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-900">
                    {progressPercent}% Complete
                  </span>
                  <button
                    onClick={handleCancelGeneration}
                    className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold hover:bg-rose-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 rounded-full transition-all duration-150"
                />
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="px-6 flex flex-wrap items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilterMode('valid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterMode === 'valid'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Valid ({validCount})
              </button>
              {invalidCount > 0 && (
                <button
                  onClick={() => setFilterMode('invalid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterMode === 'invalid'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Needs Attention ({invalidCount})
                </button>
              )}
              {duplicateCount > 0 && (
                <button
                  onClick={() => setFilterMode('duplicates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterMode === 'duplicates'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Duplicates ({duplicateCount})
                </button>
              )}
            </div>

            {/* Action Buttons: Generate & ZIP Download */}
            <div className="flex items-center gap-2.5">
              {/* Primary Batch Generate All Button */}
              <button
                onClick={() => handleStartBulkGeneration(false)}
                disabled={isGenerating || validCount === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {completedCount > 0
                    ? `Re-Generate All Valid (${validCount})`
                    : `Generate All Valid (${validCount})`}
                </span>
              </button>

              {/* Generate Selected Valid Button */}
              {selectedValidCount > 0 && selectedValidCount < validCount && (
                <button
                  onClick={() => handleStartBulkGeneration(true)}
                  disabled={isGenerating}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                  title="Generate certificates only for checked valid rows"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Generate Selected ({selectedValidCount})</span>
                </button>
              )}

              {/* Download ZIP Button */}
              {completedCount > 0 && (
                <>
                  <button
                    onClick={handleDownloadZip}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition"
                  >
                    <Archive className="w-4 h-4 text-cyan-400" />
                    <span>Download All ZIP ({completedCount})</span>
                  </button>

                  <button
                    onClick={handleDownloadSelectedZip}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition"
                    title="Download ZIP containing only checked certificates"
                  >
                    <span>Selected ZIP</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Athlete Records Table with Inline Editing */}
          <div className="px-6 pb-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={rows.every(r => r.selectedForDownload)}
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="rounded accent-amber-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Kukkiwon ID</th>
                    <th className="py-3 px-3">Athlete Name</th>
                    <th className="py-3 px-3">Academy Name</th>
                    <th className="py-3 px-3">Weight Division</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Medal Result</th>
                    <th className="py-3 px-3">Event Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRows.map(row => {
                    const isPodium = row.certificateType !== 'Participation';
                    const hasError = !row.isValid;
                    const isSuccess = row.generationStatus === 'success';

                    return (
                      <tr
                        key={row.rowId}
                        className={`transition ${
                          hasError
                            ? 'bg-rose-50/50 hover:bg-rose-50'
                            : row.isDuplicateKukkiwonId
                            ? 'bg-amber-50/40 hover:bg-amber-50/70'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3">
                          <input
                            type="checkbox"
                            checked={Boolean(row.selectedForDownload)}
                            onChange={() => handleToggleSelect(row.rowId)}
                            className="rounded accent-amber-500 cursor-pointer"
                          />
                        </td>

                        {/* Status Column */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Ready
                            </span>
                          ) : row.generationStatus === 'processing' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded animate-pulse">
                              Rendering...
                            </span>
                          ) : row.generationStatus === 'failed' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                              Failed
                            </span>
                          ) : hasError ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded cursor-help"
                              title={row.errors.join('; ')}
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Invalid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              Valid
                            </span>
                          )}

                          {row.isDuplicateKukkiwonId && (
                            <span
                              className="ml-1 inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded"
                              title={row.warnings.join('; ')}
                            >
                              Dup ID
                            </span>
                          )}
                        </td>

                        {/* Kukkiwon ID (Editable) */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.kukkiwonId}
                            onChange={e => handleCellEdit(row.rowId, 'kukkiwonId', e.target.value)}
                            placeholder="Kukkiwon ID"
                            className={`w-28 px-2 py-1 rounded border text-xs font-mono font-bold focus:outline-none focus:border-amber-500 ${
                              !row.kukkiwonId ? 'border-rose-400 bg-rose-100/50' : 'border-slate-200 bg-white'
                            }`}
                          />
                        </td>

                        {/* Athlete Name (Editable) */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.athleteName}
                            onChange={e => handleCellEdit(row.rowId, 'athleteName', e.target.value)}
                            placeholder="Athlete Name"
                            className={`w-40 px-2 py-1 rounded border text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 ${
                              !row.athleteName ? 'border-rose-400 bg-rose-100/50' : 'border-slate-200 bg-white'
                            }`}
                          />
                        </td>

                        {/* Academy Name (Editable) */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.academyName}
                            onChange={e => handleCellEdit(row.rowId, 'academyName', e.target.value)}
                            placeholder="Academy"
                            className="w-44 px-2 py-1 rounded border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </td>

                        {/* Weight Category (Editable) */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.weightCategory}
                            onChange={e => handleCellEdit(row.rowId, 'weightCategory', e.target.value)}
                            placeholder="Category"
                            className="w-40 px-2 py-1 rounded border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </td>

                        {/* Certificate Type (Editable Dropdown) */}
                        <td className="py-2.5 px-3">
                          <select
                            value={row.certificateType}
                            onChange={e => handleCellEdit(row.rowId, 'certificateType', e.target.value)}
                            className="px-2 py-1 rounded border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                          >
                            <option value="Gold Medal">Gold Medal</option>
                            <option value="Silver Medal">Silver Medal</option>
                            <option value="Bronze Medal">Bronze Medal</option>
                            <option value="Participation">Participation</option>
                          </select>
                        </td>

                        {/* Medal Result (Editable) */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.medalResult || ''}
                            onChange={e => handleCellEdit(row.rowId, 'medalResult', e.target.value)}
                            placeholder={isPodium ? 'e.g. 1st Place' : 'Optional for Part.'}
                            className={`w-36 px-2 py-1 rounded border text-xs focus:outline-none focus:border-amber-500 ${
                              isPodium && !row.medalResult
                                ? 'border-rose-400 bg-rose-100/50'
                                : 'border-slate-200 bg-white'
                            }`}
                          />
                        </td>

                        {/* Date (Editable) */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.championshipDate}
                            onChange={e => handleCellEdit(row.rowId, 'championshipDate', e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="w-28 px-2 py-1 rounded border border-slate-200 bg-white text-xs font-mono text-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect / Preview */}
                            <button
                              type="button"
                              onClick={() => {
                                const normType = normalizeCertificateType(row.certificateType) || 'Participation';
                                const template = getTemplateForAthlete(normType);
                                onPreviewAthlete(
                                  {
                                    kukkiwonId: row.kukkiwonId,
                                    athleteName: row.athleteName,
                                    academyName: row.academyName,
                                    weightCategory: row.weightCategory,
                                    championshipName: row.championshipName,
                                    championshipDate: row.championshipDate,
                                    certificateType: normType,
                                    medalResult: row.medalResult,
                                    certificateNumber: row.certificateNumber || 'PREVIEW-TEST',
                                    issueDate: new Date().toISOString(),
                                  },
                                  template
                                );
                              }}
                              className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition"
                              title="Preview certificate in workspace"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Download PDF button if generated */}
                            {isSuccess && row.pdfBlob && (
                              <button
                                type="button"
                                onClick={() => handleDownloadSinglePdf(row)}
                                className="p-1 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                                title="Download generated PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete row */}
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.rowId)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Remove row from batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Error Details Alert if invalid rows exist */}
            {invalidCount > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <p className="font-bold">
                    {invalidCount} record(s) have validation errors. Edit the cells above to fix them before generation.
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-rose-800">
                    {rows
                      .filter(r => !r.isValid)
                      .slice(0, 4)
                      .map(r => (
                        <li key={r.rowId}>
                          Row #{r.originalIndex} ({r.athleteName || 'Unnamed'}): {r.errors.join(' ')}
                        </li>
                      ))}
                    {invalidCount > 4 && <li>...and {invalidCount - 4} more records.</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
