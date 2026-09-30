import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Project } from '../../types/project';

interface Props {
  projects: Project[];
}

export const RiskDistributionChart: React.FC<Props> = ({ projects }) => {
  const counts = {
    Critical: projects.filter((p) => p.riskTier === 'Critical').length,
    High: projects.filter((p) => p.riskTier === 'High').length,
    Medium: projects.filter((p) => p.riskTier === 'Medium').length,
    Low: projects.filter((p) => p.riskTier === 'Low').length,
  };

  const data = [
    { name: 'Critical Risk (>=75)', value: counts.Critical, color: '#ef4444' },
    { name: 'High Risk (55-74)', value: counts.High, color: '#f97316' },
    { name: 'Medium Risk (35-54)', value: counts.Medium, color: '#eab308' },
    { name: 'Low Risk (<35)', value: counts.Low, color: '#10b981' },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
