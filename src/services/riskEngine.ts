import { Project, RiskTier, ExplainableFactor } from '../types/project';

/**
 * MPLADS Sentinel AI - Multidimensional Risk Scoring Engine
 * Formula:
 * Risk Score = 0.30 * Financial Anomaly
 *            + 0.20 * Delay Risk
 *            + 0.20 * Cost Overrun
 *            + 0.15 * Duplicate Similarity
 *            + 0.10 * Documentation Anomaly
 *            + 0.05 * Geo Anomaly
 */

export interface RiskCalculationResult {
  riskScore: number;
  riskTier: RiskTier;
  breakdown: {
    financialAnomaly: number;
    delayRisk: number;
    costOverrun: number;
    duplicateSimilarity: number;
    documentationAnomaly: number;
    geoAnomaly: number;
  };
  explainableFactors: ExplainableFactor[];
}

export function calculateProjectRisk(
  p: Partial<Project> & {
    sanctionedAmountLakhs: number;
    expenditureAmountLakhs: number;
    expenditurePercentage: number;
    physicalProgressPercentage: number;
    delayDays: number;
    utilizationCertificateSubmitted?: boolean;
    geoTaggedPhotosCount?: number;
    duplicateSimilarityPercentage?: number;
    location?: { geoAnomalyFlag: boolean };
  }
): RiskCalculationResult {
  // 1. Financial Anomaly Score (0 - 100)
  // Higher discrepancy between fund release/spent and physical progress
  const spendVsPhysicalGap = Math.max(0, p.expenditurePercentage - p.physicalProgressPercentage);
  let financialAnomaly = 0;
  if (spendVsPhysicalGap > 35) {
    // Severe front-loading or ghost billing
    financialAnomaly = Math.min(100, 75 + (spendVsPhysicalGap - 35) * 1.5);
  } else if (spendVsPhysicalGap > 20) {
    financialAnomaly = Math.min(75, 50 + (spendVsPhysicalGap - 20) * 1.6);
  } else if (spendVsPhysicalGap > 10) {
    financialAnomaly = Math.min(50, 25 + spendVsPhysicalGap * 1.5);
  } else {
    financialAnomaly = Math.max(10, spendVsPhysicalGap * 1.2);
  }

  // 2. Delay Risk Score (0 - 100)
  let delayRisk = 0;
  if (p.delayDays > 180) {
    delayRisk = Math.min(100, 80 + (p.delayDays - 180) * 0.15);
  } else if (p.delayDays > 90) {
    delayRisk = Math.min(80, 55 + (p.delayDays - 90) * 0.27);
  } else if (p.delayDays > 30) {
    delayRisk = Math.min(55, 30 + (p.delayDays - 30) * 0.4);
  } else if (p.delayDays > 0) {
    delayRisk = Math.max(10, p.delayDays * 0.8);
  } else {
    delayRisk = 5;
  }

  // 3. Cost Overrun Score (0 - 100)
  const costRatio = p.sanctionedAmountLakhs > 0 ? (p.expenditureAmountLakhs / p.sanctionedAmountLakhs) : 1;
  let costOverrun = 0;
  if (costRatio > 1.2) {
    costOverrun = Math.min(100, 85 + (costRatio - 1.2) * 60);
  } else if (costRatio > 1.05) {
    costOverrun = Math.min(85, 60 + (costRatio - 1.05) * 150);
  } else if (costRatio > 0.95 && p.physicalProgressPercentage < 60) {
    // Fund exhausted but work barely halfway done
    costOverrun = 88;
  } else if (costRatio > 0.9) {
    costOverrun = 40;
  } else {
    costOverrun = 15;
  }

  // 4. Duplicate Similarity Score (0 - 100)
  const duplicateSimilarity = p.duplicateSimilarityPercentage ?? 0;

  // 5. Documentation Anomaly Score (0 - 100)
  let documentationAnomaly = 10;
  if (!p.utilizationCertificateSubmitted) {
    documentationAnomaly += 40;
  }
  const photoCount = p.geoTaggedPhotosCount ?? 0;
  if (photoCount === 0) {
    documentationAnomaly += 40;
  } else if (photoCount < 3) {
    documentationAnomaly += 20;
  }
  documentationAnomaly = Math.min(100, documentationAnomaly);

  // 6. Geo Anomaly Score (0 - 100)
  const geoAnomaly = p.location?.geoAnomalyFlag ? 92 : 8;

  // Final Weighted Score
  const rawScore =
    0.30 * financialAnomaly +
    0.20 * delayRisk +
    0.20 * costOverrun +
    0.15 * duplicateSimilarity +
    0.10 * documentationAnomaly +
    0.05 * geoAnomaly;

  const riskScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // Risk Tier classification
  let riskTier: RiskTier = 'Low';
  if (riskScore >= 75) riskTier = 'Critical';
  else if (riskScore >= 55) riskTier = 'High';
  else if (riskScore >= 35) riskTier = 'Medium';
  else riskTier = 'Low';

  // Explainable AI factors
  const explainableFactors: ExplainableFactor[] = [
    {
      factor: 'Financial Disbursement Divergence',
      weightPct: 30,
      score: Math.round(financialAnomaly),
      impact: financialAnomaly > 65 ? 'High' : financialAnomaly > 35 ? 'Medium' : 'Low',
      description: `Disbursement is ${p.expenditurePercentage}% while verified physical progress is only ${p.physicalProgressPercentage}% (delta: ${spendVsPhysicalGap}%).`,
      recommendation: 'Immediate on-site engineering audit before releasing subsequent payment milestone tranches.',
    },
    {
      factor: 'Milestone Execution Delay',
      weightPct: 20,
      score: Math.round(delayRisk),
      impact: delayRisk > 65 ? 'High' : delayRisk > 35 ? 'Medium' : 'Low',
      description: `Timeline overrun of ${p.delayDays} days past scheduled milestone target.`,
      recommendation: 'Issue show-cause notice to the executing agency and demand revised work recovery schedule.',
    },
    {
      factor: 'Cost Overrun & Budget Exhaustion',
      weightPct: 20,
      score: Math.round(costOverrun),
      impact: costOverrun > 65 ? 'High' : costOverrun > 35 ? 'Medium' : 'Low',
      description: `Current expenditure ₹${p.expenditureAmountLakhs.toFixed(1)}L against ₹${p.sanctionedAmountLakhs.toFixed(1)}L sanctioned budget.`,
      recommendation: 'Verify bill of quantities (BOQ) with district technical committee.',
    },
    {
      factor: 'Duplicate Work & Scheme Collusion',
      weightPct: 15,
      score: Math.round(duplicateSimilarity),
      impact: duplicateSimilarity > 60 ? 'High' : duplicateSimilarity > 30 ? 'Medium' : 'Low',
      description: duplicateSimilarity > 40
        ? `Found ${duplicateSimilarity}% similarity with prior or parallel work sanctioned nearby.`
        : 'Low similarity match with historical works database.',
      recommendation: duplicateSimilarity > 40
        ? 'Cross-reference GIS coordinates and asset registry with state PWD and Panchayati Raj portal.'
        : 'Standard record tracking.',
    },
    {
      factor: 'Statutory Documentation & Compliance',
      weightPct: 10,
      score: Math.round(documentationAnomaly),
      impact: documentationAnomaly > 50 ? 'High' : 'Low',
      description: `${!p.utilizationCertificateSubmitted ? 'Utilization Certificate (UC) pending.' : 'UC verified.'} ${photoCount} geo-tagged photos uploaded.`,
      recommendation: !p.utilizationCertificateSubmitted ? 'Mandate immediate submission of Form GFR-12A.' : 'Documentation adequate.',
    },
    {
      factor: 'Geospatial Validity & Boundary Check',
      weightPct: 5,
      score: Math.round(geoAnomaly),
      impact: geoAnomaly > 50 ? 'High' : 'Low',
      description: p.location?.geoAnomalyFlag
        ? 'GPS coordinates flag boundary discrepancy or invalid terrain point.'
        : 'Geotag verified within MP constituency boundaries.',
      recommendation: p.location?.geoAnomalyFlag
        ? 'Conduct GPS re-survey using mobile e-Sakshi app.'
        : 'Location parameters verified.',
    },
  ];

  return {
    riskScore,
    riskTier,
    breakdown: {
      financialAnomaly: Math.round(financialAnomaly),
      delayRisk: Math.round(delayRisk),
      costOverrun: Math.round(costOverrun),
      duplicateSimilarity: Math.round(duplicateSimilarity),
      documentationAnomaly: Math.round(documentationAnomaly),
      geoAnomaly: Math.round(geoAnomaly),
    },
    explainableFactors,
  };
}
