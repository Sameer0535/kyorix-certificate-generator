import * as XLSX from 'xlsx';
import { BulkAthleteRow, CertificateType } from '@/types';

export const SAMPLE_ATHLETE_RECORDS = [
  {
    'Kukkiwon ID': '05948321',
    'Athlete Name': 'Ethan Christopher Vance',
    'Academy Name': 'Apex Taekwondo & High Performance Center',
    'Weight Category': 'Senior Male Under 68kg (Featherweight)',
    'Championship Name': '2026 Kyorix International Taekwondo Championship',
    'Championship Date': '2026-10-24',
    'Certificate Type': 'Gold',
    'Medal Result': '1st Place • Gold Medalist',
  },
  {
    'Kukkiwon ID': '05812903',
    'Athlete Name': 'Elena Rostova',
    'Academy Name': 'Dragon Spirit Dojang',
    'Weight Category': 'Senior Female Under 49kg (Flyweight)',
    'Championship Name': '2026 Kyorix International Taekwondo Championship',
    'Championship Date': '2026-10-24',
    'Certificate Type': 'Silver',
    'Medal Result': '2nd Place • Silver Medalist',
  },
  {
    'Kukkiwon ID': '05477219',
    'Athlete Name': 'Liam Harrison',
    'Academy Name': 'Pacific Rim Martial Arts Institute',
    'Weight Category': 'Senior Male Under 58kg (Flyweight)',
    'Championship Name': '2026 Kyorix International Taekwondo Championship',
    'Championship Date': '2026-10-24',
    'Certificate Type': 'Bronze',
    'Medal Result': '3rd Place • Bronze Medalist',
  },
  {
    'Kukkiwon ID': '05389104',
    'Athlete Name': 'Min-Jun Park',
    'Academy Name': 'Seoul Tiger Taekwondo Academy',
    'Weight Category': 'Senior Male Under 80kg (Welterweight)',
    'Championship Name': '2026 Kyorix International Taekwondo Championship',
    'Championship Date': '2026-10-24',
    'Certificate Type': 'Participation',
    'Medal Result': '', // optional for Participation
  },
  {
    'Kukkiwon ID': '05622108',
    'Athlete Name': 'Aaliyah Khan',
    'Academy Name': 'Vanguard Taekwondo Dojang',
    'Weight Category': 'Senior Female Under 57kg (Featherweight)',
    'Championship Name': '2026 Kyorix International Taekwondo Championship',
    'Championship Date': '2026-10-24',
    'Certificate Type': 'Participation',
    'Medal Result': '',
  },
];

/**
 * Normalizes input string to supported CertificateType
 */
export function normalizeCertificateType(rawType: string): CertificateType | null {
  const clean = (rawType || '').trim().toLowerCase();
  if (clean.includes('gold')) return 'Gold Medal';
  if (clean.includes('silver')) return 'Silver Medal';
  if (clean.includes('bronze')) return 'Bronze Medal';
  if (clean.includes('participation') || clean.includes('participant')) return 'Participation';
  return null;
}

/**
 * Finds column value by matching flexible header names
 */
function findColumnValue(row: Record<string, any>, aliases: string[]): string {
  const rowKeys = Object.keys(row);
  for (const alias of aliases) {
    const matchedKey = rowKeys.find(
      k => k.trim().toLowerCase().replace(/[-_]/g, ' ') === alias.toLowerCase()
    );
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
      return String(row[matchedKey]).trim();
    }
  }
  return '';
}

/**
 * Validates a parsed row and assigns errors/warnings
 */
export function validateAthleteRow(
  row: Omit<BulkAthleteRow, 'isValid' | 'errors' | 'warnings'>,
  allRows: Omit<BulkAthleteRow, 'isValid' | 'errors' | 'warnings'>[]
): { isValid: boolean; errors: string[]; warnings: string[]; isDuplicateKukkiwonId: boolean } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Mandatory Kukkiwon ID
  if (!row.kukkiwonId) {
    errors.push('Missing Kukkiwon ID.');
  } else if (row.kukkiwonId.length < 3) {
    errors.push('Kukkiwon ID too short (min 3 chars).');
  }

  // Check duplicate Kukkiwon ID
  const duplicateCount = allRows.filter(
    r => r.kukkiwonId && r.kukkiwonId.toLowerCase() === row.kukkiwonId.toLowerCase()
  ).length;
  const isDuplicateKukkiwonId = duplicateCount > 1;
  if (isDuplicateKukkiwonId) {
    warnings.push(`Kukkiwon ID '${row.kukkiwonId}' appears ${duplicateCount} times in this spreadsheet.`);
  }

  // 2. Mandatory Athlete Name
  if (!row.athleteName) {
    errors.push('Missing Athlete Name.');
  } else if (row.athleteName.length < 2) {
    errors.push('Athlete Name must be at least 2 characters.');
  }

  // 3. Academy Name
  if (!row.academyName) {
    errors.push('Missing Academy / Dojang Name.');
  }

  // 4. Weight Category
  if (!row.weightCategory) {
    errors.push('Missing Registered Weight Category.');
  }

  // 5. Championship Name
  if (!row.championshipName) {
    errors.push('Missing Championship Name.');
  }

  // 6. Championship Date
  if (!row.championshipDate) {
    errors.push('Missing Championship Date.');
  }

  // 7. Certificate Type & Medal Result
  const normalizedType = normalizeCertificateType(row.certificateType);
  if (!normalizedType) {
    errors.push(`Invalid Certificate Type '${row.certificateType}'. Expected Gold, Silver, Bronze, or Participation.`);
  } else {
    // If podium medal, check medal result
    const isPodium = normalizedType !== 'Participation';
    if (isPodium && !row.medalResult) {
      errors.push(`Missing Medal Result for ${normalizedType} certificate.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    isDuplicateKukkiwonId,
  };
}

/**
 * Parses an Excel (.xlsx, .xls) or CSV file into BulkAthleteRows with full validation
 */
export async function parseSpreadsheetFile(file: File): Promise<BulkAthleteRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Raw JSON rows
  const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const rawRows: Omit<BulkAthleteRow, 'isValid' | 'errors' | 'warnings'>[] = rawData.map(
    (item, index) => {
      const kukkiwonId = findColumnValue(item, [
        'kukkiwon id',
        'kukkiwon',
        'dan id',
        'dan no',
        'id',
        'kukkiwon no',
      ]);
      const athleteName = findColumnValue(item, [
        'athlete name',
        'athlete',
        'name',
        'full name',
        'competitor',
      ]);
      const academyName = findColumnValue(item, [
        'academy name',
        'academy',
        'dojang',
        'club',
        'school',
        'team',
      ]);
      const weightCategory = findColumnValue(item, [
        'weight category',
        'weight',
        'division',
        'category',
        'weight class',
      ]);
      const championshipName = findColumnValue(item, [
        'championship name',
        'championship',
        'tournament',
        'event',
        'competition',
      ]);

      let championshipDate = findColumnValue(item, [
        'championship date',
        'date',
        'event date',
        'tournament date',
      ]);

      // If Date object came from Excel
      if (item['Championship Date'] instanceof Date) {
        championshipDate = item['Championship Date'].toISOString().slice(0, 10);
      }

      const rawCertType = findColumnValue(item, [
        'certificate type',
        'type',
        'cert type',
        'award type',
        'category type',
      ]);

      const rawMedalResult = findColumnValue(item, [
        'medal result',
        'medal',
        'result',
        'placement',
        'place',
        'standing',
      ]);

      const normalizedType = normalizeCertificateType(rawCertType) || (rawCertType as CertificateType);

      return {
        rowId: `row-${Date.now()}-${index}`,
        originalIndex: index + 1,
        kukkiwonId,
        athleteName,
        academyName,
        weightCategory,
        championshipName,
        championshipDate,
        certificateType: normalizedType,
        medalResult: rawMedalResult,
        generationStatus: 'pending',
        selectedForDownload: true,
      };
    }
  );

  // Validate all rows with cross-record duplicate checks
  return rawRows.map(r => {
    const { isValid, errors, warnings, isDuplicateKukkiwonId } = validateAthleteRow(r, rawRows);
    return {
      ...r,
      isValid,
      errors,
      warnings,
      isDuplicateKukkiwonId,
    };
  });
}

/**
 * Downloads a sample Excel (.xlsx) template
 */
export function downloadSampleExcelTemplate(): void {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_ATHLETE_RECORDS);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 16 }, // Kukkiwon ID
    { wch: 28 }, // Athlete Name
    { wch: 38 }, // Academy Name
    { wch: 32 }, // Weight Category
    { wch: 45 }, // Championship Name
    { wch: 18 }, // Championship Date
    { wch: 18 }, // Certificate Type
    { wch: 26 }, // Medal Result
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Kyorix Athletes');

  XLSX.writeFile(wb, 'Kyorix_Athlete_Roster_Template.xlsx');
}

/**
 * Downloads a sample CSV template
 */
export function downloadSampleCsvTemplate(): void {
  const headers = [
    'Kukkiwon ID',
    'Athlete Name',
    'Academy Name',
    'Weight Category',
    'Championship Name',
    'Championship Date',
    'Certificate Type',
    'Medal Result',
  ];

  const rows = SAMPLE_ATHLETE_RECORDS.map(r => [
    `"${r['Kukkiwon ID']}"`,
    `"${r['Athlete Name']}"`,
    `"${r['Academy Name']}"`,
    `"${r['Weight Category']}"`,
    `"${r['Championship Name']}"`,
    `"${r['Championship Date']}"`,
    `"${r['Certificate Type']}"`,
    `"${r['Medal Result']}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Kyorix_Athlete_Roster_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
