import React from 'react';
import { NavigationTab } from '@/types';
import { Menu, Award, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileSidebar: () => void;
  onQuickGenerate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onQuickGenerate,
}) => {
  const getTabInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Administrator Dashboard',
          subtitle: 'Kyorix Sports Technology Certificate Management Hub',
        };
      case 'generate':
        return {
          title: 'Generate Single Certificate',
          subtitle: 'Enter individual competitor credentials and generate downloadable high-res PDF awards',
        };
      case 'bulk':
        return {
          title: 'Bulk Certificate Generation & Excel Import',
          subtitle: 'Upload tournament rosters (.xlsx, .xls, .csv), validate records, and batch export ZIP packages',
        };
      case 'templates':
        return {
          title: 'Manage Certificate Templates',
          subtitle: 'Upload, inspect, and calibrate PNG, JPG, or PDF blanks to tournament categories',
        };
      case 'history':
        return {
          title: 'Certificate Issuance History',
          subtitle: 'Audit log of certified athletes and previously generated documents',
        };
      default:
        return {
          title: 'Certificate Management Platform',
          subtitle: 'Kyorix Sports Technology Official System',
        };
    }
  };

  const info = getTabInfo();

  return (
    <header className="sticky top-0 z-30 bg-[#060B18]/90 backdrop-blur-md border-b border-[#192545] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-[#0F1A3A] text-slate-300 hover:text-white border border-[#1E2C52]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{info.title}</span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">{info.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0B132B] px-3 py-1.5 rounded-lg border border-[#1E2C52]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>

        {currentTab !== 'generate' && currentTab !== 'bulk' && (
          <button
            onClick={onQuickGenerate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Certificate</span>
            <span className="sm:hidden">Generate</span>
          </button>
        )}
      </div>
    </header>
  );
};
