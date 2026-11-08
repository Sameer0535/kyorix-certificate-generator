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
  TrendingUp,
  FileCheck,
  PlusCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
  Medal,
  Calendar,
  Sparkles,
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

  const recentHistory = history.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-950 via-[#0A1128] to-slate-900 border border-amber-500/30 p-8 shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 — Operational Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Kyorix Certificate Generator
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Official certificate authoring workspace for Taekwondo tournaments and athletic
              federations. Enter athlete specifications, apply custom templates, and generate
              press-ready official PDF awards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('generate')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Award className="w-4 h-4" />
              Generate Certificate
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              Manage Templates
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
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{history.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Official records authorized
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
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Medal className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {goldCount + silverCount + bronzeCount}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
            <span className="text-amber-600">Gold: {goldCount}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Silver: {silverCount}</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-800">Bronze: {bronzeCount}</span>
          </div>
        </div>

        {/* Participation Certificates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Participation
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Generate Certificate */}
        <div
          onClick={() => onNavigate('generate')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
              Generate Certificate
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Enter athlete Kukkiwon ID, weight category, championship data, and instantly generate
              a certified PDF award.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Open Entry Form</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Manage Templates */}
        <div
          onClick={() => onNavigate('templates')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
              Manage Templates
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Upload custom tournament blanks in PNG, JPG, or PDF. Assign and replace templates
              for podium or participation categories.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
            <span>Configure Repository</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Certificate History */}
        <div
          onClick={() => onNavigate('history')}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
              Certificate History
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Review issued certificates, re-download PDFs, audit athlete Kukkiwon credentials, and
              export comprehensive issuance records.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
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
              Recently Generated Certificates
            </h3>
            <p className="text-xs text-slate-400">Latest official certificates authored</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
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
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
                    {rec.athleteDetails.certificateType.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {rec.athleteDetails.athleteName}
                    </p>
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
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
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

