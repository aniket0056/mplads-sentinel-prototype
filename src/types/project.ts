export type ProjectCategory =
  | 'Roads & Bridges'
  | 'Drinking Water'
  | 'Education & Schools'
  | 'Healthcare & Sanitation'
  | 'Community Infrastructure'
  | 'Solar & Renewable'
  | 'Irrigation & Flood Control'
  | 'Skill & Youth Center';

export type RiskTier = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProjectStatus = 'In Progress' | 'Delayed' | 'Critical Review' | 'Completed' | 'Suspended';

export type UserRole =
  | 'Ministry Officer'
  | 'State Nodal Officer'
  | 'District Authority'
  | 'Auditor'
  | 'Monitoring Officer';

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: 'Completed' | 'Delayed' | 'Pending';
  financialDisbursedLakhs: number;
  physicalTargetPct: number;
}

export interface AnomalyItem {
  id: string;
  type: 'Financial Disconnect' | 'Velocity Spike' | 'Vendor Clustering' | 'Missing Milestone' | 'Verification Risk' | 'Ghost Asset Risk' | 'Geo Out-of-Bounds';
  severity: 'Critical' | 'High' | 'Medium';
  description: string;
  detectedAt: string;
  metricComparison: string;
  flaggedByModel: string;
}

export interface DuplicateMatch {
  matchedProjectId: string;
  matchedProjectTitle: string;
  matchedSanctionAmountLakhs: number;
  matchedAgency: string;
  similarityScore: number; // 0-100%
  breakdown: {
    titleSimilarity: number;
    geoProximityMeters: number;
    geoSimilarity: number;
    costSimilarity: number;
    descriptionSimilarity: number;
  };
  reason: string;
  status: 'Potential Duplicate — Review Required' | 'Under Review' | 'Resolved / Legitimate' | 'Confirmed Irregularity';
}

export interface ExplainableFactor {
  factor: string;
  weightPct: number; // e.g. 30 for 30%
  score: number; // 0 - 100
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

export interface ProjectLocation {
  lat: number;
  lng: number;
  address: string;
  district: string;
  state: string;
  geoAnomalyFlag: boolean;
  geoAnomalyReason?: string;
}

export interface Project {
  id: string; // e.g. "MPL-2026-1021"
  title: string;
  description: string;
  category: ProjectCategory;
  mpName: string;
  constituency: string;
  state: string;
  district: string;
  financialYear: string;
  sanctionedAmountLakhs: number;
  releasedAmountLakhs: number;
  expenditureAmountLakhs: number;
  expenditurePercentage: number; // e.g. 92
  physicalProgressPercentage: number; // e.g. 52
  sanctionDate: string;
  targetCompletionDate: string;
  forecastCompletionDate: string;
  delayDays: number; // e.g. 189
  status: ProjectStatus;
  riskScore: number; // e.g. 91 (0-100)
  riskTier: RiskTier;
  riskBreakdown: {
    financialAnomaly: number; // 30% weight
    delayRisk: number; // 20% weight
    costOverrun: number; // 20% weight
    duplicateSimilarity: number; // 15% weight
    documentationAnomaly: number; // 10% weight
    geoAnomaly: number; // 5% weight
  };
  explainableFactors: ExplainableFactor[];
  anomalies: AnomalyItem[];
  duplicateMatch?: DuplicateMatch;
  location: ProjectLocation;
  implementingAgency: string;
  contractorName: string;
  vendorPanMasked: string;
  milestones: Milestone[];
  auditHistory: {
    date: string;
    action: string;
    actor: string;
    note: string;
  }[];
  utilizationCertificateSubmitted: boolean;
  geoTaggedPhotosCount: number;
  lastPhysicalInspectionDate: string;
  assignedInvestigator?: string;
}

export interface AlertNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  constituency: string;
  state: string;
  district: string;
  type: 'Financial Disconnect' | 'Severe Delay' | 'Duplicate Work Detected' | 'Vendor Clustering' | 'Geo Anomaly';
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  status: 'New' | 'Acknowledged' | 'Under Review' | 'Assigned' | 'Resolved' | 'Escalated';
  assignedTo?: string;
  actionTakenNotes?: string;
}

export interface ReviewCase {
  id: string; // e.g. "CASE-2026-081"
  projectId: string;
  projectTitle: string;
  riskCategory: string;
  assignedOfficer: string;
  priority: 'Critical' | 'High' | 'Medium';
  createdDate: string;
  status: 'New' | 'Acknowledged' | 'Under Review' | 'Assigned' | 'Inspection' | 'Resolved' | 'Escalated';
  notes: string;
  evidence: string;
  reviewHistory: {
    date: string;
    action: string;
    actor: string;
    note: string;
  }[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  projectId?: string;
  timestamp: string;
  type: 'alert' | 'case' | 'sync' | 'action';
  isRead: boolean;
}

export interface FilterState {
  state: string;
  district: string;
  category: string;
  financialYear: string;
  riskTier: string;
  searchQuery: string;
  status: string;
  sortBy: 'riskScore' | 'delayDays' | 'expenditure' | 'amount' | 'progress';
  sortOrder: 'asc' | 'desc';
}
