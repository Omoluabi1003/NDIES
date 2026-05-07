import { PageShell } from "@/components/ui";
import { ArcGISDiasporaMap } from "@/components/arcgis-map";

export default function MapPage() {
  return (
    <PageShell
      eyebrow="Global diaspora map"
      title="Interactive world map of Nigerian diaspora intelligence"
      subtitle="ArcGIS Maps SDK patterns are used for live API-backed point layers, clustering, heatmap styling, and side-panel city intelligence."
    >
      <ArcGISDiasporaMap />
    </PageShell>
  );
}
