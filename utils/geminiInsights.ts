import { GoogleGenerativeAI } from "@google/generative-ai";
import { CustomerSegment, Recommendation } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function generateSegmentInsights(segment: CustomerSegment): Promise<{
  insight: string;
  recommendation: string;
  confidence: number;
}> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return {
      insight: "Add your Gemini API key to see AI insights.",
      recommendation: "Set VITE_GEMINI_API_KEY in your environment.",
      confidence: 0,
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `
Analyze this SaaS customer segment and provide ONE key insight and ONE actionable recommendation:

Segment: ${segment.name}
Description: ${segment.description}
- Total Customers: ${segment.totalCustomers}
- Average Lifetime Value: $${segment.averageLifetimeValue.toLocaleString()}
- Customer Acquisition Cost: $${segment.cac.toLocaleString()}
- Average Revenue Per User: $${segment.arpu.toLocaleString()}
- Monthly Expansion Rate: ${segment.expansionRate}%
- Churn Risk: ${segment.churnRisk}
- Organization Size: ${segment.orgSize}
- Region: ${segment.region}

LTV:CAC Ratio: ${(segment.averageLifetimeValue / segment.cac).toFixed(2)}

Provide your response in this exact format:
INSIGHT: [One sentence observation about the segment's health]
RECOMMENDATION: [One specific action to improve retention or profitability]
CONFIDENCE: [High/Medium/Low based on data completeness]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response
    const insightMatch = response.match(/INSIGHT:\s*(.+)/i);
    const recommendationMatch = response.match(/RECOMMENDATION:\s*(.+)/i);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(High|Medium|Low)/i);

    const confidence = confidenceMatch 
      ? confidenceMatch[1] === "High" ? 0.9 : confidenceMatch[1] === "Medium" ? 0.7 : 0.5
      : 0.7;

    return {
      insight: insightMatch?.[1]?.trim() || "No insight generated.",
      recommendation: recommendationMatch?.[1]?.trim() || "No recommendation generated.",
      confidence,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      insight: "Unable to generate insights at this time.",
      recommendation: "Check your API key or try again later.",
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
