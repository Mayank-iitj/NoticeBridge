import { describe, it, expect } from "vitest";
import { evaluateScamSignals } from "./scam";

describe("Scam Detection Rules", () => {
  it("flags gift card payments", () => {
    const text = "Please pay immediately using iTunes gift cards.";
    const result = evaluateScamSignals(text, "low");
    expect(result.risk).toBe("high");
    expect(result.reasons.some(r => r.includes("gift cards"))).toBe(true);
  });

  it("flags immediate arrest threats", () => {
    const text = "If you don't pay, police will be dispatched for your immediate arrest.";
    const result = evaluateScamSignals(text, "low");
    expect(result.risk).toBe("high");
    expect(result.reasons.some(r => r.includes("arrest"))).toBe(true);
  });

  it("defaults to model risk if no signals found", () => {
    const text = "This is a standard notice with case number 12345.";
    const result = evaluateScamSignals(text, "medium");
    expect(result.risk).toBe("medium");
    expect(result.reasons.length).toBe(0);
  });
});
