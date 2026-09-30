import { Project, DuplicateMatch } from '../types/project';

// Calculate distance between two lat/lng in meters using Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Token-based Jaccard similarity for title and description
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokenize = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const set1 = tokenize(text1);
  const set2 = tokenize(text2);

  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }

  const union = new Set([...set1, ...set2]).size;
  return Math.round((intersection / union) * 100);
}

// Cost similarity calculation
export function calculateCostSimilarity(cost1: number, cost2: number): number {
  if (cost1 <= 0 || cost2 <= 0) return 0;
  const ratio = Math.min(cost1, cost2) / Math.max(cost1, cost2);
  return Math.round(ratio * 100);
}

// Detect duplicate candidate
export function findDuplicateCandidate(
  target: Project,
  allProjects: Project[]
): DuplicateMatch | undefined {
  let highestMatch: DuplicateMatch | undefined = undefined;
  let maxScore = 0;

  for (const p of allProjects) {
    if (p.id === target.id) continue;

    // Geographic distance
    const distMeters = calculateHaversineDistance(
      target.location.lat,
      target.location.lng,
      p.location.lat,
      p.location.lng
    );

    // Geographic proximity score: 100 if < 100m, decays to 0 at 3000m
    const geoSim = distMeters < 150 ? 98 : distMeters < 500 ? 85 : distMeters < 1200 ? 60 : distMeters < 3000 ? 30 : 5;

    // Text similarities
    const titleSim = calculateTextSimilarity(target.title, p.title);
    const descSim = calculateTextSimilarity(target.description, p.description);

    // Cost similarity
    const costSim = calculateCostSimilarity(target.sanctionedAmountLakhs, p.sanctionedAmountLakhs);

    // Category bonus
    const categoryMatch = target.category === p.category ? 1.0 : 0.4;

    // Overall similarity composite
    const compositeScore = Math.round(
      (0.35 * titleSim + 0.30 * geoSim + 0.20 * descSim + 0.15 * costSim) * categoryMatch
    );

    if (compositeScore > maxScore && compositeScore >= 45) {
      maxScore = compositeScore;
      highestMatch = {
        matchedProjectId: p.id,
        matchedProjectTitle: p.title,
        matchedSanctionAmountLakhs: p.sanctionedAmountLakhs,
        matchedAgency: p.implementingAgency,
        similarityScore: compositeScore,
        breakdown: {
          titleSimilarity: titleSim,
          geoProximityMeters: distMeters,
          geoSimilarity: geoSim,
          costSimilarity: costSim,
          descriptionSimilarity: descSim,
        },
        reason: distMeters < 500
          ? `High proximity (${distMeters}m away) in same ward/block with matching scope of works.`
          : `High title and financial overlap (${titleSim}% text similarity) with work under ${p.implementingAgency}.`,
        status: compositeScore >= 75 ? 'Potential Duplicate — Review Required' : 'Under Review',
      };
    }
  }

  return highestMatch;
}
