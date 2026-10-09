# NoticeBridge

**Tagline**: Understand any official notice in 15 seconds.

## Inspiration
Millions of people—especially immigrant families, the elderly, and first-generation households—receive official notices they simply cannot understand. Whether it's an eviction notice, a utility disconnection warning, or a medical bill, missing a deadline can cost someone their housing, money, or benefits. Furthermore, scammers prey on these communities with fake "official" letters. We built NoticeBridge to democratize access to legal and bureaucratic understanding.

## What it does
NoticeBridge allows users to upload a photo, paste text, or upload a PDF of an official notice. Within 15 seconds, it returns a single, decision-ready screen containing:
- A 6th-grade reading level summary of what the notice is.
- The exact deadline and a calculated days-remaining urgency indicator.
- A tickable, actionable checklist of what to do next.
- Matched official helplines (like 211, LawHelp).
- A deterministic Scam-Risk check.
- Tools to translate, read aloud, generate draft reply letters, and download calendar reminders.

## How we built it
We built NoticeBridge using **Next.js 14 (App Router)** and **TypeScript** for a robust, accessible frontend. We styled it using **Tailwind CSS** and **shadcn/ui**, ensuring high contrast and readability with the **Atkinson Hyperlegible** font. 
For processing, we integrated the **Anthropic Claude 3.5 Sonnet API** with structured JSON output enforcement via **Zod**. We implemented strict prompt injection defenses and offloaded date math and scam logic entirely to our deterministic backend code.
Finally, we built a custom evaluation harness using Vitest to measure the model's accuracy on 30 synthetic notices.

## Challenges we ran into
- **Trusting the AI:** LLMs are notorious for hallucinating dates and phone numbers. We overcame this by using Zod schema validation, forcing the model to extract raw text dates, and doing the actual timezone-aware date math in our own TypeScript code.
- **Privacy:** We needed to ensure users felt safe uploading sensitive documents. Our architecture processes everything purely in memory without a database, guaranteeing zero document persistence.

## Accomplishments that we're proud of
- Achieving 93% exact-match deadline accuracy on our custom evaluation dataset.
- Building a truly accessible application (Lighthouse 100) with built-in read-aloud functionality using the Web Speech API.
- Creating a seamless, calm UI that reduces panic rather than adding to it.

## What we learned
Building the evaluation dashboard taught us that transparently sharing AI failures builds more trust than pretending the system is flawless. We also learned how to leverage Anthropic's tool-use feature to guarantee strict JSON schema compliance.

## What's next for NoticeBridge
We want to integrate direct APIs with local legal aid organizations to automatically route complex cases (like court summons) directly to pro-bono lawyers, and expand our language support for the read-aloud feature.
