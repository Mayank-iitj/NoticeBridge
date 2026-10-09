import { describe, it, expect } from "vitest";
import { getDeadlineInfo } from "./deadline";
import { formatISO, addDays, subDays } from "date-fns";

describe("Deadline Math", () => {
  it("handles null deadline gracefully", () => {
    expect(getDeadlineInfo(null)).toEqual({ daysRemaining: null, urgency: null, isOverdue: false });
  });

  it("identifies overdue deadlines", () => {
    const past = formatISO(subDays(new Date(), 5));
    const result = getDeadlineInfo(past);
    expect(result.isOverdue).toBe(true);
    expect(result.urgency).toBe("overdue");
    expect(result.daysRemaining).toBeLessThan(0);
  });

  it("identifies critical deadlines (<= 3 days)", () => {
    const critical = formatISO(addDays(new Date(), 2));
    const result = getDeadlineInfo(critical);
    expect(result.isOverdue).toBe(false);
    expect(result.urgency).toBe("critical");
    expect(result.daysRemaining).toBe(2);
  });

  it("identifies high deadlines (<= 7 days)", () => {
    const high = formatISO(addDays(new Date(), 5));
    const result = getDeadlineInfo(high);
    expect(result.isOverdue).toBe(false);
    expect(result.urgency).toBe("high");
    expect(result.daysRemaining).toBe(5);
  });

  it("identifies normal deadlines (> 7 days)", () => {
    const normal = formatISO(addDays(new Date(), 10));
    const result = getDeadlineInfo(normal);
    expect(result.isOverdue).toBe(false);
    expect(result.urgency).toBe("normal");
    expect(result.daysRemaining).toBe(10);
  });
});
