import React from 'react';
import { NavigationTab } from '@/types';
import { KyorixLogo } from './KyorixLogo';
import {
  LayoutDashboard,
  Award,
  FileSpreadsheet,
  Layers,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: NavigationTab;
    label: string;
    subtext: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtext: 'Overview & Analytics',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'generate',
      label: 'Single Certificate',
      subtext: 'Individual Athlete Entry',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'bulk',
      label: 'Bulk Generation',
      subtext: 'Excel / CSV & ZIP Export',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: 'templates',
      label: 'Manage Templates',
      subtext: 'PNG, JPG, PDF Blanks',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'history',
      label: 'Certificate History',
      subtext: 'Issuance Audit Trail',
      icon: <History className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#060B18] border-r border-[#192545] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-[#192545]">
            <KyorixLogo size="md" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                Kyorix Engine
              </span>
              <span className="text-[10px] text-slate-400 font-mono">v1.4.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-3 block mb-2">
              Operations Center
            </span>
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 to-transparent border-l-4 border-amber-400 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-lg transition ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs">{item.label}</p>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{item.subtext}</p>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Footer & Security Status */}
        <div className="p-4 border-t border-[#192545]">
          <div className="bg-[#0B132B] p-3.5 rounded-xl border border-[#1E2C52]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Kukkiwon Verified</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Compliant with World Taekwondo tournament accreditation & bulk issuance standards.
            </p>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[10px] text-slate-400">
              &copy; {new Date().getFullYear()} Kyorix Sports Technology
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
