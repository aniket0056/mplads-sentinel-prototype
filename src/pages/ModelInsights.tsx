import React from 'react';
import {
  BrainCircuit,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Sliders,
  Database,
} from 'lucide-react';

export const ModelInsights: React.FC = () => {
  const currentIndicators = [
    { indicator: 'Financial Progress Mismatch', weight: '30%', method: 'Variance rule + statistical outlier analysis', status: 'Calculated Live' },
    { indicator: 'Milestone Execution Delay Risk', weight: '20%', method: 'Historical duration baseline + regression heuristics', status: 'Calculated Live' },
    { indicator: 'Cost Overrun & Budget Exhaustion', weight: '20%', method: 'Financial draw vs completion ratio scoring', status: 'Calculated Live' },
    { indicator: 'Duplicate Project Similarity', weight: '15%', method: 'Jaccard token text match + Haversine geospatial proximity', status: 'Calculated Live' },
    { indicator: 'Documentation & Form GFR-12A Quality', weight: '10%', method: 'Mandatory statutory certificate presence rules', status: 'Calculated Live' },
    { indicator: 'Geospatial Validity & Boundary Check', weight: '5%', method: 'Constituency polygon bounding box verification', status: 'Calculated Live' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            Explainable AI (XAI) Model Architecture
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Model Insights & Risk Methodology
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete methodological transparency on risk factors, algorithmic indicators, statistical anomaly detection, and machine learning pipeline architecture.
        </p>
      </div>

      {/* Actual Calculated Indicators Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Active Composite Risk Indicators</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live calculated components determining the project-level risk score across all 42 monitored public works.
            </p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
            6-Factor Composite Model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                <th className="py-2.5 px-3">Risk Factor Indicator</th>
                <th className="py-2.5 px-3">Statutory Weight</th>
                <th className="py-2.5 px-3">Analytical Methodology</th>
                <th className="py-2.5 px-3 text-right">Engine Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {currentIndicators.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{item.indicator}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{item.weight}</td>
                  <td className="py-2.5 px-3 text-slate-300">{item.method}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Separation: Working System vs Future ML Production Capability */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Multi-Stage Analytical Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              MODULE 1: FINANCIAL INTEGRITY
            </span>
            <h4 className="text-sm font-bold text-white">
              Financial Anomaly & Disbursement Velocity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Current Implementation:</strong> Rule-based and statistical variance analysis detecting front-loaded payments where disbursement decouples from verified physical progress.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-800/60">
              <strong>Production Capability:</strong> Integrated with Isolation Forest multidimensional feature embeddings for automatic detection of late-quarter March Rush anomalies.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              MODULE 2: DUPLICATION DETECTION
            </span>
            <h4 className="text-sm font-bold text-white">
              Textual & Geospatial Proximity Similarity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Current Implementation:</strong> Jaccard tokenization for project descriptions combined with Haversine great-circle distance calculations for assets within 500m.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-800/60">
              <strong>Production Capability:</strong> Bipartite entity resolution graphs linking contractor tax identifiers across PMGSY, State PWD, and municipal project databases.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="font-mono text-xs font-bold text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              MODULE 3: TIMELINE OVERRUNS
            </span>
            <h4 className="text-sm font-bold text-white">
              Delay Monitoring & Forecast Regressors
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Current Implementation:</strong> Benchmark sectoral milestone schedules comparing actual completion dates with approved sanction timelines.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-800/60">
              <strong>Production Capability:</strong> Gradient boosted regression and survival analysis models predicting slippage based on implementing agency friction scores.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              MODULE 4: SPATIAL VALIDATION
            </span>
            <h4 className="text-sm font-bold text-white">
              Geospatial Bounding & e-Sakshi Photo Audit
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Current Implementation:</strong> Verification of GPS latitude and longitude against Survey of India constituency bounding boxes and terrain layers.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-800/60">
              <strong>Production Capability:</strong> EXIF metadata verification with convolutional computer vision models validating ground construction phases from mobile uploads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
