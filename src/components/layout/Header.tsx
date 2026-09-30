import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/project';
import {
  ShieldAlert,
  Bell,
  Search,
  CheckCircle,
  Building2,
  ChevronDown,
  RefreshCw,
  User,
  Check,
  ExternalLink,
} from 'lucide-react';

const ROLES: UserRole[] = [
  'Ministry Officer',
  'State Nodal Officer',
  'District Authority',
  'Auditor',
  'Monitoring Officer',
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUserRole,
    setCurrentUserRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    lastDataSync,
    lastAiAnalysis,
    systemStatus,
    isRefreshing,
    refreshIntelligence,
    refreshToast,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* National Tricolor Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 opacity-90 shadow-sm" />

      {/* Top operational status & Ministry micro-bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs flex justify-between items-center text-slate-400 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-semibold tracking-wide">
            <span className="text-amber-500 font-bold">GOI</span>
            <span>भारत सरकार</span>
          </div>
          <span className="hidden md:inline text-slate-300 font-medium text-[11px]">
            सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय • Ministry of Statistics and Programme Implementation
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System: {systemStatus}
          </span>
          <span className="hidden xl:inline text-slate-700">|</span>
          <span className="hidden xl:inline text-slate-300 text-[11px]">
            Last Sync: <strong className="text-slate-200">{lastDataSync}</strong>
          </span>
          <span className="hidden 2xl:inline text-slate-700">|</span>
          <span className="hidden 2xl:inline text-slate-300 text-[11px]">
            Last Analysis: <strong className="text-indigo-300">{lastAiAnalysis}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="hidden sm:inline bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono text-[10px]">
            NIC-GovCloud Data Engine • Node Active
          </span>
          <span className="text-slate-300 font-medium">Parliamentary Oversight Console</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Platform Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="text-amber-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>MPLADS Sentinel AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded font-semibold">
                  v2.4
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>National Project Risk, Anomaly &amp; Monitoring Platform</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-emerald-400 font-medium hidden sm:inline">Public Capital Vigilance</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search project ID, district, constituency, project name or implementing agency"
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Right side operational actions */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Intelligence Button */}
          <button
            onClick={refreshIntelligence}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title="Recalculate risk scores and update intelligence indicators"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Intelligence</span>
          </button>

          {/* Role Selector: "Current Role: [Role]" */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 block -mb-0.5">Current Role:</span>
                <span className="font-semibold text-white truncate max-w-[130px] block">{currentUserRole}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-700 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Switch Operational Perspective
                </div>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentUserRole(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/60 transition-colors ${
                      currentUserRole === role
                        ? 'text-amber-400 font-bold bg-slate-700/40'
                        : 'text-slate-300'
                    }`}
                  >
                    <span>{role}</span>
                    {currentUserRole === role && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* In-App Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="relative p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-700">
                  <span className="text-xs font-bold text-white">System Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.projectId) navigate(`/projects/${notif.projectId}`);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition-colors space-y-0.5 ${
                        notif.isRead ? 'bg-slate-800/40 text-slate-400' : 'bg-slate-700/60 text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-100">{notif.title}</span>
                        <span className="text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-700 text-center">
                  <button
                    onClick={() => {
                      navigate('/alerts');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    View All Priority Alerts →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 flex items-center justify-center font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-slate-200 block text-[11px] leading-tight">Gov Officer</span>
              <span className="text-[10px] text-slate-400 leading-tight">NIC-8821</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Alert for Intelligence Refresh */}
      {refreshToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{refreshToast}</span>
        </div>
      )}
    </header>
  );
};
