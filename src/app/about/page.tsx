import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield, BookOpen, AlertTriangle } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-4xl font-bold font-inter mb-8 text-primary">About NoticeBridge</h1>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-inter flex items-center gap-2">
              <Info className="w-5 h-5" /> The Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="font-sans text-lg">
            <p>
              Every year, millions of individuals—including the elderly, immigrants, and first-generation households—receive official notices they cannot easily understand. Complex legal jargon and threatening language often lead to panic, causing people to miss critical deadlines for housing, utilities, or legal disputes. Furthermore, scammers increasingly send fake "official" notices to extort money. 
            </p>
            <p className="mt-4">
              NoticeBridge solves this by instantly breaking down what the document is, when you need to act, and what you need to do, all in plain English (or your preferred language).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-inter flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" /> Privacy & Security First
            </CardTitle>
          </CardHeader>
          <CardContent className="font-sans text-lg">
            <p>
              We know these documents contain sensitive personal information. 
              <strong> NoticeBridge never stores your documents.</strong>
            </p>
            <p className="mt-4">
              When you upload a notice, it is processed securely in memory and then instantly deleted. We do not maintain a database of your notices, nor do we log the text or images you provide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-inter flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="font-sans text-lg">
            <p>
              We use state-of-the-art vision models to read your uploaded document. We strictly enforce that the AI treats your document as raw data, protecting against prompt injection. Dates and deadlines are calculated deterministically by our own code based on the raw text extracted, ensuring accuracy. Finally, we run deterministic scam-checking rules against the text to flag common fraud patterns.
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="font-inter flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" /> Limitations & Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="font-sans text-lg text-muted-foreground">
            <p className="font-bold text-foreground">NoticeBridge is not a lawyer, and this is not legal advice.</p>
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Our summaries are informational only. You should always verify deadlines directly with the issuing agency.</li>
              <li>Handwritten text or highly degraded images may cause misinterpretations. Always review the "Not Fully Sure" warnings if the AI indicates low confidence.</li>
              <li>If you are facing immediate eviction or legal action, please seek professional legal aid immediately. We provide official resource links in your results.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
