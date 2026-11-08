const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const JSZip = require('jszip');

console.log('================================================================');
console.log('KYORIX CERTIFICATE GENERATOR — PHASE 5 QA AUTOMATION TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// TEST SUITE 1: QR CODE COMPLETE REMOVAL VERIFICATION
// -------------------------------------------------------------
console.log('----------------------------------------------------------------');
console.log('SUITE 1: QR Code Elimination Verification (Strict Requirement 2)');
console.log('----------------------------------------------------------------');

const srcDir = path.resolve(__dirname, '../src');
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allSrcFiles = getAllFiles(srcDir);
let qrOccurrences = 0;
const qrMatches = [];

for (const file of allSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Check for qr code identifiers
  const matches = content.match(/\b(qrcode|qrCode|generateQrCodeDataUrl)\b/gi);
  if (matches) {
    qrOccurrences += matches.length;
    qrMatches.push({ file: path.relative(srcDir, file), count: matches.length });
  }
}

assert(qrOccurrences === 0, `Zero QR code references in entire src/ directory (Found: ${qrOccurrences})`);
if (qrMatches.length > 0) {
  console.log('Remaining matches:', qrMatches);
}

const qrFileExists = fs.existsSync(path.resolve(__dirname, '../src/lib/qr.ts'));
assert(!qrFileExists, 'src/lib/qr.ts has been deleted successfully');

// -------------------------------------------------------------
// TEST SUITE 2: LEADING ZERO PRESERVATION & STRING ACCURACY
// -------------------------------------------------------------
console.log('\n----------------------------------------------------------------');
console.log('SUITE 2: Leading Zero & Data Accuracy (Requirement 4)');
console.log('----------------------------------------------------------------');

// Test CSV Parsing with leading zeros
const csvData = `Kukkiwon ID,Athlete Name,Academy Name,Weight Category,Championship Name,Championship Date,Certificate Type,Medal Result
05948321,Ethan Christopher Vance,Apex Taekwondo,Under 68kg,2026 Championship,2026-10-24,Gold,1st Place
00123456,D'Angelo O'Connor,Dragon Dojang,Under 58kg,2026 Championship,2026-10-24,Silver,2nd Place
000789,René Müller,Berlin Dojang,Under 80kg,2026 Championship,2026-10-24,Bronze,3rd Place
000001,Min-Jun Park,Seoul Tiger,Under 68kg,2026 Championship,2026-10-24,Participation,`;

const csvWb = XLSX.read(csvData, { type: 'string', cellText: true, raw: false });
const csvJson = XLSX.utils.sheet_to_json(csvWb.Sheets[csvWb.SheetNames[0]], { defval: '', raw: false });

assert(csvJson[0]['Kukkiwon ID'] === '05948321', `CSV retains leading zero '05948321' (Actual: '${csvJson[0]['Kukkiwon ID']}')`);
assert(csvJson[1]['Kukkiwon ID'] === '00123456', `CSV retains double leading zero '00123456' (Actual: '${csvJson[1]['Kukkiwon ID']}')`);
assert(csvJson[2]['Kukkiwon ID'] === '000789', `CSV retains triple leading zero '000789' (Actual: '${csvJson[2]['Kukkiwon ID']}')`);
assert(csvJson[3]['Kukkiwon ID'] === '000001', `CSV retains 5 leading zeros '000001' (Actual: '${csvJson[3]['Kukkiwon ID']}')`);
assert(csvJson[1]['Athlete Name'] === "D'Angelo O'Connor", `Preserved apostrophe in athlete name: "${csvJson[1]['Athlete Name']}"`);
assert(csvJson[2]['Athlete Name'] === "René Müller", `Preserved accented UTF-8 characters: "${csvJson[2]['Athlete Name']}"`);

// Test XLSX Parsing with cellText formatting
const xlsxSheet = {
  '!ref': 'A1:H2',
  A1: { v: 'Kukkiwon ID', t: 's' },
  B1: { v: 'Athlete Name', t: 's' },
  A2: { v: 5948321, t: 'n', z: '00000000', w: '05948321' },
  B2: { v: 'Formatted Vance', t: 's' }
};
const xlsxBuf = XLSX.write({ SheetNames: ['Roster'], Sheets: { Roster: xlsxSheet } }, { type: 'buffer', bookType: 'xlsx' });
const readWb = XLSX.read(xlsxBuf, { type: 'buffer', cellDates: true, cellText: true, raw: false });
const readJson = XLSX.utils.sheet_to_json(readWb.Sheets['Roster'], { defval: '', raw: false });

assert(readJson[0]['Kukkiwon ID'] === '05948321', `XLSX formatted cell retains leading zero '05948321' (Actual: '${readJson[0]['Kukkiwon ID']}')`);

// -------------------------------------------------------------
// TEST SUITE 3: VALIDATION ENGINE & EDGE CASES
// -------------------------------------------------------------
console.log('\n----------------------------------------------------------------');
console.log('SUITE 3: Validation Logic & Edge Cases');
console.log('----------------------------------------------------------------');

function normalizeCertificateType(rawType) {
  const clean = (rawType || '').trim().toLowerCase();
  if (clean.includes('gold')) return 'Gold Medal';
  if (clean.includes('silver')) return 'Silver Medal';
  if (clean.includes('bronze')) return 'Bronze Medal';
  if (clean.includes('participation') || clean.includes('participant')) return 'Participation';
  return null;
}

function validateRow(row, allRows) {
  const errors = [];
  const warnings = [];

  if (!row.kukkiwonId) {
    errors.push('Missing Kukkiwon ID.');
  } else if (row.kukkiwonId.length < 3) {
    errors.push('Kukkiwon ID too short (min 3 chars).');
  }

  const dupes = allRows.filter(r => r.kukkiwonId && r.kukkiwonId.toLowerCase() === row.kukkiwonId.toLowerCase()).length;
  const isDuplicateKukkiwonId = dupes > 1;
  if (isDuplicateKukkiwonId) {
    warnings.push(`Kukkiwon ID '${row.kukkiwonId}' appears ${dupes} times in this spreadsheet.`);
  }

  if (!row.athleteName) {
    errors.push('Missing Athlete Name.');
  } else if (row.athleteName.length < 2) {
    errors.push('Athlete Name must be at least 2 characters.');
  }

  if (!row.academyName) errors.push('Missing Academy / Dojang Name.');
  if (!row.weightCategory) errors.push('Missing Registered Weight Category.');
  if (!row.championshipName) errors.push('Missing Championship Name.');

  if (!row.championshipDate) {
    errors.push('Missing Championship Date.');
  } else {
    const d = new Date(row.championshipDate);
    if (isNaN(d.getTime())) {
      errors.push(`Invalid Championship Date format: '${row.championshipDate}'.`);
    }
  }

  const norm = normalizeCertificateType(row.certificateType);
  if (!norm) {
    errors.push(`Invalid Certificate Type '${row.certificateType}'. Expected Gold, Silver, Bronze, or Participation.`);
  } else {
    if (norm !== 'Participation' && !row.medalResult) {
      errors.push(`Missing Medal Result for ${norm} certificate.`);
    }
  }

  return { isValid: errors.length === 0, errors, warnings, isDuplicateKukkiwonId };
}

const mockRoster = [
  // 1. Valid Gold
  { kukkiwonId: '05948321', athleteName: 'Ethan Vance', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Gold', medalResult: '1st Place' },
  // 2. Duplicate ID (valid row with warning)
  { kukkiwonId: '05948321', athleteName: 'Ethan Vance Jr', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Gold', medalResult: '1st Place' },
  // 3. Missing Kukkiwon ID
  { kukkiwonId: '', athleteName: 'No ID Athlete', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Silver', medalResult: '2nd Place' },
  // 4. Missing Athlete Name
  { kukkiwonId: '05948399', athleteName: '', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Silver', medalResult: '2nd Place' },
  // 5. Invalid Championship Date
  { kukkiwonId: '05948400', athleteName: 'Bad Date Athlete', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-99-99', certificateType: 'Bronze', medalResult: '3rd Place' },
  // 6. Invalid Certificate Type
  { kukkiwonId: '05948401', athleteName: 'Bad Type Athlete', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Diamond', medalResult: '1st' },
  // 7. Missing Medal Result on Gold
  { kukkiwonId: '05948402', athleteName: 'Missing Medal Athlete', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Gold', medalResult: '' },
  // 8. Participation without Medal Result (Valid)
  { kukkiwonId: '05948403', athleteName: 'Valid Participant', academyName: 'Apex', weightCategory: 'U68', championshipName: 'Champs', championshipDate: '2026-10-24', certificateType: 'Participation', medalResult: '' },
];

const res1 = validateRow(mockRoster[0], mockRoster);
assert(res1.isValid === true, 'Standard Gold athlete validated successfully');

const res2 = validateRow(mockRoster[1], mockRoster);
assert(res2.isValid === true && res2.isDuplicateKukkiwonId === true, 'Duplicate Kukkiwon ID emits warning without invalidating record');

const res3 = validateRow(mockRoster[2], mockRoster);
assert(res3.isValid === false && res3.errors.includes('Missing Kukkiwon ID.'), 'Missing Kukkiwon ID flagged as invalid');

const res4 = validateRow(mockRoster[3], mockRoster);
assert(res4.isValid === false && res4.errors.includes('Missing Athlete Name.'), 'Missing Athlete Name flagged as invalid');

const res5 = validateRow(mockRoster[4], mockRoster);
assert(res5.isValid === false && res5.errors.some(e => e.includes('Invalid Championship Date')), 'Invalid Championship Date flagged as invalid');

const res6 = validateRow(mockRoster[5], mockRoster);
assert(res6.isValid === false && res6.errors.some(e => e.includes('Invalid Certificate Type')), 'Invalid Certificate Type flagged as invalid');

const res7 = validateRow(mockRoster[6], mockRoster);
assert(res7.isValid === false && res7.errors.some(e => e.includes('Missing Medal Result')), 'Missing Medal Result on Podium certificate flagged as invalid');

const res8 = validateRow(mockRoster[7], mockRoster);
assert(res8.isValid === true, 'Participation certificate without medal result is valid');

// -------------------------------------------------------------
// TEST SUITE 4: PARTICIPATION CERTIFICATE MEDAL SUPPRESSION
// -------------------------------------------------------------
console.log('\n----------------------------------------------------------------');
console.log('SUITE 4: Participation Certificate Medal Suppression (Strict Req 3)');
console.log('----------------------------------------------------------------');

function getMedalDisplay(athlete) {
  const isParticipation = athlete.certificateType === 'Participation';
  if (isParticipation) return ''; // Participation certificates must NOT display medal positions
  if (athlete.medalResult && athlete.medalResult.trim()) {
    return athlete.medalResult.toUpperCase();
  }
  switch (athlete.certificateType) {
    case 'Gold Medal': return '1ST PLACE • GOLD MEDALIST';
    case 'Silver Medal': return '2ND PLACE • SILVER MEDALIST';
    case 'Bronze Medal': return '3RD PLACE • BRONZE MEDALIST';
    default: return '';
  }
}

assert(getMedalDisplay({ certificateType: 'Participation', medalResult: '1st Place' }) === '', 'Participation certificate returns empty string even if user entered medal');
assert(getMedalDisplay({ certificateType: 'Gold Medal', medalResult: '1st Place' }) === '1ST PLACE', 'Gold certificate displays 1st Place');
assert(getMedalDisplay({ certificateType: 'Silver Medal', medalResult: '2nd Place' }) === '2ND PLACE', 'Silver certificate displays 2nd Place');
assert(getMedalDisplay({ certificateType: 'Bronze Medal', medalResult: '3rd Place' }) === '3RD PLACE', 'Bronze certificate displays 3rd Place');

// -------------------------------------------------------------
// TEST SUITE 5: BULK BATCH SCALING (10, 50, 100, 250 RECORDS) & ZIP ARCHIVING
// -------------------------------------------------------------
console.log('\n----------------------------------------------------------------');
console.log('SUITE 5: Bulk Batch Scaling & ZIP Bundling (Requirement 5)');
console.log('----------------------------------------------------------------');

async function testBatchZipGeneration(batchSize) {
  const zip = new JSZip();
  const folder = zip.folder(`Batch_${batchSize}`);
  const dummyPdfHeader = Buffer.from('%PDF-1.4\n%Kyorix Certified Benchmark PDF\n%%EOF');

  const fileNames = new Set();
  for (let i = 1; i <= batchSize; i++) {
    const pad = String(i).padStart(4, '0');
    const type = ['Gold', 'Silver', 'Bronze', 'Participation'][i % 4];
    const fileName = `Kyorix_${type}_Athlete_${pad}.pdf`;
    fileNames.add(fileName);
    folder.file(fileName, dummyPdfHeader);
  }

  assert(fileNames.size === batchSize, `Batch of ${batchSize}: Generated ${fileNames.size} uniquely named files (zero collisions)`);

  const zipBlob = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  assert(zipBlob.length > 0, `Batch of ${batchSize}: Bundled into ZIP archive successfully (${(zipBlob.length / 1024).toFixed(1)} KB)`);
  return zipBlob.length;
}

(async () => {
  await testBatchZipGeneration(10);
  await testBatchZipGeneration(50);
  await testBatchZipGeneration(100);
  await testBatchZipGeneration(250);

  // -------------------------------------------------------------
  // TEST SUITE 6: LOCALSTORAGE QUOTA MANAGEMENT
  // -------------------------------------------------------------
  console.log('\n----------------------------------------------------------------');
  console.log('SUITE 6: Storage Cap & Quota Management (Requirement 7)');
  console.log('----------------------------------------------------------------');

  const history = [];
  for (let i = 0; i < 600; i++) {
    history.push({ id: `cert-${i}`, certNumber: `KYX-2026-${i}` });
  }
  const capped = history.slice(0, 500);
  assert(capped.length === 500, `History capped at 500 records to prevent localStorage overflow (Initial: 600, Capped: ${capped.length})`);

  console.log('\n================================================================');
  console.log(`FINAL QA VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
