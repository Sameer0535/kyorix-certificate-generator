import React, { useState, useRef, useEffect } from 'react';
import {
  CertificateTemplate,
  TemplateLayoutConfig,
  FieldPositionConfig,
  AthleteDetails,
  TemplateOrientation,
} from '@/types';
import { DEFAULT_TEMPLATE_LAYOUT, DEFAULT_PORTRAIT_LAYOUT } from '@/lib/default-layout';
import {
  Sliders,
  Move,
  Eye,
  EyeOff,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  RotateCcw,
  Save,
  Check,
  X,
  Layers,
  Sparkles,
  Shield,
  Award,
  Calendar,
  Building,
  User,
  Hash,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from 'lucide-react';

interface TemplateCalibratorProps {
  initialTemplate: CertificateTemplate;
  allTemplates: CertificateTemplate[];
  onSaveLayout: (templateId: string, layout: TemplateLayoutConfig) => void;
  onClose: () => void;
  sampleAthlete?: AthleteDetails;
}

type FieldKey =
  | 'athleteName'
  | 'kukkiwonId'
  | 'academyName'
  | 'weightCategory'
  | 'championshipName'
  | 'championshipDate'
  | 'medalResult'
  | 'certificateNumber'
  | 'issueDate';

interface FieldMeta {
  key: FieldKey;
  label: string;
  category: 'core' | 'details' | 'meta';
  icon: React.ReactNode;
  defaultSample: string;
}

const FIELDS: FieldMeta[] = [
  {
    key: 'athleteName',
    label: 'Athlete Name',
    category: 'core',
    icon: <User className="w-3.5 h-3.5" />,
    defaultSample: 'Ethan Christopher Vance',
  },
  {
    key: 'kukkiwonId',
    label: 'Kukkiwon ID',
    category: 'core',
    icon: <Shield className="w-3.5 h-3.5" />,
    defaultSample: '05948321',
  },
  {
    key: 'medalResult',
    label: 'Medal Result',
    category: 'core',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    defaultSample: '1ST PLACE • GOLD MEDAL',
  },
  {
    key: 'academyName',
    label: 'Academy Name',
    category: 'details',
    icon: <Building className="w-3.5 h-3.5" />,
    defaultSample: 'Apex Taekwondo & High Performance Center',
  },
  {
    key: 'weightCategory',
    label: 'Weight Category',
    category: 'details',
    icon: <Sliders className="w-3.5 h-3.5" />,
    defaultSample: 'Senior Male Under 68kg (Featherweight)',
  },
  {
    key: 'championshipName',
    label: 'Championship Name',
    category: 'details',
    icon: <Award className="w-3.5 h-3.5" />,
    defaultSample: '2026 Kyorix International Taekwondo Championship',
  },
  {
    key: 'championshipDate',
    label: 'Championship Date',
    category: 'details',
    icon: <Calendar className="w-3.5 h-3.5" />,
    defaultSample: 'October 24, 2026',
  },
  {
    key: 'certificateNumber',
    label: 'Certificate Serial #',
    category: 'meta',
    icon: <Hash className="w-3.5 h-3.5" />,
    defaultSample: 'KYX-2026-0891',
  },
  {
    key: 'issueDate',
    label: 'Issue Date',
    category: 'meta',
    icon: <Calendar className="w-3.5 h-3.5" />,
    defaultSample: 'October 25, 2026',
  },
];

const PRESET_COLORS = [
  { name: 'Kyorix Navy', hex: '#0A1128' },
  { name: 'Kyorix Gold', hex: '#D4AF37' },
  { name: 'Dark Charcoal', hex: '#1E293B' },
  { name: 'Black', hex: '#000000' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Slate Gray', hex: '#64748B' },
];

export const TemplateCalibrator: React.FC<TemplateCalibratorProps> = ({
  initialTemplate,
  allTemplates,
  onSaveLayout,
  onClose,
  sampleAthlete,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<CertificateTemplate>(initialTemplate);

  // Layout state initialized from template or defaults
  const [layout, setLayout] = useState<TemplateLayoutConfig>(() => {
    if (activeTemplate.layoutConfig) return activeTemplate.layoutConfig;
    const isPortrait = activeTemplate.orientation === 'portrait';
    return isPortrait ? DEFAULT_PORTRAIT_LAYOUT : DEFAULT_TEMPLATE_LAYOUT;
  });

  const [selectedField, setSelectedField] = useState<FieldKey>('athleteName');
  const [zoomScale, setZoomScale] = useState<number>(0.75);
  const [useSampleData, setUseSampleData] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const activeDragKeyRef = useRef<FieldKey | null>(null);

  // When switching template, load its specific saved layout
  const handleSelectTemplate = (template: CertificateTemplate) => {
    setActiveTemplate(template);
    if (template.layoutConfig) {
      setLayout(template.layoutConfig);
    } else {
      const isPortrait = template.orientation === 'portrait';
      setLayout(isPortrait ? DEFAULT_PORTRAIT_LAYOUT : DEFAULT_TEMPLATE_LAYOUT);
    }
  };

  const isPortrait = activeTemplate.orientation === 'portrait';
  const canvasWidth = isPortrait ? 742 : 1050;
  const canvasHeight = isPortrait ? 1050 : 742;

  // Active field config
  const currentConfig: FieldPositionConfig = layout[selectedField] || {
    visible: true,
    xPercent: 50,
    yPercent: 50,
    fontSizePx: 18,
    color: '#0A1128',
    fontFamily: 'sans',
    textAlign: 'center',
    isBold: false,
  };

  const updateField = (key: FieldKey, updates: Partial<FieldPositionConfig>) => {
    setLayout(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates,
      },
    }));
  };

  // Drag and drop handlers
  const handleFieldMouseDown = (e: React.MouseEvent, key: FieldKey) => {
    e.stopPropagation();
    setSelectedField(key);
    isDraggingRef.current = true;
    activeDragKeyRef.current = key;
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !activeDragKeyRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse coordinates into percentage boundaries (0 to 100%)
    let xPercent = Math.round((mouseX / rect.width) * 100);
    let yPercent = Math.round((mouseY / rect.height) * 100);

    // Keep within boundaries
    xPercent = Math.max(2, Math.min(98, xPercent));
    yPercent = Math.max(2, Math.min(98, yPercent));

    updateField(activeDragKeyRef.current, { xPercent, yPercent });
  };

  const handleCanvasMouseUp = () => {
    isDraggingRef.current = false;
    activeDragKeyRef.current = null;
  };

  const handleSave = () => {
    const finalLayout: TemplateLayoutConfig = {
      ...layout,
      useCustomLayout: true,
      orientation: activeTemplate.orientation || 'landscape',
      aspectRatio: activeTemplate.aspectRatio || (isPortrait ? 0.707 : 1.414),
    };

    onSaveLayout(activeTemplate.id, finalLayout);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetLayout = () => {
    if (confirm(`Reset text positions for "${activeTemplate.name}" to defaults?`)) {
      setLayout(isPortrait ? DEFAULT_PORTRAIT_LAYOUT : DEFAULT_TEMPLATE_LAYOUT);
    }
  };

  const getFieldRenderValue = (key: FieldKey): string => {
    if (!useSampleData) {
      return `{{${key.toUpperCase()}}}`;
    }

    const fieldMeta = FIELDS.find(f => f.key === key);
    if (!sampleAthlete) return fieldMeta?.defaultSample || key;

    switch (key) {
      case 'athleteName':
        return sampleAthlete.athleteName || fieldMeta?.defaultSample || '';
      case 'kukkiwonId':
        return sampleAthlete.kukkiwonId || fieldMeta?.defaultSample || '';
      case 'academyName':
        return sampleAthlete.academyName || fieldMeta?.defaultSample || '';
      case 'weightCategory':
        return sampleAthlete.weightCategory || fieldMeta?.defaultSample || '';
      case 'championshipName':
        return sampleAthlete.championshipName || fieldMeta?.defaultSample || '';
      case 'championshipDate':
        return sampleAthlete.championshipDate || fieldMeta?.defaultSample || '';
      case 'medalResult':
        return `${sampleAthlete.certificateType.toUpperCase()}`;
      case 'certificateNumber':
        return sampleAthlete.certificateNumber || 'KYX-2026-0891';
      case 'issueDate':
        return 'November 8, 2026';
      default:
        return fieldMeta?.defaultSample || '';
    }
  };

  // Visual background image: previewImageUrl (from rendered PDF) or dataUrl (PNG/JPG)
  const templateBgImage =
    activeTemplate.previewImageUrl ||
    (activeTemplate.dataUrl && activeTemplate.fileType !== 'application/pdf'
      ? activeTemplate.dataUrl
      : null);

  return (
    <div className="fixed inset-0 z-50 bg-[#060B18]/95 backdrop-blur-md flex flex-col text-slate-100 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="px-6 py-3 bg-[#0A1128] border-b border-[#1E2C52] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Visual Template Calibrator</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Precision Editor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Editing: <span className="text-amber-300 font-semibold">{activeTemplate.name}</span>{' '}
              ({isPortrait ? 'A4 Portrait' : 'A4 Landscape'})
            </p>
          </div>
        </div>

        {/* Template Selector dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0F1A3A] px-3 py-1.5 rounded-xl border border-[#1E2C52]">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Active Template:</span>
            <select
              value={activeTemplate.id}
              onChange={e => {
                const target = allTemplates.find(t => t.id === e.target.value);
                if (target) handleSelectTemplate(target);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {allTemplates.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.orientation || 'landscape'})
                </option>
              ))}
            </select>
          </div>

          {/* Sample Data Toggle */}
          <button
            onClick={() => setUseSampleData(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              useSampleData
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {useSampleData ? 'Sample Data' : 'Field Tokens'}
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetLayout}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-slate-700 transition flex items-center gap-1.5"
            title="Reset layout to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            {saveToast ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Layout</span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Interactive Canvas */}
        <div
          className="flex-1 bg-[#050814] p-6 flex flex-col items-center justify-center overflow-auto select-none"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        >
          {/* Zoom & Instruction bar */}
          <div className="mb-3 flex items-center gap-4 text-xs text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              Click or drag any element to position
            </span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale(prev => Math.max(0.4, Number((prev - 0.05).toFixed(2))))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-amber-300 font-bold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(prev => Math.min(1.1, Number((prev + 0.05).toFixed(2))))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(isPortrait ? 0.65 : 0.75)}
                className="text-[11px] text-slate-400 hover:text-white ml-1 font-semibold"
              >
                Reset Zoom
              </button>
            </div>
          </div>

          {/* Certificate Visual Canvas */}
          <div
            ref={canvasRef}
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
              transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
            }}
            className="relative bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-700 flex-shrink-0"
          >
            {/* Background Template Layer */}
            {templateBgImage ? (
              <img
                src={templateBgImage}
                alt="Template Background"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              /* Official Kyorix Vector Standard Frame */
              <div className="absolute inset-0 bg-[#FCFDFE] pointer-events-none">
                <div className="absolute inset-4 border-[5px] border-[#0A1128]" />
                <div className="absolute inset-6 border-[2px] border-[#D4AF37]" />
                <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-[#D4AF37]" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-[#D4AF37]" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-[#D4AF37]" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-[#D4AF37]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <span className="text-[120px] font-black tracking-widest text-[#0A1128]">
                    KYORIX
                  </span>
                </div>
              </div>
            )}

            {/* Overlaid Calibrated Text Elements */}
            {FIELDS.map(({ key }) => {
              const field = layout[key];
              if (!field || !field.visible) return null;

              const isSelected = selectedField === key;
              const textVal = getFieldRenderValue(key);
              const fullText = `${field.prefix || ''}${textVal}${field.suffix || ''}`;

              const fontClass =
                field.fontFamily === 'serif'
                  ? 'font-serif'
                  : field.fontFamily === 'mono'
                  ? 'font-mono'
                  : 'font-sans';

              return (
                <div
                  key={key}
                  onMouseDown={e => handleFieldMouseDown(e, key)}
                  style={{
                    position: 'absolute',
                    left: `${field.xPercent}%`,
                    top: `${field.yPercent}%`,
                    transform:
                      field.textAlign === 'left'
                        ? 'translate(0, -50%)'
                        : field.textAlign === 'right'
                        ? 'translate(-100%, -50%)'
                        : 'translate(-50%, -50%)',
                    cursor: 'move',
                    zIndex: isSelected ? 40 : 20,
                  }}
                  className={`group relative px-2.5 py-1 rounded transition-all cursor-move select-none ${
                    isSelected
                      ? 'ring-2 ring-amber-500 bg-amber-500/20 shadow-lg'
                      : 'hover:ring-1 hover:ring-amber-400/80 hover:bg-amber-400/10'
                  }`}
                >
                  {/* Floating Selection Badge */}
                  {isSelected && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow pointer-events-none">
                      {FIELDS.find(f => f.key === key)?.label} ({field.xPercent}%,{' '}
                      {field.yPercent}%)
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: `${field.fontSizePx}px`,
                      color: field.color,
                      textAlign: field.textAlign,
                      fontWeight: field.isBold ? 700 : 400,
                      maxWidth: '88%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    className={`${fontClass} whitespace-nowrap leading-tight pointer-events-none`}
                  >
                    {fullText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Sidebar: Independent Field Customizer */}
        <aside className="w-96 bg-[#0B132B] border-l border-[#1E2C52] flex flex-col justify-between overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Field Selection Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Field to Adjust
              </label>
              <select
                value={selectedField}
                onChange={e => setSelectedField(e.target.value as FieldKey)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1A3A] border border-[#1E2C52] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
              >
                <optgroup label="Required Tournament Fields">
                  {FIELDS.filter(f => f.category === 'core' || f.category === 'details').map(f => (
                    <option key={f.key} value={f.key}>
                      {f.label} {!layout[f.key]?.visible ? '(Hidden)' : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Security & Meta Elements">
                  {FIELDS.filter(f => f.category === 'meta').map(f => (
                    <option key={f.key} value={f.key}>
                      {f.label} {!layout[f.key]?.visible ? '(Hidden)' : ''}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Visibility Toggle */}
            <div className="bg-[#0F1A3A] p-3 rounded-xl border border-[#1E2C52] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentConfig.visible ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-rose-400" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Element Visibility</p>
                  <p className="text-[10px] text-slate-400">
                    {currentConfig.visible ? 'Rendered on certificate' : 'Hidden from template'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateField(selectedField, { visible: !currentConfig.visible })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  currentConfig.visible
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {currentConfig.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>

            {/* X & Y Coordinate Sliders and Inputs */}
            <div className="space-y-4 bg-[#0F1A3A] p-4 rounded-xl border border-[#1E2C52]">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5" />
                Coordinates
              </span>

              {/* Horizontal X% */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                  <span>Horizontal (X%)</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentConfig.xPercent}
                      onChange={e =>
                        updateField(selectedField, {
                          xPercent: Math.max(0, Math.min(100, Number(e.target.value))),
                        })
                      }
                      className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 text-center"
                    />
                    <span className="text-slate-500 text-xs">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentConfig.xPercent}
                  onChange={e => updateField(selectedField, { xPercent: Number(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Vertical Y% */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                  <span>Vertical (Y%)</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentConfig.yPercent}
                      onChange={e =>
                        updateField(selectedField, {
                          yPercent: Math.max(0, Math.min(100, Number(e.target.value))),
                        })
                      }
                      className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 text-center"
                    />
                    <span className="text-slate-500 text-xs">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentConfig.yPercent}
                  onChange={e => updateField(selectedField, { yPercent: Number(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Quick Center/Left/Right Presets */}
              <div className="pt-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateField(selectedField, { xPercent: 50 })}
                  className="flex-1 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Center (50%)
                </button>
                <button
                  type="button"
                  onClick={() => updateField(selectedField, { xPercent: 20 })}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Left (20%)
                </button>
                <button
                  type="button"
                  onClick={() => updateField(selectedField, { xPercent: 80 })}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Right (80%)
                </button>
              </div>
            </div>

            {/* Typography & Appearance Controls */}
            <div className="space-y-4 bg-[#0F1A3A] p-4 rounded-xl border border-[#1E2C52]">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  Typography & Appearance
                </span>

                {/* Font Size */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                    <span>Font Size</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="8"
                        max="72"
                        value={currentConfig.fontSizePx}
                        onChange={e =>
                          updateField(selectedField, {
                            fontSizePx: Math.max(8, Math.min(72, Number(e.target.value))),
                          })
                        }
                        className="w-14 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 text-center"
                      />
                      <span className="text-slate-500 text-xs">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={currentConfig.fontSizePx}
                    onChange={e =>
                      updateField(selectedField, { fontSizePx: Number(e.target.value) })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Font Family Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Font Family
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['serif', 'sans', 'mono'] as const).map(family => (
                      <button
                        key={family}
                        type="button"
                        onClick={() => updateField(selectedField, { fontFamily: family })}
                        className={`py-1.5 rounded-lg text-xs font-bold capitalize border transition ${
                          currentConfig.fontFamily === family
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {family}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bold & Alignment */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Bold Toggle */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Weight
                    </label>
                    <button
                      type="button"
                      onClick={() => updateField(selectedField, { isBold: !currentConfig.isBold })}
                      className={`w-full py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        currentConfig.isBold
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Bold className="w-3.5 h-3.5" />
                      <span>{currentConfig.isBold ? 'Bold' : 'Normal'}</span>
                    </button>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Alignment
                    </label>
                    <div className="flex gap-1">
                      {(
                        [
                          { align: 'left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                          { align: 'center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                          { align: 'right', icon: <AlignRight className="w-3.5 h-3.5" /> },
                        ] as const
                      ).map(({ align, icon }) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => updateField(selectedField, { textAlign: align })}
                          className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center transition ${
                            currentConfig.textAlign === align
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font Color */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Font Color
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateField(selectedField, { color: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          currentConfig.color.toLowerCase() === c.hex.toLowerCase()
                            ? 'border-amber-400 scale-110 shadow'
                            : 'border-slate-600 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentConfig.color}
                    onChange={e => updateField(selectedField, { color: e.target.value })}
                    placeholder="#0A1128"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Prefix Label */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Label Prefix (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentConfig.prefix || ''}
                    onChange={e => updateField(selectedField, { prefix: e.target.value })}
                    placeholder="e.g. Representing, Dan ID: "
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
          </div>

          {/* Bottom Save Action */}
          <div className="p-4 bg-[#0A1128] border-t border-[#1E2C52]">
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Save Calibrated Profile
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
