export function evaluateScamSignals(text: string, modelRisk: "low" | "medium" | "high"): { risk: "low" | "medium" | "high", reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const lower = text.toLowerCase();

  // Rules
  if (lower.match(/\b(gift card|gift cards|bitcoin|crypto|wire transfer|zelle|cash app|venmo|moneygram|western union)\b/i)) {
    reasons.push("Requests payment via untraceable methods (gift cards, crypto, wire transfer).");
    score += 3;
  }
  if (lower.match(/\b(immediate arrest|warrant for your arrest|deportation|police will be dispatched|local authorities|sheriff|jail time)\b/i)) {
    reasons.push("Threatens immediate arrest or deportation (legit agencies do not do this).");
    score += 3;
  }
  if (lower.match(/\b(act within 24 hours|immediate action required|urgent|final warning)\b/i) && !lower.match(/\b(case number|account number|reference|docket)\b/i)) {
    reasons.push("Creates extreme urgency without providing a specific case or account number.");
    score += 2;
  }
  if (lower.match(/\b(social security number|ssn|bank login|password|routing number|credit card number)\b/i)) {
    reasons.push("Asks for highly sensitive information like SSN or bank login.");
    score += 2;
  }
  if (lower.match(/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl)\b/i)) {
    reasons.push("Uses shortened URLs which hide the real destination.");
    score += 1;
  }
  if (lower.match(/\b(dear citizen|dear customer|dear resident|dear homeowner)\b/i)) {
    reasons.push("Uses a generic greeting instead of your actual name.");
    score += 1;
  }

  let finalRisk = modelRisk;
  let computedRisk: "low" | "medium" | "high" = "low";
  
  if (score >= 3) computedRisk = "high";
  else if (score >= 1) computedRisk = "medium";

  // Max of modelRisk and computedRisk
  const riskLevels = { low: 0, medium: 1, high: 2 };
  if (riskLevels[computedRisk] > riskLevels[finalRisk]) {
    finalRisk = computedRisk;
  }

  return { risk: finalRisk, reasons };
}
