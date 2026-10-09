"use client";

import { NoticeResult } from "@/lib/schema";
import { getDeadlineInfo } from "@/lib/deadline";
import { AlertTriangle, CheckCircle2, Clock, CalendarDays, Phone, FileWarning, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Play, Square, Settings, Printer } from "lucide-react";
import { LetterGenerator } from "./LetterGenerator";

export function ResultView({ result }: { result: NoticeResult }) {
  const { daysRemaining, urgency, isOverdue } = getDeadlineInfo(result.deadline.date_iso);

  // Persistence of ticks
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const key = `nb_checklist_${btoa(result.summary_plain.substring(0, 30))}`;
      const saved = localStorage.getItem(key);
      if (saved) setCheckedActions(JSON.parse(saved));
    } catch (e) {}
  }, [result.summary_plain]);

  const toggleAction = (idx: number) => {
    setCheckedActions(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      try {
        const key = `nb_checklist_${btoa(result.summary_plain.substring(0, 30))}`;
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Read Aloud
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const toggleReadAloud = () => {
    if (!synthRef.current) return;
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = `${result.summary_plain}. Deadline is ${result.deadline.date_iso ? new Date(result.deadline.date_iso).toDateString() : "unknown"}. If ignored: ${result.consequence_if_ignored}. Actions: ${result.actions.map(a => a.step).join(". ")}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsPlaying(false);
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const isLowConfidence = result.overall_confidence < 0.6 || !result.deadline.date_iso;

  const urgencyColors = {
    overdue: "bg-destructive text-destructive-foreground",
    critical: "bg-destructive text-destructive-foreground",
    high: "bg-warning text-warning-foreground",
    normal: "bg-primary text-primary-foreground"
  };

  const urgencyText = {
    overdue: "Overdue",
    critical: "Critical (Act Now)",
    high: "High Priority",
    normal: "Normal Priority"
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Top Bar Urgency */}
      <div className={`sticky top-0 z-10 w-full p-4 rounded-b-xl shadow-sm flex items-center justify-between ${urgencyColors[urgency || "normal"]}`}>
        <div className="flex items-center gap-2 font-inter font-bold text-lg">
          <Clock className="w-5 h-5" />
          <span>{urgency ? urgencyText[urgency] : "No Deadline Found"}</span>
        </div>
        {daysRemaining !== null && (
          <div className="font-sans font-bold">
            {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
          </div>
        )}
      </div>

      <div className="flex justify-end px-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => window.print()} className="font-inter">
          <Printer className="w-4 h-4 mr-2" /> Print Summary
        </Button>
        <Button variant="outline" size="sm" onClick={toggleReadAloud} className="font-inter">
          {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? "Stop Reading" : "Read Aloud"}
        </Button>
      </div>

      {isLowConfidence && (
        <Alert variant="default" className="bg-warning/10 border-warning/50 text-foreground">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <AlertTitle className="font-bold font-inter text-warning">Not fully sure</AlertTitle>
          <AlertDescription className="font-sans">
            We had trouble reading some parts of this document. 
            {result.uncertainty_notes.length > 0 && (
              <ul className="list-disc ml-5 mt-2">
                {result.uncertainty_notes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            )}
            <p className="mt-2 font-bold">Please contact the issuer directly to verify.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Deadline Card */}
      <Card className="border-l-4" style={{ borderLeftColor: urgency === "normal" ? "var(--color-primary)" : urgency === "high" ? "var(--color-warning)" : "var(--color-destructive)"}}>
        <CardHeader className="pb-2">
          <CardTitle className="font-inter flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Deadline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-bold font-sans">
                {result.deadline.date_iso ? new Date(result.deadline.date_iso).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "No Specific Date Found"}
              </div>
              {result.deadline.raw_text && (
                <p className="text-sm text-muted-foreground mt-1">Based on text: "{result.deadline.raw_text}"</p>
              )}
            </div>
            {result.deadline.date_iso && (
              <Button variant="outline" className="font-inter" onClick={() => {
                import("ics").then(({ createEvent }) => {
                  if (!result.deadline.date_iso) return;
                  const [y, m, d] = result.deadline.date_iso.split("-").map(Number);
                  createEvent({
                    start: [y, m, d, 9, 0], // 9 AM
                    duration: { hours: 1 },
                    title: `Notice Deadline: ${result.notice_type.toUpperCase()}`,
                    description: `Action needed for notice.\n\nSummary: ${result.summary_plain}\n\nConsequence if ignored: ${result.consequence_if_ignored}`,
                    alarms: [
                      { action: "display", description: "3-Day Reminder", trigger: { days: 3, before: true } },
                      { action: "display", description: "1-Day Reminder", trigger: { days: 1, before: true } }
                    ]
                  }, (error, value) => {
                    if (error) { console.error(error); return; }
                    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `deadline-${result.deadline.date_iso}.ics`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  });
                });
              }}>
                <CalendarDays className="w-4 h-4 mr-2" /> Add to Calendar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* What this is */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-inter">What this is</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-sans text-lg">{result.summary_plain}</p>
          {result.issuer && <p className="mt-2 text-sm font-semibold text-muted-foreground">From: {result.issuer}</p>}
        </CardContent>
      </Card>

      {/* Consequence if ignored */}
      <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900">
        <CardHeader className="pb-2">
          <CardTitle className="font-inter text-red-800 dark:text-red-400 flex items-center gap-2">
            <FileWarning className="w-5 h-5" /> If you ignore it
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-sans">{result.consequence_if_ignored}</p>
        </CardContent>
      </Card>

      {/* Actions Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-inter">What to do</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {result.actions.map((act, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox 
                id={`action-${idx}`} 
                checked={!!checkedActions[idx]} 
                onCheckedChange={() => toggleAction(idx)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label 
                  htmlFor={`action-${idx}`}
                  className={`font-sans text-base leading-snug cursor-pointer ${checkedActions[idx] ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {act.step}
                </label>
                {act.needs_document && (
                  <p className="text-sm text-muted-foreground">Needs: {act.needs_document}</p>
                )}
                <div className="mt-1">
                  <Badge variant={act.urgency === "now" ? "destructive" : "secondary"}>{act.urgency}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-inter flex items-center gap-2">
            <Phone className="w-5 h-5" /> Who to call
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {result.contacts.map((contact, idx) => (
            <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
              <p className="font-bold font-sans">{contact.name}</p>
              <p className="text-sm font-sans">{contact.why}</p>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="inline-flex mt-2 items-center gap-2 text-primary font-bold hover:underline">
                  <Phone className="w-4 h-4" /> {contact.phone}
                </a>
              )}
              {contact.url && (
                <div className="mt-1">
                  <a href={contact.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">{contact.url}</a>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scam check */}
      <Card className={result.scam_assessment.risk === "high" ? "border-destructive bg-destructive/10" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="font-inter flex items-center gap-2">
            {result.scam_assessment.risk === "high" ? <ShieldAlert className="w-5 h-5 text-destructive" /> : <CheckCircle2 className="w-5 h-5 text-success" />}
            Scam Check: {result.scam_assessment.risk.toUpperCase()} RISK
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.scam_assessment.reasons.length > 0 ? (
            <ul className="list-disc ml-5 space-y-1">
              {result.scam_assessment.reasons.map((r, i) => <li key={i} className="font-sans">{r}</li>)}
            </ul>
          ) : (
            <p className="font-sans text-success">We did not detect common scam signals in this document. However, always stay cautious.</p>
          )}
        </CardContent>
      </Card>

      <LetterGenerator result={result} />
      
    </div>
  );
}
