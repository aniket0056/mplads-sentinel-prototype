import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/project';
import {
  ShieldAlert,
  Lock,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
  Check,
  ShieldCheck,
} from 'lucide-react';

const ROLES: { role: UserRole; desc: string; access: string }[] = [
  {
    role: 'Ministry Officer',
    desc: 'National oversight, policy threshold management, and inter-state analytics.',
    access: 'National Oversight & Policy Controls',
  },
  {
    role: 'State Nodal Officer',
    desc: 'State-wide progress monitoring, inter-district duplication analysis, and nodal reviews.',
    access: 'State Directory & District Review',
  },
  {
    role: 'District Authority',
    desc: 'Ground verification, sanction approval, payment tranche review, and field inspections.',
    access: 'District Level Action & Direct Tranche Review',
  },
  {
    role: 'Auditor',
    desc: 'Forensic audits, statutory compliance dossiers, and verification reports.',
    access: 'Audit Tools & Immutable Event Trail',
  },
  {
    role: 'Monitoring Officer',
    desc: 'Ongoing milestone execution tracking, delay alerts, and progress reports.',
    access: 'Milestone Tracking & Execution Surveillance',
  },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUserRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Ministry Officer');
  const [govId, setGovId] = useState('officer@nic.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Gov Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px] border border-slate-700">
            IN
          </div>
          <span className="font-semibold text-slate-300">
            Government of India | Ministry of Statistics and Programme Implementation (MoSPI)
          </span>
        </div>
        <div className="text-slate-400 font-medium">
          MPLADS Scheme Implementation & Risk Intelligence
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Description Column */}
          <div className="md:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>National Project Monitoring & Risk Intelligence Platform</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                MPLADS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-amber-400">Sentinel AI</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Autonomous multi-dimensional surveillance architecture safeguarding public capital under the Members of Parliament Local Area Development Scheme.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Explainable AI Risk Engine</h4>
                  <p className="text-[11px] text-slate-400">
                    Transparent formula evaluating financial progress mismatch, delay risk, cost variance, duplicate project similarity, and documentation quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Duplicate Work Radar</h4>
                  <p className="text-[11px] text-slate-400">
                    Cross-references textual title tokens and geospatial coordinates to detect potential overlapping works across local and central schemes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Administrative Decision Support</h4>
                  <p className="text-[11px] text-slate-400">
                    Provides District Authorities and State Nodal Officers with direct action workflows, inquiry assignment, and tranche management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Box */}
          <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <span>Authorized Portal Sign In</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your official credentials and select your authorized role.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assigned Operational Role
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {ROLES.map(({ role, desc }) => (
                    <div
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        selectedRole === role
                          ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="mt-0.5">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedRole === role
                              ? 'border-indigo-400 bg-indigo-600'
                              : 'border-slate-600'
                          }`}
                        >
                          {selectedRole === role && <Check className="w-2 h-2 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-200">{role}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gov ID */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Official Email / User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Security Passcode / Token
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Sign In to Monitoring Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-3 text-center text-xs text-slate-500">
        <div>
          Authorized Access Only • Ministry of Statistics and Programme Implementation (MoSPI) • Government of India
        </div>
      </footer>
    </div>
  );
};
