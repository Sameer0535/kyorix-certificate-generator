import React from 'react';

interface KyorixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const KyorixLogo: React.FC<KyorixLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const textClass =
    size === 'sm'
      ? 'text-lg font-bold'
      : size === 'lg'
      ? 'text-2xl font-black'
      : 'text-xl font-extrabold';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic Emblem with Gold Accents and Navy Shield */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 rounded-lg transform rotate-45 shadow-lg shadow-amber-500/20" />
        <div className="absolute inset-0.5 bg-slate-950 rounded-lg transform rotate-45 flex items-center justify-center">
          {/* Inner Golden Monogram K with Speed Slash */}
          <svg
            className="w-3/5 h-3/5 text-amber-400 transform -rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 4v16" />
            <path d="M19 5l-10 7 10 7" />
            <path d="M9 12h5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`${textClass} tracking-wider text-white font-mono flex items-center gap-1.5`}>
          <span>KYORIX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </span>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-400/90 -mt-0.5">
            Sports Technology
          </span>
        )}
      </div>
    </div>
  );
};

