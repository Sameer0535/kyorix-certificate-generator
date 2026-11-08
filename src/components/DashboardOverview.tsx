import React from 'react';
import {
  CertificateTemplate,
  GeneratedCertificateRecord,
  NavigationTab,
} from '@/types';
import {
  Award,
  Layers,
  History,
  FileCheck,
  Upload,
  ArrowRight,
  ShieldCheck,
  Medal,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardOverviewProps {
  templates: CertificateTemplate[];
  history: GeneratedCertificateRecord[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectRecentRecord: (record: GeneratedCertificateRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  templates,
  history,
  onNavigate,
  onSelectRecentRecord,
}) => {
  const goldCount = history.filter(h => h.athleteDetails.certificateType === 'Gold Medal').length;
  const silverCount = history.filter(h => h.athleteDetails.certificateType === 'Silver Medal').length;
  const bronzeCount = history.filter(h => h.athleteDetails.certificateType === 'Bronze Medal').length;
  const participationCount = history.filter(
    h => h.athleteDetails.certificateType === 'Participation'
  ).length;

  const bulkGeneratedCount = history.filter(h => h.isBulk).length;
  const recentHistory = history.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-100 p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Kyorix Certification Engine Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Kyorix Certificate Generator
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Official certificate authoring workspace for Taekwondo tournaments and athletic
              federations. Enter athlete specifications individually or import complete competition
              rosters (.xlsx, .csv) with automatic calibration and ZIP downloads.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('bulk')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Generate (Excel)
            </button>
            <button
              onClick={() => onNavigate('generate')}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-cyan-600" />
              Single Certificate
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Generated */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Generated
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{history.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{bulkGeneratedCount} generated via bulk batches</span>
          </p>
        </div>

        {/* Active Templates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Templates
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{templates.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span>PNG, JPG, PDF templates ready</span>
          </p>
        </div>

        {/* Podium Certificates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Podium Medals
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Medal className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {goldCount + silverCount + bronzeCount}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
            <span className="text-amber-600">G: {goldCount}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">S: {silverCount}</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-800">B: {bronzeCount}</span>
          </div>
        </div>

        {/* Participation Certificates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Participation
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{participationCount}</p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Official competitor issuances
          </p>
        </div>
      </div>

      {/* Main Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Card 1: Bulk Generation */}
        <div
          onClick={() => onNavigate('bulk')}
          className="bg-white rounded-2xl p-6 border-2 border-cyan-400/40 shadow-md hover:shadow-xl hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-cyan-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition">
                Bulk Generation
              </h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                Batch
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload Excel (.xlsx) or CSV files, validate roster entries, and generate zipped PDF
              batches.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
            <span>Upload Spreadsheet</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Single Certificate */}
        <div
          onClick={() => onNavigate('generate')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition">
              Single Certificate
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Enter individual athlete credentials and instantly generate an authorized certificate
              PDF.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
            <span>Open Entry Form</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Manage Templates */}
        <div
          onClick={() => onNavigate('templates')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition">
              Manage Templates
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Upload custom blanks (PNG, JPG, PDF) and visually calibrate exact text positions.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
            <span>Configure Repository</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Certificate History */}
        <div
          onClick={() => onNavigate('history')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-sm">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition">
              Certificate History
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Review individual and bulk generated records, audit Kukkiwon credentials, and export
              CSV logs.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
            <span>View Full Audit Log</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recent Certificates Generated Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recently Issued Certificates
            </h3>
            <p className="text-xs text-slate-400">Latest official certificates authored</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition"
          >
            <span>View All ({history.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No certificates generated yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentHistory.map(rec => (
              <div
                key={rec.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-cyan-700 border border-slate-200 flex items-center justify-center text-xs font-bold font-mono">
                    {rec.athleteDetails.certificateType.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">
                        {rec.athleteDetails.athleteName}
                      </p>
                      {rec.isBulk && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                          Bulk Batch
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {rec.athleteDetails.academyName} • ID:{' '}
                      <span className="font-mono">{rec.athleteDetails.kukkiwonId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {rec.athleteDetails.certificateType}
                  </span>
                  <button
                    onClick={() => onSelectRecentRecord(rec)}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
