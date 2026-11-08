import React from 'react';

interface KyorixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'horizontal' | 'square';
}

export const KyorixLogo: React.FC<KyorixLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
}) => {
  const heightClass =
    size === 'sm'
      ? 'h-8'
      : size === 'lg'
      ? 'h-14'
      : size === 'xl'
      ? 'h-20'
      : 'h-10';

  const logoSrc = variant === 'square' ? '/images/kyorix-logo-square.jpg' : '/images/kyorix-logo.png';

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Kyorix Sport Technology"
        className={`${heightClass} w-auto object-contain select-none`}
      />
    </div>
  );
};

