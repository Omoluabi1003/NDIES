import { PageShell } from "@/components/ui";
import { ArcGISDiasporaMap } from "@/components/arcgis-map";
import { getProfiles } from "@/lib/data-service";
export default async function MapPage(){const profiles=await getProfiles();return <PageShell eyebrow="Global diaspora map" title="Interactive world map of Nigerian diaspora intelligence" subtitle="ArcGIS Maps SDK patterns are used for point layers, clustering, heatmap styling, and side-panel city intelligence."><ArcGISDiasporaMap profiles={profiles}/></PageShell>}
