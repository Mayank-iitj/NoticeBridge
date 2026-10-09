import { z } from "zod";

export const noticeTypeEnum = z.enum([
  "eviction",
  "utility_disconnection",
  "tax",
  "court_summons",
  "school",
  "benefits",
  "medical_bill",
  "debt_collection",
  "immigration",
  "other",
]);

export const actionUrgencyEnum = z.enum(["now", "soon", "later"]);

export const scamRiskEnum = z.enum(["low", "medium", "high"]);

export const noticeSchema = z.object({
  notice_type: noticeTypeEnum,
  issuer: z.string().nullable(),
  summary_plain: z.string().max(300), // ~60 words max ideally
  deadline: z.object({
    date_iso: z.string().nullable(),
    raw_text: z.string().nullable(),
    confidence: z.number().min(0).max(1),
  }),
  consequence_if_ignored: z.string(),
  amount_due: z.object({
    value: z.number().nullable(),
    currency: z.string().nullable(),
  }),
  actions: z.array(
    z.object({
      step: z.string(),
      urgency: actionUrgencyEnum,
      needs_document: z.string().nullable(),
    })
  ),
  contacts: z.array(
    z.object({
      name: z.string(),
      phone: z.string().nullable(),
      url: z.string().nullable(),
      why: z.string(),
    })
  ),
  scam_assessment: z.object({
    risk: scamRiskEnum,
    reasons: z.array(z.string()),
  }),
  overall_confidence: z.number().min(0).max(1),
  uncertainty_notes: z.array(z.string()),
  language_detected: z.string(),
});

export type NoticeType = z.infer<typeof noticeTypeEnum>;
export type NoticeResult = z.infer<typeof noticeSchema>;
