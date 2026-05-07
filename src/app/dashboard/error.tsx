"use client";
import { Card, PageShell } from "@/components/ui";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <PageShell eyebrow="Service unavailable" title="Unable to load NDIES intelligence" subtitle="Production deployments return controlled errors instead of substituting demo intelligence data.">
      <Card>
        <p className="text-sm text-red-100">{error.message}</p>
        <button onClick={reset} className="mt-4 rounded-full bg-[#d6a73a] px-5 py-2 font-semibold text-[#071426]">
          Retry
        </button>
      </Card>
    </PageShell>
  );
}
