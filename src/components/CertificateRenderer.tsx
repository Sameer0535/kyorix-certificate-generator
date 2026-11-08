import React from 'react';
import { AthleteDetails, CertificateTemplate, CertificateType, FieldPositionConfig } from '@/types';
import { Award } from 'lucide-react';

interface CertificateRendererProps {
  athlete: AthleteDetails;
  template?: CertificateTemplate | null;
  className?: string;
  isExporting?: boolean;
}

export const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  athlete,
  template,
  className = '',
  isExporting = false,
}) => {
  const certNumber = athlete.certificateNumber || 'KYX-2026-CERT';
  const isPortrait = template?.orientation === 'portrait';
  const canvasWidth = isPortrait ? 742 : 1050;
  const canvasHeight = isPortrait ? 1050 : 742;

  const isParticipation = athlete.certificateType === 'Participation';
  const backgroundImage =
    template?.previewImageUrl || (template?.dataUrl ? template.dataUrl : null);

  const useCustomLayout = template?.layoutConfig && template.layoutConfig.useCustomLayout;
  const layout = template?.layoutConfig;

  const issueDateFormatted = athlete.issueDate
    ? new Date(athlete.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const championshipDateFormatted = athlete.championshipDate
    ? new Date(athlete.championshipDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Championship Date';

  // Medal distinction label
  const getMedalDisplay = (): string => {
    if (isParticipation) return ''; // Participation certificates must NOT display medal positions
    if (athlete.medalResult && athlete.medalResult.trim()) {
      return athlete.medalResult.toUpperCase();
    }
    switch (athlete.certificateType) {
      case 'Gold Medal':
        return '1ST PLACE • GOLD MEDALIST';
      case 'Silver Medal':
        return '2ND PLACE • SILVER MEDALIST';
      case 'Bronze Medal':
        return '3RD PLACE • BRONZE MEDALIST';
      default:
        return '';
    }
  };

  const medalDisplay = getMedalDisplay();

  // Styling config for default fallbacks
  const getTypeConfig = (type: CertificateType) => {
    switch (type) {
      case 'Gold Medal':
        return {
          title: 'CHAMPION OF EXCELLENCE',
          badge: '1ST PLACE • GOLD MEDAL',
          medalBg: 'from-amber-400 via-yellow-300 to-amber-600',
          textColor: 'text-amber-800',
          sealColor: '#D4AF37',
          awardPhrase: 'for securing First Place and achieving Gold Medal Distinction in',
        };
      case 'Silver Medal':
        return {
          title: 'RUNNER UP DISTINCTION',
          badge: '2ND PLACE • SILVER MEDAL',
          medalBg: 'from-slate-200 via-slate-400 to-slate-500',
          textColor: 'text-slate-800',
          sealColor: '#94A3B8',
          awardPhrase: 'for securing Second Place and achieving Silver Medal Distinction in',
        };
      case 'Bronze Medal':
        return {
          title: 'HONORABLE PODIUM PLACEMENT',
          badge: '3RD PLACE • BRONZE MEDAL',
          medalBg: 'from-amber-700 via-yellow-700 to-amber-900',
          textColor: 'text-amber-900',
          sealColor: '#B45309',
          awardPhrase: 'for securing Third Place and achieving Bronze Medal Distinction in',
        };
      case 'Participation':
      default:
        return {
          title: 'CERTIFICATE OF PARTICIPATION',
          badge: 'OFFICIAL COMPETITOR',
          medalBg: 'from-blue-600 via-indigo-600 to-blue-800',
          textColor: 'text-blue-900',
          sealColor: '#2563EB',
          awardPhrase: 'for outstanding martial arts sportsmanship and active competitive participation in',
        };
    }
  };

  const config = getTypeConfig(athlete.certificateType);

  const renderCalibratedField = (
    field: FieldPositionConfig | undefined,
    value: string,
    key: string
  ) => {
    if (!field || !field.visible || !value) return null;

    const fontClass =
      field.fontFamily === 'serif'
        ? 'font-serif'
        : field.fontFamily === 'mono'
        ? 'font-mono'
        : 'font-sans';

    const fullText = `${field.prefix || ''}${value}${field.suffix || ''}`;

    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          left: `${field.xPercent}%`,
          top: `${field.yPercent}%`,
          transform:
            field.textAlign === 'left'
              ? 'translate(0, -50%)'
              : field.textAlign === 'right'
              ? 'translate(-100%, -50%)'
              : 'translate(-50%, -50%)',
          fontSize: `${field.fontSizePx}px`,
          color: field.color || '#0F172A',
          textAlign: field.textAlign,
          fontWeight: field.isBold ? 700 : 400,
          maxWidth: '90%',
          zIndex: 30,
        }}
        className={`${fontClass} leading-tight select-none pointer-events-none whitespace-nowrap`}
      >
        {fullText}
      </div>
    );
  };

  return (
    <div
      id="kyorix-printable-certificate"
      className={`relative select-none overflow-hidden bg-white text-slate-900 ${className}`}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        position: 'relative',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Background layer: Render template SVG/PNG/JPG/PDF image */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={backgroundImage}
            alt="Certificate Template Backdrop"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        /* Default Official Kyorix Vector Frame */
        <div className="absolute inset-0 z-0 bg-[#FCFDFE]">
          <div className="absolute inset-4 border-[5px] border-[#0F172A] pointer-events-none" />
          <div className="absolute inset-6 border-[2px] border-cyan-600 pointer-events-none" />
          <div className="absolute inset-8 border border-dashed border-cyan-500/40 pointer-events-none" />
          <div className="absolute top-6 left-6 w-14 h-14 border-t-4 border-l-4 border-cyan-600 pointer-events-none" />
          <div className="absolute top-6 right-6 w-14 h-14 border-t-4 border-r-4 border-cyan-600 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-14 h-14 border-b-4 border-l-4 border-cyan-600 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-14 h-14 border-b-4 border-r-4 border-cyan-600 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
            <span className="text-[120px] font-black tracking-widest text-[#0F172A]">KYORIX</span>
          </div>
        </div>
      )}

      {/* RENDER MODE A: Custom Calibrated Layout Mode */}
      {useCustomLayout && layout ? (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        >
          {/* 1. Athlete Name */}
          {renderCalibratedField(layout.athleteName, athlete.athleteName, 'athleteName')}

          {/* 2. Kukkiwon ID */}
          {renderCalibratedField(layout.kukkiwonId, athlete.kukkiwonId, 'kukkiwonId')}

          {/* 3. Academy Name */}
          {renderCalibratedField(layout.academyName, athlete.academyName, 'academyName')}

          {/* 4. Weight Category */}
          {renderCalibratedField(layout.weightCategory, athlete.weightCategory, 'weightCategory')}

          {/* 5. Championship Name */}
          {renderCalibratedField(layout.championshipName, athlete.championshipName, 'championshipName')}

          {/* 6. Championship Date */}
          {renderCalibratedField(
            layout.championshipDate,
            championshipDateFormatted,
            'championshipDate'
          )}

          {/* 7. Medal Result: ONLY rendered if NOT a participation certificate */}
          {!isParticipation &&
            medalDisplay &&
            renderCalibratedField(layout.medalResult, medalDisplay, 'medalResult')}

          {/* 8. Certificate Serial Number */}
          {layout.certificateNumber &&
            renderCalibratedField(layout.certificateNumber, certNumber, 'certificateNumber')}

          {/* 9. Issue Date */}
          {layout.issueDate &&
            renderCalibratedField(layout.issueDate, issueDateFormatted, 'issueDate')}
        </div>
      ) : (
        /* RENDER MODE B: Default Standard Kyorix Frame */
        <div
          className="absolute inset-0 z-20 w-full h-full p-12 flex flex-col justify-between pointer-events-none"
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        >
          <div className="text-center pt-2">
            <div className="flex items-center justify-between px-8 mb-3">
              <div className="flex items-center gap-3 text-left">
                <img
                  src="/images/kyorix-logo.png"
                  alt="Kyorix Sport Technology"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {!isParticipation && (
                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-sm border border-cyan-400/40 bg-gradient-to-r ${config.medalBg} text-slate-900`}
                >
                  {config.badge}
                </div>
              )}

              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Kukkiwon Verified ID
                </p>
                <p className="text-xs font-mono font-black text-[#0F172A] tracking-wider">
                  {athlete.kukkiwonId || 'PENDING ID'}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-black uppercase tracking-[0.25em] text-[#0F172A] font-serif mt-1">
              {config.title}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-cyan-500" />
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </div>
            <p className="text-[12px] uppercase tracking-widest font-medium text-slate-600">
              This is proudly presented to
            </p>
          </div>

          {/* Athlete Name */}
          <div className="text-center my-1">
            <div className="inline-block max-w-[850px] px-8 py-1.5 border-b-2 border-cyan-600">
              <h2 className="text-4xl font-extrabold tracking-wide text-[#0F172A] capitalize font-serif">
                {athlete.athleteName || 'Athlete Name'}
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-2 tracking-wide">
              Representing{' '}
              <span className="font-bold text-[#0F172A] uppercase">
                {athlete.academyName || 'Sports Academy'}
              </span>
            </p>
          </div>

          {/* Details */}
          <div className="max-w-[780px] mx-auto text-center px-6">
            <p className="text-[13px] leading-relaxed text-slate-700">{config.awardPhrase}</p>
            <p className="text-lg font-black uppercase tracking-wide text-[#0F172A] mt-1">
              {athlete.championshipName || 'Official Taekwondo Championship'}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-3 max-w-[540px] mx-auto bg-slate-50/80 border border-slate-200/80 rounded-lg p-2.5">
              <div className="text-left border-r border-slate-200 pr-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Weight Category
                </span>
                <span className="text-xs font-extrabold text-[#0F172A]">
                  {athlete.weightCategory || 'Open Division'}
                </span>
              </div>
              <div className="text-left pl-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Championship Date
                </span>
                <span className="text-xs font-extrabold text-[#0F172A]">
                  {championshipDateFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 pb-2">
            <div className="grid grid-cols-3 items-end gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="h-10 flex items-center justify-center font-serif italic text-lg text-slate-700 font-semibold select-none">
                  Master K. S. Park
                </div>
                <div className="w-44 border-t border-slate-400 mt-1" />
                <p className="text-[11px] font-bold uppercase text-[#0F172A] mt-1">
                  Tournament Director
                </p>
                <p className="text-[9px] text-slate-500">Kyorix Championship Committee</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-cyan-600 bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-50 flex flex-col items-center justify-center shadow-md p-1">
                  <div className="w-full h-full rounded-full border border-dashed border-cyan-500 flex flex-col items-center justify-center text-center">
                    <Award className="w-5 h-5 text-cyan-600 mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-tighter text-[#0F172A]">
                      KYORIX VERIFIED
                    </span>
                    <span className="text-[6px] font-bold text-cyan-700">SPORTS TECH</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1.5 font-bold">
                  {certNumber}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-10 flex items-center justify-center font-serif italic text-lg text-slate-700 font-semibold select-none">
                  Dr. H. J. Lee
                </div>
                <div className="w-44 border-t border-slate-400 mt-1" />
                <p className="text-[11px] font-bold uppercase text-[#0F172A] mt-1">
                  Head of Scrutiny & Referee
                </p>
                <p className="text-[9px] text-slate-500">World Kukkiwon Official Panel</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
              <span>Authentication Hash: SHA256-KYX-{certNumber}</span>
              <span>Issued Date: {issueDateFormatted}</span>
              <span>Generated via Kyorix Certificate Generator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
