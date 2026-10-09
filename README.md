<div align="center">
  <img src="https://raw.githubusercontent.com/Mayank-iitj/NoticeBridge/main/public/window.svg" alt="NoticeBridge Logo" width="120" height="120" />
  <h1>NoticeBridge</h1>
  <p><strong>Demystifying the system for those who need it most.</strong></p>

  <p>
    <a href="https://github.com/Mayank-iitj/NoticeBridge/stargazers"><img src="https://img.shields.io/github/stars/Mayank-iitj/NoticeBridge" alt="Stars Badge"/></a>
    <a href="https://github.com/Mayank-iitj/NoticeBridge/network/members"><img src="https://img.shields.io/github/forks/Mayank-iitj/NoticeBridge" alt="Forks Badge"/></a>
    <a href="https://github.com/Mayank-iitj/NoticeBridge/issues"><img src="https://img.shields.io/github/issues/Mayank-iitj/NoticeBridge" alt="Issues Badge"/></a>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/OpenAI-GPT--5--nano-412991?style=flat&logo=openai" alt="OpenAI" />
  </p>
</div>

<br />

## 🚨 The Problem
Every year, millions of Americans—especially immigrants, the elderly, and first-generation households—receive official notices they cannot understand. Eviction threats, utility disconnections, medical bills, and court summons are often written in dense legalese. 

When people are overwhelmed by the language, they freeze. **Missed deadlines lead to homelessness, ruined credit, and legal disasters.**

## 💡 The Solution
**NoticeBridge** is a privacy-first, accessibility-focused web application that instantly translates terrifying legal documents into actionable, 6th-grade-level action plans.

Simply upload a photo or PDF of any official notice. NoticeBridge extracts the facts, calculates your exact deadline, screens for scams, and gives you a step-by-step checklist of what to do next.

---

## ✨ Premium Features

### 🧠 Deterministic AI Extraction
We don't just ask the AI to "summarize." NoticeBridge uses **OpenAI GPT-5-nano** combined with strict **Zod JSON schemas** and function-calling. This physically forces the LLM to output structured data (exact dates, amounts due, and issuer names) rather than rambling paragraphs, completely eliminating hallucinations.

### 🛡️ Ironclad Scam Detection
Scammers prey on the vulnerable. We run every document through a hybrid threat-detection pipeline. A hardcoded, deterministic RegEx engine checks for known threat vectors (e.g., "gift cards," "warrant for arrest," "Bitcoin") while the AI assesses the overall context. 

### 📅 Smart Deadline Math
Language models are notoriously bad at relative date math (e.g., "within 3 days of receipt"). We inject the real-world current date into the system prompt, instructing the engine to mathematically resolve the exact `YYYY-MM-DD` ISO deadline. Users can instantly export these calculated deadlines to their calendar with automated 3-day and 1-day alarms.

### ♿ Accessibility First
Built for the people who need it most.
- **Dyslexia Mode**: Increases letter spacing and line heights instantly.
- **Dynamic Text Scaling**: Toggle between standard, large, and extra-large typography.
- **High Contrast**: A specialized dark/amber mode for maximum legibility.

### 📝 Auto-Draft Legal Letters
Need to ask for an extension? Need to dispute a debt? NoticeBridge takes the exact context of the uploaded notice and uses the LLM to draft a formal, professional response letter that you can instantly print and mail.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **AI/ML Engine**: OpenAI (`gpt-5-nano`) via `openai` Node SDK
- **PDF Parsing**: `pdfjs-dist` (Client-side Web Worker)
- **Validation**: Zod
- **Icons**: Lucide React

---

## 🔒 Privacy Architecture (Zero-Persistence)

Trust is paramount when dealing with sensitive documents like tax returns or medical bills. **NoticeBridge is a zero-persistence application.**
- **No Databases**: We do not have a PostgreSQL or MongoDB instance. We store nothing.
- **No Cloud Storage**: We do not upload files to AWS S3. Images are converted to temporary base64 strings in browser memory and streamed directly to the OpenAI API.
- **Client-Side Parsing**: PDFs are parsed directly on the user's device using `pdfjs-dist` inside a background worker. Only the extracted raw text/rendered canvas is sent over the wire.
- **Local State**: Checklists and UI preferences are saved exclusively to the user's `localStorage`. 

---

## 🚀 Quick Start (Local Development)

Want to run NoticeBridge locally? It takes less than 2 minutes.

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Mayank-iitj/NoticeBridge.git
   cd NoticeBridge
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables**
   Create a \`.env\` file in the root directory and add your OpenAI API key:
   \`\`\`env
   OPENAI_API_KEY=sk-your-api-key-here
   \`\`\`

4. **Start the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Hackathon Context

This project was built for **WarriorHacks 2.0**.
**Theme:** Create a project that solves an issue in your community, county, state, or nation.

NoticeBridge directly addresses the systemic information asymmetry between bureaucratic institutions and everyday citizens, transforming legal anxiety into empowered action.

---

<div align="center">
  <i>Built with ❤️ to bridge the gap between legalese and reality.</i>
</div>
