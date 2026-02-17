import { CustomerSegment } from "../types";

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/gemini-insights'
  : 'http://localhost:3000/api/gemini-insights';

export async function generateSegmentInsights(segment: CustomerSegment): Promise<{
  insight: string;
  recommendation: string;
  confidence: number;
}> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segment }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      insight: data.insight,
      recommendation: data.recommendation,
      confidence: data.confidence,
    };
  } catch (error) {
    console.error("Failed to fetch AI insights:", error);
    return {
      insight: "Unable to connect to AI service.",
      recommendation: "Check your network connection or try again later.",
      confidence: 0,
    };
  }
}

export function calculateUnitEconomicsHealth(segment: CustomerSegment): {
  score: number;
  status: "healthy" | "at-risk" | "critical";
  reasons: string[];
} {
  const ltvCacRatio = segment.averageLifetimeValue / segment.cac;
  const reasons: string[] = [];
  let score = 100;

  // LTV:CAC should be > 3
  if (ltvCacRatio < 3) {
    score -= 30;
    reasons.push(`LTV:CAC ratio (${ltvCacRatio.toFixed(1)}) below 3:1 threshold`);
  }

  // Payback period (CAC/ARPU) should be < 12 months
  const paybackMonths = segment.cac / segment.arpu;
  if (paybackMonths > 12) {
    score -= 25;
    reasons.push(`CAC payback period (${paybackMonths.toFixed(1)} months) exceeds 12 months`);
  }

  // Churn risk
  if (segment.churnRisk === "high") {
    score -= 25;
    reasons.push("High churn risk segment");
  } else if (segment.churnRisk === "medium") {
    score -= 10;
    reasons.push("Medium churn risk segment");
  }

  // Expansion rate
  if (segment.expansionRate < 5) {
    score -= 10;
    reasons.push("Low expansion revenue (< 5%)");
  }

  const status = score >= 80 ? "healthy" : score >= 60 ? "at-risk" : "critical";

  return { score: Math.max(0, score), status, reasons };
}
