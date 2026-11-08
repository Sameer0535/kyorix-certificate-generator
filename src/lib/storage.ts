import {
  CertificateTemplate,
  GeneratedCertificateRecord,
  CertificateType,
  SupportedFileType,
} from '@/types';
import { TEMPORARY_TEMPLATES } from './templates-generator';

const TEMPLATES_KEY = 'kyorix_certificate_templates_v2'; // v2 for Phase 4 template integration
const HISTORY_KEY = 'kyorix_certificate_history_v1';

export const INITIAL_HISTORY: GeneratedCertificateRecord[] = [
  {
    id: 'rec-001',
    certificateNumber: 'KYX-2026-0891',
    athleteDetails: {
      kukkiwonId: '05389104',
      athleteName: 'Min-Jun Park',
      academyName: 'Seoul Tiger Taekwondo Academy',
      weightCategory: 'Under 58kg (Flyweight)',
      championshipName: '2026 Kyorix National Taekwondo Open Championship',
      championshipDate: '2026-05-15',
      certificateType: 'Gold Medal',
      medalResult: '1st Place • Gold Medalist',
      certificateNumber: 'KYX-2026-0891',
      issueDate: '2026-05-16',
    },
    templateId: 'temp-gold-medal',
    templateName: 'Kyorix Gold Medalist (Temporary Template)',
    generatedAt: '2026-05-16T14:30:00Z',
  },
  {
    id: 'rec-002',
    certificateNumber: 'KYX-2026-0892',
    athleteDetails: {
      kukkiwonId: '05477219',
      athleteName: 'Liam Harrison',
      academyName: 'Pacific Rim Martial Arts Institute',
      weightCategory: 'Under 68kg (Featherweight)',
      championshipName: '2026 Kyorix National Taekwondo Open Championship',
      championshipDate: '2026-05-15',
      certificateType: 'Silver Medal',
      medalResult: '2nd Place • Silver Medalist',
      certificateNumber: 'KYX-2026-0892',
      issueDate: '2026-05-16',
    },
    templateId: 'temp-silver-medal',
    templateName: 'Kyorix Silver Medalist (Temporary Template)',
    generatedAt: '2026-05-16T15:10:00Z',
  },
  {
    id: 'rec-003',
    certificateNumber: 'KYX-2026-0893',
    athleteDetails: {
      kukkiwonId: '05812903',
      athleteName: 'Elena Rostova',
      academyName: 'Dragon Spirit Dojang',
      weightCategory: 'Under 49kg (Flyweight)',
      championshipName: '2026 Kyorix National Taekwondo Open Championship',
      championshipDate: '2026-05-15',
      certificateType: 'Participation',
      certificateNumber: 'KYX-2026-0893',
      issueDate: '2026-05-16',
    },
    templateId: 'temp-participation',
    templateName: 'Kyorix Participation (Temporary Template)',
    generatedAt: '2026-05-16T16:05:00Z',
  },
];

export function getStoredTemplates(): CertificateTemplate[] {
  if (typeof window === 'undefined') return TEMPORARY_TEMPLATES;
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    if (!data) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(TEMPORARY_TEMPLATES));
      return TEMPORARY_TEMPLATES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : TEMPORARY_TEMPLATES;
  } catch (err) {
    console.error('Error reading templates from localStorage', err);
    return TEMPORARY_TEMPLATES;
  }
}

export function saveTemplate(template: CertificateTemplate): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const existingIdx = current.findIndex(t => t.id === template.id);
  let updated: CertificateTemplate[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = template;
  } else {
    updated = [template, ...current];
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

export function renameTemplate(id: string, newName: string): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const updated = current.map(t => (t.id === id ? { ...t, name: newName.trim() } : t));
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

export function toggleTemplateDisabled(id: string, isDisabled: boolean): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const updated = current.map(t => (t.id === id ? { ...t, isDefault: !isDisabled } : t));
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Replaces a template asset with an uploaded file while strictly preserving
 * existing name, assignments, and Phase 2 text-position configurations.
 */
export function replaceTemplateAssetPreservingLayout(
  id: string,
  asset: {
    dataUrl: string;
    fileName: string;
    fileType: SupportedFileType;
    fileSize: number;
    previewImageUrl?: string;
  }
): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const target = current.find(t => t.id === id);
  if (!target) return current;

  const updatedTarget: CertificateTemplate = {
    ...target,
    dataUrl: asset.dataUrl,
    fileName: asset.fileName,
    fileType: asset.fileType,
    fileSize: asset.fileSize,
    previewImageUrl: asset.previewImageUrl,
    uploadedAt: new Date().toISOString(),
    isDefault: false, // marked as user-supplied
  };

  return saveTemplate(updatedTarget);
}

export function deleteTemplate(id: string): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

export function getTemplateForCertificateType(type: CertificateType): CertificateTemplate | null {
  const templates = getStoredTemplates();
  // Find non-disabled custom template first
  const custom = templates.find(t => !t.isDefault && t.assignedTypes.includes(type));
  if (custom) return custom;
  // Fall back to temporary/default template
  const def = templates.find(t => t.assignedTypes.includes(type));
  return def || templates[0] || null;
}

export function getStoredHistory(): GeneratedCertificateRecord[] {
  if (typeof window === 'undefined') return INITIAL_HISTORY;
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_HISTORY;
  } catch (err) {
    console.error('Error reading history from localStorage', err);
    return INITIAL_HISTORY;
  }
}

export function addHistoryRecord(record: GeneratedCertificateRecord): GeneratedCertificateRecord[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredHistory();
  const updated = [record, ...current];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage quota limit reached', e);
  }
  return updated;
}

export function clearHistoryRecords(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}
