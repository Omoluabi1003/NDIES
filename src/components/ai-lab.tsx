"use client";
import { useState } from "react";
import { Card } from "./ui";

export function AILab() {
  const [rawInput, setRawInput] = useState(
    "Nigerian cardiologist leading digital health innovation at a major teaching hospital, active in professional associations and interested in mentoring clinicians in Lagos.",
  );
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function classify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/classify-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Classification failed");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">Analyst input</h2>
        <p className="mt-2 text-slate-400">Paste public professional profile text. The API returns strict JSON and logs the classification when production services are configured.</p>
        <textarea className="mt-5 min-h-[260px] w-full" value={rawInput} onChange={(e) => setRawInput(e.target.value)} />
        {error && <p className="mt-4 rounded-2xl border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100">{error}</p>}
        <button disabled={loading} onClick={classify} className="mt-4 rounded-full bg-[#d6a73a] px-6 py-3 font-semibold text-[#071426] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Classifying..." : error ? "Retry classification" : "Classify profile"}
        </button>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">Structured JSON output</h2>
        <pre className="mt-5 max-h-[520px] overflow-auto rounded-2xl bg-[#020814] p-5 text-sm text-[#8fd4ff]">
          {result ? JSON.stringify(result, null, 2) : loading ? "Waiting for structured model output..." : "Run a classification to view schema-compliant output."}
        </pre>
      </Card>
    </div>
  );
}
