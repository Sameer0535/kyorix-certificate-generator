import { CertificateTemplate, TemplateLayoutConfig } from '@/types';
import { DEFAULT_TEMPLATE_LAYOUT } from './default-layout';

/**
 * Creates SVG Data URLs for the 4 Temporary Certificate Templates
 * Following Kyorix branding: Deep navy, gold/silver/bronze/navy accents, clean white/ivory surfaces,
 * professional borders, corner ornaments, organization logo area, and signature lines.
 */

function createSvgDataUrl(svgString: string): string {
  const cleaned = svgString.replace(/\n\s+/g, ' ').trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
}

// 1. Gold Medal Certificate SVG Template
export const GOLD_TEMPLATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 742" width="1050" height="742">
  <defs>
    <linearGradient id="goldBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFDFD"/>
      <stop offset="50%" stop-color="#FFFDF7"/>
      <stop offset="100%" stop-color="#FBF7EC"/>
    </linearGradient>
    <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B8860B"/>
      <stop offset="50%" stop-color="#F5D061"/>
      <stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1050" height="742" fill="url(#goldBg)"/>

  <!-- Outer Navy Frame -->
  <rect x="20" y="20" width="1010" height="702" fill="none" stroke="#0A1128" stroke-width="6"/>

  <!-- Inner Gold Double Borders -->
  <rect x="34" y="34" width="982" height="674" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
  <rect x="42" y="42" width="966" height="658" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="6,4" opacity="0.7"/>

  <!-- Corner Filigree Ornaments -->
  <!-- Top Left -->
  <path d="M 42 76 L 76 42 M 42 62 L 62 42 M 42 42 L 86 42 M 42 42 L 42 86" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="56" r="3" fill="#D4AF37"/>
  <!-- Top Right -->
  <path d="M 1008 76 L 974 42 M 1008 62 L 988 42 M 1008 42 L 964 42 M 1008 42 L 1008 86" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="56" r="3" fill="#D4AF37"/>
  <!-- Bottom Left -->
  <path d="M 42 666 L 76 700 M 42 680 L 62 700 M 42 700 L 86 700 M 42 700 L 42 656" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="686" r="3" fill="#D4AF37"/>
  <!-- Bottom Right -->
  <path d="M 1008 666 L 974 700 M 1008 680 L 988 700 M 1008 700 L 964 700 M 1008 700 L 1008 656" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="686" r="3" fill="#D4AF37"/>

  <!-- Watermark Emblem in Background -->
  <g opacity="0.035" transform="translate(525, 371)">
    <circle r="190" fill="none" stroke="#0A1128" stroke-width="28"/>
    <circle r="150" fill="none" stroke="#D4AF37" stroke-width="8"/>
    <text text-anchor="middle" y="25" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="#0A1128" letter-spacing="12">KYORIX</text>
  </g>

  <!-- Top Logo & Organization Placeholder Space -->
  <g transform="translate(525, 78)">
    <rect x="-85" y="-18" width="170" height="34" rx="6" fill="#0A1128" stroke="#D4AF37" stroke-width="1.5"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="2">KYORIX SPORTS TECH</text>
  </g>

  <!-- Gold Laurel & Medal Header Badge -->
  <g transform="translate(525, 126)">
    <circle cx="0" cy="0" r="18" fill="url(#goldRibbon)"/>
    <circle cx="0" cy="0" r="14" fill="#0A1128"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#F5D061">1ST</text>
    <path d="M -24 -2 Q -38 -12 -54 -2 Q -42 12 -28 6" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <path d="M 24 -2 Q 38 -12 54 -2 Q 42 12 28 6" fill="none" stroke="#D4AF37" stroke-width="2"/>
  </g>

  <!-- Dedicated Space for Signatures at Bottom -->
  <!-- Left Signature -->
  <g transform="translate(240, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">TOURNAMENT DIRECTOR</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">Kyorix Championship Committee</text>
  </g>

  <!-- Center Official Gold Seal Placeholder -->
  <g transform="translate(525, 626)">
    <circle cx="0" cy="0" r="32" fill="url(#goldRibbon)" stroke="#0A1128" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="28" fill="#FFFDF7" stroke="#D4AF37" stroke-width="1" stroke-dasharray="3,2"/>
    <text text-anchor="middle" y="-6" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="7" fill="#0A1128" letter-spacing="1">OFFICIAL SEAL</text>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="9" fill="#B8860B">GOLD</text>
    <text text-anchor="middle" y="14" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="6" fill="#0A1128">AUTHENTICATED</text>
  </g>

  <!-- Right Signature -->
  <g transform="translate(810, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">HEAD OF SCRUTINY</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">World Kukkiwon Official Panel</text>
  </g>
</svg>`;

// 2. Silver Medal Certificate SVG Template
export const SILVER_TEMPLATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 742" width="1050" height="742">
  <defs>
    <linearGradient id="silverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="silverRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748B"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
  </defs>

  <rect width="1050" height="742" fill="url(#silverBg)"/>

  <!-- Outer Navy Frame -->
  <rect x="20" y="20" width="1010" height="702" fill="none" stroke="#0A1128" stroke-width="6"/>

  <!-- Inner Metallic Silver Borders -->
  <rect x="34" y="34" width="982" height="674" fill="none" stroke="#94A3B8" stroke-width="2.5"/>
  <rect x="42" y="42" width="966" height="658" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="6,4" opacity="0.7"/>

  <!-- Corner Filigree Ornaments -->
  <path d="M 42 76 L 76 42 M 42 62 L 62 42 M 42 42 L 86 42 M 42 42 L 42 86" stroke="#64748B" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="56" r="3" fill="#64748B"/>
  <path d="M 1008 76 L 974 42 M 1008 62 L 988 42 M 1008 42 L 964 42 M 1008 42 L 1008 86" stroke="#64748B" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="56" r="3" fill="#64748B"/>
  <path d="M 42 666 L 76 700 M 42 680 L 62 700 M 42 700 L 86 700 M 42 700 L 42 656" stroke="#64748B" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="686" r="3" fill="#64748B"/>
  <path d="M 1008 666 L 974 700 M 1008 680 L 988 700 M 1008 700 L 964 700 M 1008 700 L 1008 656" stroke="#64748B" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="686" r="3" fill="#64748B"/>

  <!-- Watermark -->
  <g opacity="0.035" transform="translate(525, 371)">
    <circle r="190" fill="none" stroke="#0A1128" stroke-width="28"/>
    <circle r="150" fill="none" stroke="#64748B" stroke-width="8"/>
    <text text-anchor="middle" y="25" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="#0A1128" letter-spacing="12">KYORIX</text>
  </g>

  <!-- Top Logo Placeholder Space -->
  <g transform="translate(525, 78)">
    <rect x="-85" y="-18" width="170" height="34" rx="6" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="2">KYORIX SPORTS TECH</text>
  </g>

  <!-- Silver Laurel & Medal Header Badge -->
  <g transform="translate(525, 126)">
    <circle cx="0" cy="0" r="18" fill="url(#silverRibbon)"/>
    <circle cx="0" cy="0" r="14" fill="#0A1128"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#E2E8F0">2ND</text>
    <path d="M -24 -2 Q -38 -12 -54 -2 Q -42 12 -28 6" fill="none" stroke="#64748B" stroke-width="2"/>
    <path d="M 24 -2 Q 38 -12 54 -2 Q 42 12 28 6" fill="none" stroke="#64748B" stroke-width="2"/>
  </g>

  <!-- Signatures & Seal -->
  <g transform="translate(240, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">TOURNAMENT DIRECTOR</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">Kyorix Championship Committee</text>
  </g>

  <g transform="translate(525, 626)">
    <circle cx="0" cy="0" r="32" fill="url(#silverRibbon)" stroke="#0A1128" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="28" fill="#F8FAFC" stroke="#64748B" stroke-width="1" stroke-dasharray="3,2"/>
    <text text-anchor="middle" y="-6" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="7" fill="#0A1128" letter-spacing="1">OFFICIAL SEAL</text>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="9" fill="#475569">SILVER</text>
    <text text-anchor="middle" y="14" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="6" fill="#0A1128">AUTHENTICATED</text>
  </g>

  <g transform="translate(810, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">HEAD OF SCRUTINY</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">World Kukkiwon Official Panel</text>
  </g>
</svg>`;

// 3. Bronze Medal Certificate SVG Template
export const BRONZE_TEMPLATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 742" width="1050" height="742">
  <defs>
    <linearGradient id="bronzeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#FFFDF9"/>
      <stop offset="100%" stop-color="#FBF3EB"/>
    </linearGradient>
    <linearGradient id="bronzeRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#92400E"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </linearGradient>
  </defs>

  <rect width="1050" height="742" fill="url(#bronzeBg)"/>

  <rect x="20" y="20" width="1010" height="702" fill="none" stroke="#0A1128" stroke-width="6"/>

  <rect x="34" y="34" width="982" height="674" fill="none" stroke="#B45309" stroke-width="2.5"/>
  <rect x="42" y="42" width="966" height="658" fill="none" stroke="#B45309" stroke-width="1" stroke-dasharray="6,4" opacity="0.7"/>

  <!-- Corner Filigree Ornaments -->
  <path d="M 42 76 L 76 42 M 42 62 L 62 42 M 42 42 L 86 42 M 42 42 L 42 86" stroke="#B45309" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="56" r="3" fill="#B45309"/>
  <path d="M 1008 76 L 974 42 M 1008 62 L 988 42 M 1008 42 L 964 42 M 1008 42 L 1008 86" stroke="#B45309" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="56" r="3" fill="#B45309"/>
  <path d="M 42 666 L 76 700 M 42 680 L 62 700 M 42 700 L 86 700 M 42 700 L 42 656" stroke="#B45309" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="686" r="3" fill="#B45309"/>
  <path d="M 1008 666 L 974 700 M 1008 680 L 988 700 M 1008 700 L 964 700 M 1008 700 L 1008 656" stroke="#B45309" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="686" r="3" fill="#B45309"/>

  <!-- Watermark -->
  <g opacity="0.035" transform="translate(525, 371)">
    <circle r="190" fill="none" stroke="#0A1128" stroke-width="28"/>
    <circle r="150" fill="none" stroke="#B45309" stroke-width="8"/>
    <text text-anchor="middle" y="25" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="#0A1128" letter-spacing="12">KYORIX</text>
  </g>

  <!-- Top Logo Placeholder Space -->
  <g transform="translate(525, 78)">
    <rect x="-85" y="-18" width="170" height="34" rx="6" fill="#0A1128" stroke="#B45309" stroke-width="1.5"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="2">KYORIX SPORTS TECH</text>
  </g>

  <!-- Bronze Laurel & Medal Header Badge -->
  <g transform="translate(525, 126)">
    <circle cx="0" cy="0" r="18" fill="url(#bronzeRibbon)"/>
    <circle cx="0" cy="0" r="14" fill="#0A1128"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#FDE68A">3RD</text>
    <path d="M -24 -2 Q -38 -12 -54 -2 Q -42 12 -28 6" fill="none" stroke="#B45309" stroke-width="2"/>
    <path d="M 24 -2 Q 38 -12 54 -2 Q 42 12 28 6" fill="none" stroke="#B45309" stroke-width="2"/>
  </g>

  <!-- Signatures & Seal -->
  <g transform="translate(240, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">TOURNAMENT DIRECTOR</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">Kyorix Championship Committee</text>
  </g>

  <g transform="translate(525, 626)">
    <circle cx="0" cy="0" r="32" fill="url(#bronzeRibbon)" stroke="#0A1128" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="28" fill="#FBF3EB" stroke="#B45309" stroke-width="1" stroke-dasharray="3,2"/>
    <text text-anchor="middle" y="-6" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="7" fill="#0A1128" letter-spacing="1">OFFICIAL SEAL</text>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="9" fill="#92400E">BRONZE</text>
    <text text-anchor="middle" y="14" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="6" fill="#0A1128">AUTHENTICATED</text>
  </g>

  <g transform="translate(810, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">HEAD OF SCRUTINY</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">World Kukkiwon Official Panel</text>
  </g>
</svg>`;

// 4. Participation Certificate SVG Template (Explicitly NO medal positions)
export const PARTICIPATION_TEMPLATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 742" width="1050" height="742">
  <defs>
    <linearGradient id="partBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#FBFDFF"/>
      <stop offset="100%" stop-color="#F4F8FC"/>
    </linearGradient>
    <linearGradient id="partRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
  </defs>

  <rect width="1050" height="742" fill="url(#partBg)"/>

  <rect x="20" y="20" width="1010" height="702" fill="none" stroke="#0A1128" stroke-width="6"/>

  <!-- Inner Navy & Gold Double Borders -->
  <rect x="34" y="34" width="982" height="674" fill="none" stroke="#1E293B" stroke-width="2"/>
  <rect x="42" y="42" width="966" height="658" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="6,4" opacity="0.6"/>

  <!-- Corner Filigree Ornaments -->
  <path d="M 42 76 L 76 42 M 42 62 L 62 42 M 42 42 L 86 42 M 42 42 L 42 86" stroke="#1E293B" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="56" r="3" fill="#D4AF37"/>
  <path d="M 1008 76 L 974 42 M 1008 62 L 988 42 M 1008 42 L 964 42 M 1008 42 L 1008 86" stroke="#1E293B" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="56" r="3" fill="#D4AF37"/>
  <path d="M 42 666 L 76 700 M 42 680 L 62 700 M 42 700 L 86 700 M 42 700 L 42 656" stroke="#1E293B" stroke-width="2.5" fill="none"/>
  <circle cx="56" cy="686" r="3" fill="#D4AF37"/>
  <path d="M 1008 666 L 974 700 M 1008 680 L 988 700 M 1008 700 L 964 700 M 1008 700 L 1008 656" stroke="#1E293B" stroke-width="2.5" fill="none"/>
  <circle cx="994" cy="686" r="3" fill="#D4AF37"/>

  <!-- Watermark -->
  <g opacity="0.035" transform="translate(525, 371)">
    <circle r="190" fill="none" stroke="#0A1128" stroke-width="28"/>
    <circle r="150" fill="none" stroke="#1E3A8A" stroke-width="8"/>
    <text text-anchor="middle" y="25" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="64" fill="#0A1128" letter-spacing="12">KYORIX</text>
  </g>

  <!-- Top Logo Placeholder Space -->
  <g transform="translate(525, 78)">
    <rect x="-85" y="-18" width="170" height="34" rx="6" fill="#0A1128" stroke="#D4AF37" stroke-width="1.5"/>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="2">KYORIX SPORTS TECH</text>
  </g>

  <!-- Official Participation Shield Badge (NO MEDAL) -->
  <g transform="translate(525, 126)">
    <path d="M -16 -16 L 16 -16 L 16 6 L 0 18 L -16 6 Z" fill="url(#partRibbon)" stroke="#0A1128" stroke-width="1.5"/>
    <path d="M -6 -1 L 0 5 L 8 -5" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -22 -2 Q -36 -12 -50 -2 Q -40 10 -26 6" fill="none" stroke="#1E3A8A" stroke-width="2"/>
    <path d="M 22 -2 Q 36 -12 50 -2 Q 40 10 26 6" fill="none" stroke="#1E3A8A" stroke-width="2"/>
  </g>

  <!-- Signatures & Seal -->
  <g transform="translate(240, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">TOURNAMENT DIRECTOR</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">Kyorix Championship Committee</text>
  </g>

  <g transform="translate(525, 626)">
    <circle cx="0" cy="0" r="32" fill="url(#partRibbon)" stroke="#0A1128" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="28" fill="#FBFDFF" stroke="#1E3A8A" stroke-width="1" stroke-dasharray="3,2"/>
    <text text-anchor="middle" y="-6" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="7" fill="#0A1128" letter-spacing="1">OFFICIAL SEAL</text>
    <text text-anchor="middle" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="8" fill="#1E3A8A">PARTICIPANT</text>
    <text text-anchor="middle" y="14" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="6" fill="#0A1128">AUTHENTICATED</text>
  </g>

  <g transform="translate(810, 640)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#94A3B8" stroke-width="1.5"/>
    <text text-anchor="middle" y="15" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0A1128" letter-spacing="0.5">HEAD OF SCRUTINY</text>
    <text text-anchor="middle" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">World Kukkiwon Official Panel</text>
  </g>
</svg>`;

export const TEMPORARY_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'temp-gold-medal',
    name: 'Kyorix Gold Medalist (Temporary Template)',
    fileName: 'kyorix_temp_gold_template.svg',
    fileType: 'image/png',
    fileSize: 45000,
    dataUrl: createSvgDataUrl(GOLD_TEMPLATE_SVG),
    assignedTypes: ['Gold Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'A4 Landscape championship template with gold filigree borders, laurel wreath emblem, and official signature spaces.',
    isDefault: true,
    orientation: 'landscape',
    aspectRatio: 1.414,
    layoutConfig: {
      ...DEFAULT_TEMPLATE_LAYOUT,
      useCustomLayout: true,
      medalResult: {
        ...DEFAULT_TEMPLATE_LAYOUT.medalResult,
        visible: true,
        color: '#D4AF37',
      },
    },
  },
  {
    id: 'temp-silver-medal',
    name: 'Kyorix Silver Medalist (Temporary Template)',
    fileName: 'kyorix_temp_silver_template.svg',
    fileType: 'image/png',
    fileSize: 44000,
    dataUrl: createSvgDataUrl(SILVER_TEMPLATE_SVG),
    assignedTypes: ['Silver Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'A4 Landscape championship template with metallic silver borders, runner-up medallion, and dual signature zones.',
    isDefault: true,
    orientation: 'landscape',
    aspectRatio: 1.414,
    layoutConfig: {
      ...DEFAULT_TEMPLATE_LAYOUT,
      useCustomLayout: true,
      medalResult: {
        ...DEFAULT_TEMPLATE_LAYOUT.medalResult,
        visible: true,
        color: '#64748B',
      },
    },
  },
  {
    id: 'temp-bronze-medal',
    name: 'Kyorix Bronze Medalist (Temporary Template)',
    fileName: 'kyorix_temp_bronze_template.svg',
    fileType: 'image/png',
    fileSize: 44000,
    dataUrl: createSvgDataUrl(BRONZE_TEMPLATE_SVG),
    assignedTypes: ['Bronze Medal'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'A4 Landscape championship template with warm bronze borders, podium crest, and certified authentication seal.',
    isDefault: true,
    orientation: 'landscape',
    aspectRatio: 1.414,
    layoutConfig: {
      ...DEFAULT_TEMPLATE_LAYOUT,
      useCustomLayout: true,
      medalResult: {
        ...DEFAULT_TEMPLATE_LAYOUT.medalResult,
        visible: true,
        color: '#B45309',
      },
    },
  },
  {
    id: 'temp-participation',
    name: 'Kyorix Participation (Temporary Template)',
    fileName: 'kyorix_temp_participation_template.svg',
    fileType: 'image/png',
    fileSize: 43000,
    dataUrl: createSvgDataUrl(PARTICIPATION_TEMPLATE_SVG),
    assignedTypes: ['Participation'],
    uploadedAt: '2026-03-01T10:00:00Z',
    description: 'A4 Landscape official participation template with navy and gold pinstripes and official participant seal (no medal positions).',
    isDefault: true,
    orientation: 'landscape',
    aspectRatio: 1.414,
    layoutConfig: {
      ...DEFAULT_TEMPLATE_LAYOUT,
      useCustomLayout: true,
      medalResult: {
        ...DEFAULT_TEMPLATE_LAYOUT.medalResult,
        visible: false, // Participation certificates must NOT display medal positions
      },
    },
  },
];
