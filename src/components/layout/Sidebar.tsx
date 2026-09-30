import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  Zap,
  TrendingDown,
  Clock,
  Copy,
  MapPin,
  BellRing,
  FileText,
  UploadCloud,
  BrainCircuit,
  History,
  Settings,
  ChevronRight,
  LogOut,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { alerts, displayedProjects } = useApp();
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'Critical' && a.status !== 'Resolved').length;

  const navigationSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Core Surveillance',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'MPLADS Projects', path: '/projects', icon: FolderKanban, badge: `${displayedProjects.length} Works` },
        { name: 'AI Risk Monitor', path: '/risk-monitor', icon: ShieldAlert, badge: 'XAI' },
      ],
    },
    {
      title: 'Intelligence Modules',
      items: [
        { name: 'Anomaly Detection', path: '/anomalies', icon: Zap },
        { name: 'Financial Analytics', path: '/financial', icon: TrendingDown },
        { name: 'Delay Monitoring', path: '/delays', icon: Clock },
        { name: 'Duplicate Detection', path: '/duplicate-detection', icon: Copy, badge: '4 Pairs', badgeColor: 'bg-amber-900/60 text-amber-300' },
        { name: 'Geo Intelligence', path: '/geo-intelligence', icon: MapPin },
      ],
    },
    {
      title: 'Operations & Governance',
      items: [
        {
          name: 'Alert Centre',
          path: '/alerts',
          icon: BellRing,
          badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Critical` : undefined,
          badgeColor: 'bg-red-600 text-white',
        },
        { name: 'Reports & Audits', path: '/reports', icon: FileText },
        { name: 'Data Ingestion', path: '/data-upload', icon: UploadCloud },
        { name: 'Model Insights', path: '/model-insights', icon: BrainCircuit },
        { name: 'Audit Trail', path: '/audit-trail', icon: History },
      ],
    },
    {
      title: 'Administration',
      items: [
        { name: 'System Configuration', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </h3>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className="w-4 h-4 shrink-0 transition-colors text-slate-400 group-hover:text-slate-200"
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5">
              <Building className="w-3 h-3 text-indigo-400" />
              National Surveillance
            </span>
            <span className="text-[10px] text-slate-400">v2.4.0</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            MoSPI Compliance Standards • Form GFR-12A
          </p>
          <NavLink
            to="/login"
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Switch Session / Logout
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
