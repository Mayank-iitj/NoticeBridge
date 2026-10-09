import evalResults from "@/eval/results/latest.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function EvalPage() {
  const formatPct = (val: number) => `${(val * 100).toFixed(1)}%`;

  return (
    <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-inter mb-4">Evaluation Dashboard</h1>
        <p className="text-lg text-muted-foreground font-sans">
          We test NoticeBridge against a synthetic dataset of 30 complex, low-quality, and deceptive notices to ensure reliability before you rely on it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-inter">Accuracy Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-sans">
            <div>
              <div className="flex justify-between mb-1 text-sm font-bold">
                <span>Notice Type Match</span>
                <span>{formatPct(evalResults.metrics.notice_type_accuracy)}</span>
              </div>
              <Progress value={evalResults.metrics.notice_type_accuracy * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm font-bold">
                <span>Deadline Exact Match</span>
                <span>{formatPct(evalResults.metrics.deadline_exact_match)}</span>
              </div>
              <Progress value={evalResults.metrics.deadline_exact_match * 100} />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm font-bold">
                <span>Scam Detection Recall</span>
                <span>{formatPct(evalResults.metrics.scam_recall)}</span>
              </div>
              <Progress value={evalResults.metrics.scam_recall * 100} className="bg-success/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-inter">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-sans">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="text-4xl font-bold text-primary">{(evalResults.metrics.median_latency_ms / 1000).toFixed(1)}s</div>
              <div className="text-muted-foreground text-sm">Median processing latency<br/>(vision + reasoning)</div>
            </div>
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="text-4xl font-bold text-primary">{evalResults.metrics.cost_estimate}</div>
              <div className="text-muted-foreground text-sm">Average API cost per document</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-success">{formatPct(evalResults.metrics.abstention_rate_on_bad_photos)}</div>
              <div className="text-muted-foreground text-sm">Abstention rate on unreadable photos<br/>(Safety mechanism)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-inter mb-4 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-warning" /> Honest Failure Cases
      </h2>
      <p className="mb-4 text-muted-foreground font-sans">
        No AI is perfect. Here are instances where NoticeBridge failed our strict ground-truth evaluations in the latest run.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {evalResults.failure_cases.map((fc, i) => (
          <Card key={i} className="border-warning/50 bg-warning/5">
            <CardContent className="pt-6 font-sans">
              <h3 className="font-bold text-lg mb-2">{fc.issue} (Test: {fc.id})</h3>
              <p>{fc.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
