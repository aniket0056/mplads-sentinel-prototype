import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Project } from '../../types/project';
import { useNavigate } from 'react-router-dom';

interface Props {
  projects: Project[];
}

export const ExpenditureProgressScatter: React.FC<Props> = ({ projects }) => {
  const navigate = useNavigate();

  const data = projects.map((p) => ({
    id: p.id,
    title: p.title,
    progress: p.physicalProgressPercentage,
    expenditure: p.expenditurePercentage,
    riskScore: p.riskScore,
    tier: p.riskTier,
    color:
      p.riskTier === 'Critical'
        ? '#ef4444'
        : p.riskTier === 'High'
        ? '#f97316'
        : p.riskTier === 'Medium'
        ? '#eab308'
        : '#10b981',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs text-slate-100 max-w-xs">
          <p className="font-mono font-bold text-amber-400">{item.id}</p>
          <p className="text-[11px] text-slate-300 line-clamp-1">{item.title}</p>
          <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
            <div>
              <span className="text-slate-400">Expenditure: </span>
              <span className="font-bold text-slate-100">{item.expenditure}%</span>
            </div>
            <div>
              <span className="text-slate-400">Ground Progress: </span>
              <span className="font-bold text-slate-100">{item.progress}%</span>
            </div>
            <div>
              <span className="text-slate-400">Risk Score: </span>
              <span className="font-bold text-red-400">{item.riskScore}</span>
            </div>
            <div>
              <span className="text-slate-400">Tier: </span>
              <span className="font-bold text-amber-400">{item.tier}</span>
            </div>
          </div>
          <p className="mt-1 text-[10px] text-indigo-400">Click point to view project</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis
            type="number"
            dataKey="progress"
            name="Physical Progress"
            unit="%"
            domain={[0, 100]}
            stroke="#94a3b8"
            fontSize={11}
            label={{ value: 'Verified Physical Ground Progress (%)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="expenditure"
            name="Expenditure"
            unit="%"
            domain={[0, 110]}
            stroke="#94a3b8"
            fontSize={11}
            label={{ value: 'Fund Expenditure (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
          />
          <ZAxis range={[60, 200]} />
          <Tooltip content={<CustomTooltip />} />
          {/* Ideal parity line: where physical progress matches expenditure */}
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
            stroke="#6366f1"
            strokeDasharray="4 4"
            label={{ value: 'Ideal Parity (Progress = Spend)', fill: '#818cf8', fontSize: 10, position: 'top' }}
          />
          {/* Danger zone threshold */}
          <ReferenceLine
            y={80}
            stroke="#ef4444"
            strokeDasharray="2 2"
            opacity={0.4}
          />
          <Scatter
            name="Projects"
            data={data}
            onClick={(node) => navigate(`/projects/${node.id}`)}
            className="cursor-pointer"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
