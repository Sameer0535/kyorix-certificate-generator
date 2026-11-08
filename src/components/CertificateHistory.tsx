import React, { useState } from 'react';
import { GeneratedCertificateRecord, CertificateType } from '@/types';
import {
  History,
  Search,
  Download,
  Eye,
  Trash2,
  Calendar,
  Medal,
  Award,
  Filter,
  CheckCircle,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

interface CertificateHistoryProps {
  history: GeneratedCertificateRecord[];
  onViewRecord: (record: GeneratedCertificateRecord) => void;
  onClearHistory: () => void;
}

export const CertificateHistory: React.FC<CertificateHistoryProps> = ({
  history,
  onViewRecord,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = history.filter(record => {
    const matchesCategory =
      selectedCategory === 'ALL' || record.athleteDetails.certificateType === selectedCategory;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      record.athleteDetails.athleteName.toLowerCase().includes(term) ||
      record.athleteDetails.kukkiwonId.toLowerCase().includes(term) ||
      record.athleteDetails.academyName.toLowerCase().includes(term) ||
      record.certificateNumber.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const getBadgeStyle = (type: CertificateType) => {
    switch (type) {
      case 'Gold Medal':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Silver Medal':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Bronze Medal':
        return 'bg-amber-900/10 text-amber-800 border-amber-700/40';
      case 'Participation':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'Certificate Number',
      'Athlete Name',
      'Kukkiwon ID',
      'Academy Name',
      'Weight Category',
      'Certificate Type',
      'Championship Name',
      'Championship Date',
      'Generated Date',
    ];

    const rows = history.map(r => [
      r.certificateNumber,
      `"${r.athleteDetails.athleteName}"`,
      `"${r.athleteDetails.kukkiwonId}"`,
      `"${r.athleteDetails.academyName}"`,
      `"${r.athleteDetails.weightCategory}"`,
      `"${r.athleteDetails.certificateType}"`,
      `"${r.athleteDetails.championshipName}"`,
      r.athleteDetails.championshipDate,
      r.generatedAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kyorix_Certificate_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <History className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">Certificate Issuance History</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete audit trail of all athlete certificates generated and authorized through the
            system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Export CSV
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear the generation history?')) {
                    onClearHistory();
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 transition flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by athlete, Kukkiwon ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'Gold Medal', 'Silver Medal', 'Bronze Medal', 'Participation'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="px-6 pb-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl border-2 border-dashed border-slate-200">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No certificate records found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate a new certificate to establish an issuance record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Cert #</th>
                  <th className="py-3.5 px-4">Athlete Details</th>
                  <th className="py-3.5 px-4">Kukkiwon ID</th>
                  <th className="py-3.5 px-4">Academy / Club</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date Issued</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {record.certificateNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 text-sm">
                        {record.athleteDetails.athleteName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {record.athleteDetails.weightCategory}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {record.athleteDetails.kukkiwonId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {record.athleteDetails.academyName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                          record.athleteDetails.certificateType
                        )}`}
                      >
                        {record.athleteDetails.certificateType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(record.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewRecord(record)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview & PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

