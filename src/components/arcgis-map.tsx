"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DiasporaProfile } from "@/lib/types";

type MapFeature = {
  id: string | number;
  geometry: { coordinates: [number, number] };
  properties: {
    name: string;
    city: string;
    country: string;
    count: number;
    avgStrategicValue: number;
    profiles: DiasporaProfile[];
  };
};

type FeatureCollection = { features: MapFeature[] };

export function ArcGISDiasporaMap() {
  const [layer, setLayer] = useState("Talent Density");
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [selected, setSelected] = useState<DiasporaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/map/diaspora-points", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to load diaspora points");
      const nextFeatures = (json as FeatureCollection).features || [];
      setFeatures(nextFeatures);
      setSelected(nextFeatures[0]?.properties.profiles[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load diaspora points");
      setFeatures([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPoints();
  }, [loadPoints]);

  const profiles = useMemo(() => features.flatMap((feature) => feature.properties.profiles), [features]);

  useEffect(() => {
    let view: __esri.MapView | undefined;
    let mounted = true;
    async function load() {
      if (!profiles.length) return;
      try {
        const [{ default: Map }, { default: MapView }, { default: FeatureLayer }, { default: HeatmapRenderer }] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/layers/FeatureLayer"),
          import("@arcgis/core/renderers/HeatmapRenderer"),
        ]);
        if (!mounted || !document.getElementById("arcgis-view")) return;
        const fields = [
          { name: "ObjectID", type: "oid" as const },
          { name: "city", type: "string" as const },
          { name: "country", type: "string" as const },
          { name: "sector", type: "string" as const },
          { name: "strategicValueIndex", type: "integer" as const },
        ];
        const source = profiles.map((p, i) => ({
          geometry: { type: "point", longitude: p.longitude, latitude: p.latitude },
          attributes: { ObjectID: i + 1, city: p.city, country: p.country, sector: p.sector, strategicValueIndex: p.strategicValueIndex },
        }));
        const renderer = new HeatmapRenderer({
          field: "strategicValueIndex",
          colorStops: [
            { ratio: 0, color: "rgba(8,24,45,0)" },
            { ratio: 0.45, color: "#8fd4ff" },
            { ratio: 0.8, color: "#d6a73a" },
            { ratio: 1, color: "#ffffff" },
          ],
          maxDensity: 0.03,
          minDensity: 0,
        });
        const featureLayer = new FeatureLayer({
          source: source as never,
          fields,
          objectIdField: "ObjectID",
          geometryType: "point",
          spatialReference: { wkid: 4326 },
          renderer,
          featureReduction: { type: "cluster", clusterRadius: "80px", popupTemplate: { title: "Diaspora cluster", content: "{cluster_count} profiles represented." } },
        });
        const map = new Map({ basemap: "dark-gray-vector", layers: [featureLayer] });
        view = new MapView({ container: "arcgis-view", map, center: [5, 20], zoom: 2, background: { color: [7, 20, 38, 1] } });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to initialize ArcGIS map");
      }
    }
    void load();
    return () => {
      mounted = false;
      view?.destroy();
    };
  }, [profiles, layer]);

  const grouped = useMemo(
    () =>
      profiles.reduce<Record<string, DiasporaProfile[]>>((a, p) => {
        a[`${p.city}, ${p.country}`] ||= [];
        a[`${p.city}, ${p.country}`].push(p);
        return a;
      }, {}),
    [profiles],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_.8fr]">
      <div>
        <div className="mb-4 flex flex-wrap gap-3">
          {["Talent Density", "Investment Potential", "Healthcare Talent", "Technology Talent", "Academic Influence"].map((x) => (
            <button key={x} onClick={() => setLayer(x)} className={`rounded-full px-4 py-2 text-sm ${layer === x ? "bg-[#d6a73a] text-[#071426]" : "border border-white/15 text-slate-200"}`}>
              {x}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-100">
            <p>{error}</p>
            <button onClick={loadPoints} className="mt-3 rounded-full border border-red-200/40 px-4 py-2 text-xs font-semibold">
              Retry
            </button>
          </div>
        )}
        <div id="arcgis-view" className="arcgis-map map-grid glass">
          {loading && <div className="p-6 text-sm text-slate-300">Loading live ArcGIS FeatureLayer data from NDIES APIs...</div>}
          {!loading && !profiles.length && !error && <div className="p-6 text-sm text-slate-300">No verified diaspora geospatial records are available yet.</div>}
        </div>
      </div>
      <aside className="glass rounded-3xl p-5">
        <h2 className="text-2xl font-semibold">City intelligence</h2>
        <select className="mt-4 w-full" disabled={!profiles.length} onChange={(e) => setSelected(profiles.find((p) => `${p.city}, ${p.country}` === e.target.value) || profiles[0] || null)}>
          {Object.keys(grouped).map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        {selected ? (
          <div className="mt-5">
            <p className="text-[#8fd4ff]">
              {selected.city}, {selected.country}
            </p>
            <p className="mt-3 text-5xl font-semibold">{grouped[`${selected.city}, ${selected.country}`]?.length}</p>
            <p className="text-sm text-slate-400">verified profile records in live API layer</p>
            <div className="mt-5 space-y-3">
              {grouped[`${selected.city}, ${selected.country}`]?.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="w-full rounded-2xl bg-white/5 p-4 text-left">
                  <span className="block font-semibold">{p.fullName}</span>
                  <span className="text-sm text-slate-400">
                    {p.sector} · SVI {p.strategicValueIndex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">No city cluster selected.</p>
        )}
      </aside>
    </div>
  );
}
