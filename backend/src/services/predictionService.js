export function buildPredictionSummary(rows) {
  const highDemandCount = rows.filter((r) => r.fill_ratio > 0.7).length;
  const lowDemandCount = rows.filter((r) => r.fill_ratio < 0.4).length;
  const avgFillSpeed = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r.fill_ratio), 0) * 100 / rows.length) : 0;
  return {
    highDemandCount,
    lowDemandCount,
    avgFillSpeed,
    bestBookingWindowHours: 48
  };
}

export function estimateFullTime(fillRatio) {
  if (fillRatio > 0.9) return "within 6 hours";
  if (fillRatio > 0.7) return "within 12 hours";
  if (fillRatio > 0.5) return "within 1 day";
  return "in 2-3 days";
}
