import React, { useState } from 'react';
import { AthleteDetails, CertificateType } from '@/types';
import { Award, Medal, CheckCircle2, AlertCircle, Sparkles, User, Shield, Building, Dumbbell, Trophy, Calendar } from 'lucide-react';

interface AthleteFormProps {
  initialValues?: Partial<AthleteDetails>;
  onSubmit: (details: AthleteDetails) => void;
  isLoading?: boolean;
}

const SAMPLE_DATA: AthleteDetails = {
  kukkiwonId: '05948321',
  athleteName: 'Ethan Christopher Vance',
  academyName: 'Apex Taekwondo & High Performance Center',
  weightCategory: 'Senior Male Under 68kg (Featherweight)',
  championshipName: '2026 Kyorix International Taekwondo Championship',
  championshipDate: '2026-10-24',
  certificateType: 'Gold Medal',
};

const CERTIFICATE_TYPES: {
  type: CertificateType;
  label: string;
  desc: string;
  accent: string;
  badgeBg: string;
  borderCol: string;
}[] = [
  {
    type: 'Gold Medal',
    label: 'Gold Medal',
    desc: '1st Place Champion',
    accent: 'text-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-500',
    borderCol: 'border-amber-400',
  },
  {
    type: 'Silver Medal',
    label: 'Silver Medal',
    desc: '2nd Place Runner-up',
    accent: 'text-slate-400',
    badgeBg: 'bg-slate-400/10 text-slate-300',
    borderCol: 'border-slate-300',
  },
  {
    type: 'Bronze Medal',
    label: 'Bronze Medal',
    desc: '3rd Place Podium',
    accent: 'text-amber-700',
    badgeBg: 'bg-amber-800/10 text-amber-600',
    borderCol: 'border-amber-600',
  },
  {
    type: 'Participation',
    label: 'Participation',
    desc: 'Official Competitor',
    accent: 'text-blue-500',
    badgeBg: 'bg-blue-500/10 text-blue-400',
    borderCol: 'border-blue-500',
  },
];

export const AthleteForm: React.FC<AthleteFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AthleteDetails>({
    kukkiwonId: initialValues?.kukkiwonId || '',
    athleteName: initialValues?.athleteName || '',
    academyName: initialValues?.academyName || '',
    weightCategory: initialValues?.weightCategory || '',
    championshipName: initialValues?.championshipName || '2026 Kyorix National Taekwondo Open Championship',
    championshipDate: initialValues?.championshipDate || '2026-05-15',
    certificateType: initialValues?.certificateType || 'Gold Medal',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AthleteDetails, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AthleteDetails, boolean>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AthleteDetails, string>> = {};

    if (!formData.kukkiwonId.trim()) {
      newErrors.kukkiwonId = 'Kukkiwon ID is required';
    } else if (formData.kukkiwonId.trim().length < 4) {
      newErrors.kukkiwonId = 'Kukkiwon ID must be at least 4 alphanumeric characters';
    }

    if (!formData.athleteName.trim()) {
      newErrors.athleteName = 'Athlete name is required';
    } else if (formData.athleteName.trim().length < 2) {
      newErrors.athleteName = 'Name must be at least 2 characters';
    }

    if (!formData.academyName.trim()) {
      newErrors.academyName = 'Academy / Dojang name is required';
    }

    if (!formData.weightCategory.trim()) {
      newErrors.weightCategory = 'Weight category is required';
    }

    if (!formData.championshipName.trim()) {
      newErrors.championshipName = 'Championship name is required';
    }

    if (!formData.championshipDate) {
      newErrors.championshipDate = 'Championship date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof AthleteDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof AthleteDetails) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Inline validate field
    if (field === 'kukkiwonId' && !formData.kukkiwonId.trim()) {
      setErrors(prev => ({ ...prev, kukkiwonId: 'Kukkiwon ID is required' }));
    }
    if (field === 'athleteName' && !formData.athleteName.trim()) {
      setErrors(prev => ({ ...prev, athleteName: 'Athlete name is required' }));
    }
    if (field === 'academyName' && !formData.academyName.trim()) {
      setErrors(prev => ({ ...prev, academyName: 'Academy name is required' }));
    }
    if (field === 'weightCategory' && !formData.weightCategory.trim()) {
      setErrors(prev => ({ ...prev, weightCategory: 'Weight category is required' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleQuickFill = () => {
    setFormData(SAMPLE_DATA);
    setErrors({});
  };

  const handleClear = () => {
    setFormData({
      kukkiwonId: '',
      athleteName: '',
      academyName: '',
      weightCategory: '',
      championshipName: '2026 Kyorix National Taekwondo Open Championship',
      championshipDate: '2026-05-15',
      certificateType: 'Participation',
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Form Card Header */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-600" />
            Athlete Certification Entry Form
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in official competitor specifications to generate an authorized certificate
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickFill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Load Sample Data
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Certificate Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Select Certificate Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CERTIFICATE_TYPES.map(cat => {
              const isSelected = formData.certificateType === cat.type;
              return (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => handleChange('certificateType', cat.type)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border-2 transition-all relative ${
                    isSelected
                      ? `bg-slate-900 text-white shadow-md ${cat.borderCol}`
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">{cat.label}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Medal className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Kukkiwon ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Kukkiwon ID / Dan Reg. <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Shield className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. 05389104 or DAN-9821"
                value={formData.kukkiwonId}
                onChange={e => handleChange('kukkiwonId', e.target.value)}
                onBlur={() => handleBlur('kukkiwonId')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.kukkiwonId
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.kukkiwonId && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.kukkiwonId}
              </p>
            )}
          </div>

          {/* Athlete Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Athlete Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Min-Jun Park"
                value={formData.athleteName}
                onChange={e => handleChange('athleteName', e.target.value)}
                onBlur={() => handleBlur('athleteName')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.athleteName
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.athleteName && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.athleteName}
              </p>
            )}
          </div>

          {/* Academy Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Academy / Dojang Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Seoul Tiger Taekwondo Academy"
                value={formData.academyName}
                onChange={e => handleChange('academyName', e.target.value)}
                onBlur={() => handleBlur('academyName')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.academyName
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.academyName && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.academyName}
              </p>
            )}
          </div>

          {/* Registered Weight Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Registered Weight Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Under 58kg (Flyweight) or Senior Welterweight"
                value={formData.weightCategory}
                onChange={e => handleChange('weightCategory', e.target.value)}
                onBlur={() => handleBlur('weightCategory')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.weightCategory
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.weightCategory && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.weightCategory}
              </p>
            )}
          </div>

          {/* Championship Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Championship Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Trophy className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. 2026 Kyorix National Taekwondo Open"
                value={formData.championshipName}
                onChange={e => handleChange('championshipName', e.target.value)}
                onBlur={() => handleBlur('championshipName')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.championshipName
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.championshipName && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.championshipName}
              </p>
            )}
          </div>

          {/* Championship Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Championship Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={formData.championshipDate}
                onChange={e => handleChange('championshipDate', e.target.value)}
                onBlur={() => handleBlur('championshipDate')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  errors.championshipDate
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-200/50'
                }`}
              />
            </div>
            {errors.championshipDate && (
              <p className="flex items-center gap-1 text-xs text-rose-600 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.championshipDate}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Certificate...</span>
              </>
            ) : (
              <>
                <Award className="w-5 h-5 text-white" />
                <span>Generate Certificate Preview</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

