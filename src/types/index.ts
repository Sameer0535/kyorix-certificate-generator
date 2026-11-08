export type CertificateType =
  | 'Participation'
  | 'Gold Medal'
  | 'Silver Medal'
  | 'Bronze Medal';

export interface AthleteDetails {
  kukkiwonId: string;
  athleteName: string;
  academyName: string;
  weightCategory: string;
  championshipName: string;
  championshipDate: string;
  certificateType: CertificateType;
  medalResult?: string;
  certificateNumber?: string;
  issueDate?: string;
}

export type SupportedFileType = 'image/png' | 'image/jpeg' | 'application/pdf';

export type TemplateOrientation = 'landscape' | 'portrait';

export interface FieldPositionConfig {
  visible: boolean;
  xPercent: number; // 0 to 100% horizontal coordinate
  yPercent: number; // 0 to 100% vertical coordinate
  fontSizePx: number;
  color: string;
  fontFamily: 'serif' | 'sans' | 'mono';
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  prefix?: string;
  suffix?: string;
}

export interface TemplateLayoutConfig {
  useCustomLayout: boolean;
  orientation?: TemplateOrientation;
  aspectRatio?: number;
  kukkiwonId: FieldPositionConfig;
  athleteName: FieldPositionConfig;
  academyName: FieldPositionConfig;
  weightCategory: FieldPositionConfig;
  championshipName: FieldPositionConfig;
  championshipDate: FieldPositionConfig;
  medalResult: FieldPositionConfig;
  certificateNumber?: FieldPositionConfig;
  issueDate?: FieldPositionConfig;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  fileName: string;
  fileType: SupportedFileType;
  fileSize: number;
  dataUrl: string; // base64 representation of original file
  previewImageUrl?: string; // High-res rendered image if original was PDF
  assignedTypes: CertificateType[];
  uploadedAt: string;
  description?: string;
  isDefault?: boolean;
  orientation?: TemplateOrientation;
  aspectRatio?: number;
  layoutConfig?: TemplateLayoutConfig;
}

export interface GeneratedCertificateRecord {
  id: string;
  athleteDetails: AthleteDetails;
  templateId?: string;
  templateName?: string;
  generatedAt: string;
  certificateNumber: string;
  isBulk?: boolean;
  batchId?: string;
}

export type NavigationTab =
  | 'dashboard'
  | 'generate'
  | 'bulk'
  | 'templates'
  | 'history'
  | 'calibrate';

export interface BulkAthleteRow {
  rowId: string;
  originalIndex: number;
  kukkiwonId: string;
  athleteName: string;
  academyName: string;
  weightCategory: string;
  championshipName: string;
  championshipDate: string;
  certificateType: CertificateType | string;
  medalResult?: string;

  // Validation
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isDuplicateKukkiwonId?: boolean;

  // Generation status
  generationStatus?: 'pending' | 'processing' | 'success' | 'failed';
  certificateNumber?: string;
  pdfBlob?: Blob;
  fileName?: string;
  errorMessage?: string;
  selectedForDownload?: boolean;
}

export interface BulkBatchSummary {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  completed: number;
  failed: number;
  inProgress: boolean;
}
