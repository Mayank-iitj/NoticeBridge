"use client";

import { useState } from "react";
import { Uploader } from "@/components/Uploader";
import { ResultView } from "@/components/ResultView";
import { NoticeResult } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [result, setResult] = useState<NoticeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");

  const handleUpload = async (data: { images?: string[], text?: string }) => {
    setIsProcessing(true);
    setProgressMsg("Starting analysis...");
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language })
      });

      if (!res.ok) throw new Error("Server error");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";
          
          for (const part of parts) {
            if (part.startsWith("event: ")) {
              const lines = part.split("\n");
              const eventLine = lines.find(l => l.startsWith("event: "))?.replace("event: ", "");
              const dataLine = lines.find(l => l.startsWith("data: "))?.replace("data: ", "");
              
              if (eventLine && dataLine) {
                const parsedData = JSON.parse(dataLine);
                if (eventLine === "progress") setProgressMsg(parsedData);
                if (eventLine === "result") setResult(parsedData);
                if (eventLine === "error") throw new Error(parsedData.message);
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSample = (type: string) => {
    let sampleText = "";
    if (type === "eviction") {
      sampleText = "PAY OR QUIT NOTICE\n\nDear Tenant, you owe $1,200 in rent. You have 3 days to pay this amount or vacate the premises. If you fail to do so, an eviction lawsuit will be filed against you.";
    } else if (type === "utility") {
      sampleText = "FINAL DISCONNECTION NOTICE\n\nYour electricity bill of $150 is past due. If payment is not received by Oct 15, 2026, your service will be disconnected.";
    } else if (type === "tax") {
      sampleText = "URGENT TAX NOTICE: You owe back taxes. Please call us immediately or face arrest. Pay via gift cards today.";
    } else if (type === "court") {
      sampleText = "SUMMONS AND COMPLAINT\n\nYou are being sued. You must file a written answer with the court within 20 days. Date of service: Oct 1, 2026. Failure to answer will result in a default judgment against you.";
    } else if (type === "school") {
      sampleText = "NOTICE OF SUSPENSION\n\nYour child has been suspended for 3 days starting tomorrow. Please contact the principal's office immediately to arrange a re-entry meeting.";
    } else if (type === "medical") {
      sampleText = "FINAL NOTICE: MEDICAL DEBT\n\nYou owe $850 for your emergency room visit on Sep 15. Please remit payment by Oct 30, 2026 to avoid collections.";
    }
    handleUpload({ text: sampleText });
  };

  return (
    <main className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold font-inter mb-4 text-primary">NoticeBridge</h1>
        <p className="text-xl text-muted-foreground font-sans">
          Understand any official notice in 15 seconds.
        </p>
      </div>

      {!result && !isProcessing && (
        <>
          <div className="w-full max-w-xl mb-4 flex justify-end">
            <Select value={language} onValueChange={(val) => setLanguage(val || "English")}>
              <SelectTrigger className="w-[180px] font-inter">
                <SelectValue placeholder="Output Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Español</SelectItem>
                <SelectItem value="Hindi">हिंदी</SelectItem>
                <SelectItem value="Arabic">العربية</SelectItem>
                <SelectItem value="Chinese">中文</SelectItem>
                <SelectItem value="Vietnamese">Tiếng Việt</SelectItem>
                <SelectItem value="Tagalog">Tagalog</SelectItem>
                <SelectItem value="French">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Uploader onUpload={handleUpload} isProcessing={isProcessing} />
          
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Try a sample</p>
            <div className="flex gap-4 flex-wrap justify-center mt-4">
              <Button variant="outline" onClick={() => handleSample("eviction")}>Eviction Notice</Button>
              <Button variant="outline" onClick={() => handleSample("utility")}>Utility Bill</Button>
              <Button variant="outline" onClick={() => handleSample("tax")}>Tax Scam</Button>
              <Button variant="outline" onClick={() => handleSample("court")}>Court Summons</Button>
              <Button variant="outline" onClick={() => handleSample("school")}>School Notice</Button>
              <Button variant="outline" onClick={() => handleSample("medical")}>Medical Bill</Button>
            </div>
          </div>
        </>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12 w-full animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-bold font-inter">{progressMsg}</h2>
          <p className="text-muted-foreground mt-2">This usually takes about 10-15 seconds.</p>
        </div>
      )}

      {error && (
        <div className="w-full max-w-xl p-4 bg-destructive/10 border border-destructive rounded-xl text-destructive font-sans mb-8">
          <p className="font-bold">Error analyzing notice:</p>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => setError(null)}>Try Again</Button>
        </div>
      )}

      {result && (
        <div className="w-full">
          <div className="mb-6 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setResult(null)}>← Analyze another notice</Button>
            <div className="text-xs text-muted-foreground">Document processed securely. Not stored.</div>
          </div>
          <ResultView result={result} />
        </div>
      )}
    </main>
  );
}
