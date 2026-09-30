import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { calculateProjectRisk } from '../services/riskEngine';
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  Calculator,
  ArrowRight,
  HelpCircle,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const RiskMonitor: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useApp();

  // Interactive Risk Simulator state
  const [simSpendGap, setSimSpendGap] = useState<number>(40); // 40% gap like in 1021
  const [simDelayDays, setSimDelayDays] = useState<number>(189);
  const [simCostRatio, setSimCostRatio] = useState<number>(92);
  const [simDuplicate, setSimDuplicate] = useState<number>(86);
  const [simHasUC, setSimHasUC] = useState<boolean>(false);
  const [simGeoAnomaly, setSimGeoAnomaly] = useState<boolean>(true);

  // Compute simulated result using the exact formula engine
  const simResult = calculateProjectRisk({
    sanctionedAmountLakhs: 75.0,
    expenditureAmountLakhs: (75.0 * simCostRatio) / 100,
    expenditurePercentage: simCostRatio,
    physicalProgressPercentage: Math.max(0, simCostRatio - simSpendGap),
    delayDays: simDelayDays,
    utilizationCertificateSubmitted: simHasUC,
    geoTaggedPhotosCount: simHasUC ? 8 : 1,
    duplicateSimilarityPercentage: simDuplicate,
    location: { geoAnomalyFlag: simGeoAnomaly } as any,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Explainable AI (XAI) Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multi-Dimensional AI Risk Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mathematical risk decomposition across 6 orthogonal vectors to detect project distress, physical verification gaps, and procurement irregularities.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px]">Algorithm Standard:</span>
          <span className="font-mono font-bold text-amber-400">CAG & MoSPI Norms 2026</span>
        </div>
      </div>

      {/* Formula Card & Mathematical Weights */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Statutory Multi-Factor Risk Formula</span>
        </h3>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          <div className="text-amber-400 font-bold mb-2">
            Risk Score = 0.30*(Financial Anomaly) + 0.20*(Delay Risk) + 0.20*(Cost Overrun) + 0.15*(Duplicate Similarity) + 0.10*(Doc Anomaly) + 0.05*(Geo Anomaly)
          </div>
          <div className="text-slate-400 text-[11px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            <div>• <strong className="text-slate-300">30% Financial:</strong> Fund disbursement vs verified physical ground progress gap</div>
            <div>• <strong className="text-slate-300">20% Delay:</strong> Overrun days relative to scheduled delivery target</div>
            <div>• <strong className="text-slate-300">20% Cost Overrun:</strong> Fund exhaustion without matching completion</div>
            <div>• <strong className="text-slate-300">15% Duplicate:</strong> Jaccard title token + Haversine distance (&lt;500m)</div>
            <div>• <strong className="text-slate-300">10% Documentation:</strong> Form GFR-12A UC & e-Sakshi photo compliance</div>
            <div>• <strong className="text-slate-300">5% Geo Anomaly:</strong> GPS bounding box & terrain reservation validity</div>
          </div>
        </div>
      </div>

      {/* Interactive Risk Simulator */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/50 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Interactive Risk Simulator & Stress-Testing Sandbox</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust project metrics to observe real-time recalculation of the composite risk score and tier.
            </p>
          </div>
          <button
            onClick={() => {
              setSimSpendGap(40);
              setSimDelayDays(189);
              setSimCostRatio(92);
              setSimDuplicate(86);
              setSimHasUC(false);
              setSimGeoAnomaly(true);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Reset to MPL-2026-1021 Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sliders (8 Cols) */}
          <div className="lg:col-span-8 space-y-4 text-xs">
            {/* Slider 1: Spend vs Progress Disconnect Gap */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Disbursement vs Physical Progress Gap (%):</span>
                <span className="font-mono font-bold text-red-400">{simSpendGap}% Delta</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                value={simSpendGap}
                onChange={(e) => setSimSpendGap(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Delay in Days */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Execution Overrun (Days):</span>
                <span className="font-mono font-bold text-amber-400">+{simDelayDays} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={simDelayDays}
                onChange={(e) => setSimDelayDays(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Budget Drawn % */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Cumulative Fund Expenditure (%):</span>
                <span className="font-mono font-bold text-blue-400">{simCostRatio}% Spent</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={simCostRatio}
                onChange={(e) => setSimCostRatio(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Duplicate Similarity */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Duplicate Proximity & Scope Similarity (%):</span>
                <span className="font-mono font-bold text-red-400">{simDuplicate}% Match</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simDuplicate}
                onChange={(e) => setSimDuplicate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={simHasUC}
                  onChange={(e) => setSimHasUC(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Form GFR-12A UC Submitted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={simGeoAnomaly}
                  onChange={(e) => setSimGeoAnomaly(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Geotag Boundary Out-of-Bounds Flag</span>
              </label>
            </div>
          </div>

          {/* Result Dial Output (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Simulated Risk Score
            </span>
            <div className="text-5xl font-black text-red-500">
              {simResult.riskScore}
              <span className="text-base font-normal text-slate-500"> /100</span>
            </div>
            <RiskBadge tier={simResult.riskTier} size="md" />

            <div className="w-full space-y-1 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Fin Disconnect (30%):</span>
                <span className="font-mono text-slate-200">{simResult.breakdown.financialAnomaly}</span>
              </div>
              <div className="flex justify-between">
                <span>Delay Risk (20%):</span>
                <span className="font-mono text-slate-200">{simResult.breakdown.delayRisk}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost Overrun (20%):</span>
                <span className="font-mono text-slate-200">{simResult.breakdown.costOverrun}</span>
              </div>
              <div className="flex justify-between">
                <span>Duplicate Match (15%):</span>
                <span className="font-mono text-slate-200">{simResult.breakdown.duplicateSimilarity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Project Risk Registry */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white">
          Active Projects Ranked by AI Risk Score
        </h3>

        <div className="space-y-2">
          {projects
            .slice()
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((p, idx) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className={`p-3 bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  p.id === 'MPL-2026-1021' ? 'ring-1 ring-red-500/50 bg-red-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-xs w-6">#{idx + 1}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs">{p.id}</span>
                      <span className="text-xs font-semibold text-slate-200 line-clamp-1">{p.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {p.district}, {p.state} • {p.category} • MP: {p.mpName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Spend vs Progress:</span>
                    <span className="font-bold text-slate-200">
                      {p.expenditurePercentage}% exp / {p.physicalProgressPercentage}% prog
                    </span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-slate-400 block text-[10px]">Delay:</span>
                    <span className={p.delayDays > 100 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                      +{p.delayDays}d
                    </span>
                  </div>

                  <div className="min-w-[110px] text-right">
                    <RiskBadge tier={p.riskTier} score={p.riskScore} size="sm" />
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
