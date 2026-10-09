# NoticeBridge - Decisions

## Architecture
- Framework: Next.js 14+ with App Router.
- Styling: Tailwind CSS, shadcn/ui.
- Processing: Anthropic Claude Sonnet 3.5 API with vision model.
- Validation: Zod for LLM structured output.
- PDF handling: `pdfjs-dist` on the client.

## Security & Privacy
- Zero document persistence. All processing is strictly in memory / temporary.
- No DB attached.

## Evaluation
- Using Vitest for unit testing and an evaluation script for measuring metrics.

## UX
- Theme: Navy primary, warm amber, off-white background.
- Accessibility: Atkinson Hyperlegible font for body.
