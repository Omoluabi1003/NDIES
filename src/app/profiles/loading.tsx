import { Card, PageShell } from "@/components/ui";

export default function Loading() {
  return (
    <PageShell eyebrow="Loading" title="Loading NDIES intelligence" subtitle="Fetching live operational data from configured services.">
      <Card>
        <div className="h-32 animate-pulse rounded-3xl bg-white/10" />
      </Card>
    </PageShell>
  );
}
