import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { segment } = req.body;

  if (!segment) {
    return res.status(400).json({ error: 'Segment data required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Server configuration error',
      insight: "API key not configured on server.",
      recommendation: "Contact administrator.",
      confidence: 0 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const ltvCacRatio = segment.averageLifetimeValue / segment.cac;
    const paybackMonths = segment.cac / segment.arpu;

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

Calculated Metrics:
- LTV:CAC Ratio: ${ltvCacRatio.toFixed(2)}
- CAC Payback Period: ${paybackMonths.toFixed(1)} months

Provide your response in this exact format:
INSIGHT: [One sentence observation about the segment's health]
RECOMMENDATION: [One specific action to improve retention or profitability]
CONFIDENCE: [High/Medium/Low based on data completeness]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response
    const insightMatch = response.match(/INSIGHT:\s*(.+)/i);
    const recommendationMatch = response.match(/RECOMMENDATION:\s*(.+)/i);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(High|Medium|Low)/i);

    const confidence = confidenceMatch 
      ? confidenceMatch[1] === "High" ? 0.9 : confidenceMatch[1] === "Medium" ? 0.7 : 0.5
      : 0.7;

    return res.status(200).json({
      insight: insightMatch?.[1]?.trim() || "No insight generated.",
      recommendation: recommendationMatch?.[1]?.trim() || "No recommendation generated.",
      confidence,
    });

  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: 'Failed to generate insights',
      insight: "Unable to generate insights at this time.",
      recommendation: "Please try again later.",
      confidence: 0,
    });
  }
}
