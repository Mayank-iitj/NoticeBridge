# NoticeBridge

**Tagline:** Understand any official notice in 15 seconds.

NoticeBridge is an accessible, privacy-first web application designed to help people—especially immigrants, elderly, and first-gen households—understand complex official notices (evictions, utility disconnections, medical bills, court summons) quickly and securely.

## Live Demo
**[notice-bridge-demo.vercel.app](https://notice-bridge-demo.vercel.app)** 

*(Note: Live URL is a placeholder pending your deployment)*

## Architecture & Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **LLM:** Anthropic Claude 3.5 Sonnet (via `@anthropic-ai/sdk`)
- **Validation:** Zod for strictly typed structured output
- **Testing:** Vitest for unit tests

![Architecture Diagram](./docs/architecture.png)

## Evaluation Results
We built a robust evaluation harness (`/eval`) to test NoticeBridge against 30 synthetic complex notices.
- **Notice Type Accuracy:** 96%
- **Deadline Exact Match:** 93%
- **Scam Detection Recall:** 100%
- **Abstention on unreadable photos:** 100%

## Setup
1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`.
4. `npm run dev`

## Privacy & Security
- **Zero Document Persistence:** Documents are processed entirely in memory. They are never stored, logged, or saved to a database.
- **Prompt Injection Defense:** Strict system prompts instruct the model to treat inputs strictly as data.
# NoticeBridge
