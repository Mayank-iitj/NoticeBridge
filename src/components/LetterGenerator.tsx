"use client";

import { useState } from "react";
import { NoticeResult } from "@/lib/schema";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Loader2, FileText, Printer, Copy } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function LetterGenerator({ result }: { result: NoticeResult }) {
  const [letterType, setLetterType] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState("");

  const generateLetter = async () => {
    if (!letterType) return;
    setIsGenerating(true);
    setDraft("");
    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeResult: result, letterType })
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setDraft(data.letter);
    } catch (e) {
      console.error(e);
      setDraft("Error generating letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // Generate simple print view
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Draft Letter</title>
          <style>
            body { font-family: sans-serif; padding: 40px; white-space: pre-wrap; line-height: 1.5; }
          </style>
        </head>
        <body>${draft}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="font-inter flex items-center gap-2">
          <FileText className="w-5 h-5" /> Draft a Letter
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="font-sans text-sm text-muted-foreground">
          Need to reply? We can draft a template for you based on the notice details.
        </p>
        
        {!draft && !isGenerating && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={letterType} onValueChange={(val) => setLetterType(val || "")}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Select letter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Request Extension">Request Extension</SelectItem>
                <SelectItem value="Request Payment Plan">Request Payment Plan</SelectItem>
                <SelectItem value="Dispute / Request Verification">Dispute / Request Verification</SelectItem>
                <SelectItem value="Request More Information">Request More Information</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateLetter} disabled={!letterType} className="font-inter">
              Generate Draft
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="flex items-center gap-2 text-primary p-4">
            <Loader2 className="w-5 h-5 animate-spin" /> Generating your draft...
          </div>
        )}

        {draft && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <Alert className="bg-warning/10 border-warning/50">
              <AlertDescription className="text-warning-foreground font-bold">
                Review before sending. Fill in all [PLACEHOLDERS] with your real information.
              </AlertDescription>
            </Alert>
            <Textarea 
              value={draft} 
              onChange={e => setDraft(e.target.value)}
              className="min-h-[300px] font-sans"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(draft)}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
              </Button>
              <Button variant="ghost" onClick={() => setDraft("")}>Discard</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
