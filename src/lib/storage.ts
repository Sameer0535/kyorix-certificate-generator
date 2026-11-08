import { CertificateTemplate, GeneratedCertificateRecord, CertificateType } from '@/types';

const TEMPLATES_KEY = 'kyorix_certificate_templates_v1';
const HISTORY_KEY = 'kyorix_certificate_history_v1';

// Built-in default templates for out-of-the-box readiness
export const DEFAULT_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'default-gold-podium',
    name: 'Kyorix Championship Gold Medalist (Official)',
    fileName: 'kyorix_gold_podium_template.png',
    fileType: 'image/png',
    fileSize: 245000,
    dataUrl: '', // uses SVG-rendered background if empty
    assignedTypes: ['Gold Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'Official gold border with dual crest watermark and laurel wreath emblem.',
    isDefault: true,
  },
  {
    id: 'default-silver-podium',
    name: 'Kyorix Championship Silver Medalist (Official)',
    fileName: 'kyorix_silver_podium_template.png',
    fileType: 'image/png',
    fileSize: 240000,
    dataUrl: '',
    assignedTypes: ['Silver Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'Official silver metallic styling with championship federation insignia.',
    isDefault: true,
  },
  {
    id: 'default-bronze-podium',
    name: 'Kyorix Championship Bronze Medalist (Official)',
    fileName: 'kyorix_bronze_podium_template.png',
    fileType: 'image/png',
    fileSize: 238000,
    dataUrl: '',
    assignedTypes: ['Bronze Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'Official bronze heraldic styling with martial arts combat watermark.',
    isDefault: true,
  },
  {
    id: 'default-participation',
    name: 'Kyorix Official Participation Certificate',
    fileName: 'kyorix_participation_standard.png',
    fileType: 'image/png',
    fileSize: 215000,
    dataUrl: '',
    assignedTypes: ['Participation'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'Standard taekwondo athlete participation certificate with navy and gold guilloche border.',
    isDefault: true,
  },
];

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
      certificateNumber: 'KYX-2026-0891',
      issueDate: '2026-05-16',
    },
    templateId: 'default-gold-podium',
    templateName: 'Kyorix Championship Gold Medalist (Official)',
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
      certificateNumber: 'KYX-2026-0892',
      issueDate: '2026-05-16',
    },
    templateId: 'default-silver-podium',
    templateName: 'Kyorix Championship Silver Medalist (Official)',
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
    templateId: 'default-participation',
    templateName: 'Kyorix Official Participation Certificate',
    generatedAt: '2026-05-16T16:05:00Z',
  },
];

export function getStoredTemplates(): CertificateTemplate[] {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATES;
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    if (!data) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TEMPLATES;
  } catch (err) {
    console.error('Error reading templates from localStorage', err);
    return DEFAULT_TEMPLATES;
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

export function deleteTemplate(id: string): CertificateTemplate[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredTemplates();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
}

export function getTemplateForCertificateType(type: CertificateType): CertificateTemplate | null {
  const templates = getStoredTemplates();
  // Find custom uploaded template first
  const custom = templates.find(t => !t.isDefault && t.assignedTypes.includes(type));
  if (custom) return custom;
  // Fall back to default
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
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistoryRecords(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

