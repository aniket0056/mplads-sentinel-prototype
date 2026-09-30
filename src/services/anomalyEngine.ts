import { Project, AnomalyItem } from '../types/project';

export interface AnomalyCluster {
  id: string;
  title: string;
  category: 'Financial' | 'Execution' | 'Procurement' | 'Geospatial';
  severity: 'Critical' | 'High' | 'Medium';
  affectedProjectsCount: number;
  totalAtRiskAmountLakhs: number;
  description: string;
  remedyAction: string;
}

export function scanProjectAnomalies(project: Project): AnomalyItem[] {
  const anomalies: AnomalyItem[] = [];

  // 1. Financial Disconnect: Expenditure far exceeds physical progress
  if (project.expenditurePercentage - project.physicalProgressPercentage > 25) {
    anomalies.push({
      id: `ANOM-${project.id}-FIN-01`,
      type: 'Financial Disconnect',
      severity: 'Critical',
      description: `Disbursement is ${project.expenditurePercentage}% but verified ground progress is only ${project.physicalProgressPercentage}%. Difference is ${project.expenditurePercentage - project.physicalProgressPercentage}%.`,
      metricComparison: `Expenditure: ₹${project.expenditureAmountLakhs.toFixed(1)}L (${project.expenditurePercentage}%) vs Ground Progress: ${project.physicalProgressPercentage}%`,
      flaggedByModel: 'Isolation Forest (Financial Disconnect Detector v2.4)',
      detectedAt: '2026-09-18',
    });
  }

  // 2. Severe Delay
  if (project.delayDays > 120) {
    anomalies.push({
      id: `ANOM-${project.id}-DLY-02`,
      type: 'Missing Milestone',
      severity: project.delayDays > 180 ? 'Critical' : 'High',
      description: `Project is delayed by ${project.delayDays} days beyond scheduled target completion date of ${project.targetCompletionDate}.`,
      metricComparison: `Delayed: ${project.delayDays} days | Forecast Completion: ${project.forecastCompletionDate}`,
      flaggedByModel: 'Survival Analysis & Delay Regression Model',
      detectedAt: '2026-09-20',
    });
  }

  // 3. Ghost Asset / Verification Risk
  if (project.physicalProgressPercentage >= 70 && project.geoTaggedPhotosCount < 2) {
    anomalies.push({
      id: `ANOM-${project.id}-DOC-03`,
      type: 'Ghost Asset Risk',
      severity: 'High',
      description: `Project claims ${project.physicalProgressPercentage}% completion but has only ${project.geoTaggedPhotosCount} geo-tagged photos uploaded on e-Sakshi portal.`,
      metricComparison: `Photos: ${project.geoTaggedPhotosCount} / minimum 5 required for milestone stage`,
      flaggedByModel: 'Computer Vision & Media Compliance Auditor',
      detectedAt: '2026-09-22',
    });
  }

  // 4. Geospatial Out-of-Bounds
  if (project.location.geoAnomalyFlag) {
    anomalies.push({
      id: `ANOM-${project.id}-GEO-04`,
      type: 'Geo Out-of-Bounds',
      severity: 'High',
      description: project.location.geoAnomalyReason || 'Geo-coordinates fall outside authorized constituency bounding box or in water body.',
      metricComparison: `Coordinates: [${project.location.lat.toFixed(4)}, ${project.location.lng.toFixed(4)}]`,
      flaggedByModel: 'Geospatial GIS Polygon Validator (Survey of India)',
      detectedAt: '2026-09-15',
    });
  }

  // 5. Vendor Concentration / Velocity
  if (project.contractorName.includes('Syndicate') || project.contractorName.includes('Buildcon') && project.riskScore > 70) {
    anomalies.push({
      id: `ANOM-${project.id}-VEN-05`,
      type: 'Vendor Clustering',
      severity: 'Medium',
      description: `Vendor '${project.contractorName}' holds 42% of all active works in ${project.district} district. High concentration risk detected.`,
      metricComparison: `Vendor Share: 42% of district works | Active Tenders: 7`,
      flaggedByModel: 'Procurement Collusion & Bidding Network Analyzer',
      detectedAt: '2026-09-24',
    });
  }

  return anomalies;
}

export const SYSTEM_ANOMALY_CLUSTERS: AnomalyCluster[] = [
  {
    id: 'CLUSTER-FIN-01',
    title: 'March Rush & Accelerated Fund Depletion',
    category: 'Financial',
    severity: 'Critical',
    affectedProjectsCount: 9,
    totalAtRiskAmountLakhs: 412.5,
    description: 'Sudden release of 60%+ sanctioned funds in final 3 weeks of fiscal year without matching intermediate inspection certificates.',
    remedyAction: 'Freeze subsequent tranche releases and order special audit by District Vigilance Officer.',
  },
  {
    id: 'CLUSTER-GEO-02',
    title: 'Duplicate Road & Paver Block Works',
    category: 'Geospatial',
    severity: 'Critical',
    affectedProjectsCount: 6,
    totalAtRiskAmountLakhs: 285.0,
    description: 'Road resurfacing and community drainage works overlapping within 350 meters of previously sanctioned state PWD projects.',
    remedyAction: 'Cross-verify against PMGSY and State Road registry using geo-coordinates.',
  },
  {
    id: 'CLUSTER-EXE-03',
    title: 'Chronic Implementation Paralysis (>180 Days)',
    category: 'Execution',
    severity: 'High',
    affectedProjectsCount: 14,
    totalAtRiskAmountLakhs: 648.2,
    description: 'Executing agencies failing to achieve foundation stage milestones despite 50%+ fund advance.',
    remedyAction: 'Issue formal notice to executing agency (PRWD/CPWD) and consider re-tendering.',
  },
  {
    id: 'CLUSTER-DOC-04',
    title: 'Missing Utilization Certificates (Form GFR-12A)',
    category: 'Procurement',
    severity: 'Medium',
    affectedProjectsCount: 18,
    totalAtRiskAmountLakhs: 520.0,
    description: 'Projects completed over 90 days ago without final audited UC and physical completion certificate.',
    remedyAction: 'Mandate digital submission on DigiGov portal within 15 calendar days.',
  },
];
