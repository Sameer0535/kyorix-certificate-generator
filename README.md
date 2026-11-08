# Kyorix Certificate Generator

**Official Certificate Generation Software for Kyorix Sports Technology**  
*Built with Next.js 14, TypeScript, Tailwind CSS, html2canvas, jsPDF, and JSZip.*

---

## Overview

The **Kyorix Certificate Generator** is a fast, responsive, and completely client-side application designed to generate, calibrate, and mass-issue official Taekwondo championship certificates.

### Key Capabilities

1. **Single Certificate Issuance:**
   - Real-time entry form for Kukkiwon ID, Athlete Name, Academy Name, Weight Division, Championship Details, Certificate Type, and Medal Standing.
   - High-DPI (`scale: 2`) A4 landscape printable PDF export matching live preview.
2. **Bulk Roster Import & Generation:**
   - Supports `.xlsx`, `.xls`, and `.csv` files.
   - Strict string preservation of leading zeroes on Kukkiwon IDs (`05948321`, `001234`).
   - Pre-flight validation flagging missing mandatory fields, invalid dates, and duplicate IDs.
   - Dual generation modes: **"Generate All Valid"** and **"Generate Selected"**.
   - One-click **ZIP Archive Download** packaging all generated certificates with standardized naming.
3. **Visual Template Calibrator:**
   - Drag-and-drop workspace to reposition fields (Athlete Name, Kukkiwon ID, Academy, Weight Category, Championship Name, Championship Date, Medal Result).
   - Real-time controls for font size (8–72px), font family (Serif, Sans, Mono), color picker, bold weight, and text alignment.
   - Automatic percentage-based coordinate clamping within certificate boundaries.
4. **Temporary Templates & Asset Replacement:**
   - Includes four championship-ready vector templates (Gold Medal, Silver Medal, Bronze Medal, and Participation).
   - **Participation certificates strictly omit medal rankings and positions**.
   - **Replace Blank Engine**: Administrators can upload official PNG, JPG, or PDF blanks at any time, replacing background artwork **without losing saved text coordinates or styles**.
5. **Completely Local & Private:**
   - Zero external database or backend dependencies.
   - Storage uses browser `localStorage` with a 500-record rolling cap to prevent storage quota exhaustion.
   - Zero QR code or tracking bloat.

---

## Development Milestones & Phase Index

| Phase | Milestone Name | Commit | Documentation |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Application Foundation & Core Dashboard | Initial | [Phase 1 Completion Report](file:///C:/Users/Sameer/.gemini/antigravity/brain/6dff9203-e9fe-43d7-9169-7218136aabf2/kyorix_phase_completion_report.md) |
| **Phase 2** | Template Calibration & Text Positioning Editor | [`d1965bc`](file:///c:/Users/Sameer/.gemini/antigravity/scratch/kyorix%20certfct%20gnr) | [Phase 2 Completion Report](file:///C:/Users/Sameer/.gemini/antigravity/brain/6dff9203-e9fe-43d7-9169-7218136aabf2/kyorix_phase2_completion_report.md) |
| **Phase 3** | Bulk Certificate Generation & Excel/CSV Import | [`028140d`](file:///c:/Users/Sameer/.gemini/antigravity/scratch/kyorix%20certfct%20gnr) | [Phase 3 Completion Report](file:///C:/Users/Sameer/.gemini/antigravity/brain/6dff9203-e9fe-43d7-9169-7218136aabf2/kyorix_phase3_completion_report.md) |
| **Phase 4** | Temporary Certificate Templates & Replacement Engine | [`e1c735b`](file:///c:/Users/Sameer/.gemini/antigravity/scratch/kyorix%20certfct%20gnr) | [Phase 4 Completion Report](file:///C:/Users/Sameer/.gemini/antigravity/brain/6dff9203-e9fe-43d7-9169-7218136aabf2/kyorix_phase4_completion_report.md) |
| **Phase 5** | Final QA, Stabilization, Leading Zeros & QR Removal | [`06e681f`](file:///c:/Users/Sameer/.gemini/antigravity/scratch/kyorix%20certfct%20gnr) | [Phase 5 Final Report](file:///C:/Users/Sameer/.gemini/antigravity/brain/6dff9203-e9fe-43d7-9169-7218136aabf2/kyorix_phase5_final_qa_report.md) |

---

## Quick Start

### 1. Installation

Ensure Node.js 18+ is installed:

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Automated QA & Integration Tests

Run the comprehensive 30-test QA suite:

```bash
npm test
```

### 4. Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

---

## Project Structure

```
kyorix-certificate-generator/
├── public/
│   ├── templates/               # Standalone vector SVG certificate templates
│   │   ├── gold_medal_template.svg
│   │   ├── silver_medal_template.svg
│   │   ├── bronze_medal_template.svg
│   │   └── participation_template.svg
│   └── pdf.worker.min.mjs       # Offline PDF rendering engine
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout & Kyorix typography
│   │   └── page.tsx             # Master navigation & state coordinator
│   ├── components/
│   │   ├── AthleteForm.tsx      # Individual athlete entry & validation
│   │   ├── BulkGenerator.tsx    # Excel/CSV parser, roster table, batch runner, ZIP packager
│   │   ├── CertificateHistory.tsx# Audit records table, search, and reprint viewer
│   │   ├── CertificatePreview.tsx# Single certificate viewer, template selector & PDF exporter
│   │   ├── CertificateRenderer.tsx# Universal certificate renderer with coordinate clamping
│   │   ├── DashboardOverview.tsx # Metrics overview & quick action tiles
│   │   ├── Header.tsx           # Global header with quick actions
│   │   ├── Sidebar.tsx          # Responsive navigation drawer
│   │   ├── TemplateCalibrator.tsx# Visual drag-and-drop text positioning editor
│   │   └── TemplateManager.tsx  # Template repository, blank preview, renaming, asset replacement
│   ├── lib/
│   │   ├── default-layout.ts    # Default coordinate presets for landscape and portrait
│   │   ├── pdf.ts               # Client-side html2canvas & jsPDF exporter
│   │   ├── spreadsheet.ts       # XLSX/CSV parsing, fuzzy header detection, leading zero preservation
│   │   ├── storage.ts           # Browser localStorage manager with 500-item quota cap
│   │   ├── templates-generator.ts# High-res SVG template definitions & baseline datasets
│   │   └── zip-generator.ts     # Client-side JSZip packaging utility
│   └── types/
│       └── index.ts             # TypeScript definitions
├── scratch/
│   └── qa_suite.js              # Automated 30-point QA test suite
├── package.json
└── README.md
```

---

## License & Intellectual Property

Copyright © 2026 Kyorix Sports Technology. All rights reserved.
