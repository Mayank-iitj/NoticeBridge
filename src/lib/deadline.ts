import { differenceInDays, parseISO, isPast } from "date-fns";

export type UrgencyLevel = "overdue" | "critical" | "high" | "normal";

export function getDeadlineInfo(dateIso: string | null): {
  daysRemaining: number | null;
  urgency: UrgencyLevel | null;
  isOverdue: boolean;
} {
  if (!dateIso) return { daysRemaining: null, urgency: null, isOverdue: false };

  const deadlineDate = parseISO(dateIso);
  const now = new Date();
  
  // Strip time for accurate day difference
  deadlineDate.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysRemaining = differenceInDays(deadlineDate, today);
  const overdue = daysRemaining < 0;

  let urgency: UrgencyLevel = "normal";
  if (overdue) urgency = "overdue";
  else if (daysRemaining <= 3) urgency = "critical";
  else if (daysRemaining <= 7) urgency = "high";

  return { daysRemaining, urgency, isOverdue: overdue };
}
