import { getProfileById, getProfiles, metricsFor } from "@/lib/data-service";
import { Card, Kpi, PageShell, Pill } from "@/components/ui";
import { ProfileCard } from "@/components/profile-card";
import { PersonalDashboard } from "@/components/enrollment/personal-dashboard";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ profileId?: string; email?: string; role?: string }> }) {
  const params = await searchParams;
  if (params.profileId && params.role !== "admin") {
    const profile = await getProfileById(params.profileId);
    return <PageShell eyebrow="Personal dashboard" title="View, update, and control your NDIES profile" subtitle="This self-service area keeps enrollment user-controlled: review your voluntary profile data and withdraw consent at any time.">
      {profile ? <PersonalDashboard profile={profile} email={params.email} /> : <Card><h2 className="text-2xl font-semibold">Profile not found</h2><p className="mt-3 text-slate-300">Check your enrollment confirmation link or contact NDIES support.</p></Card>}
    </PageShell>;
  }

  const profiles = await getProfiles();
  const m = metricsFor(profiles);
  const countries = [...new Set(profiles.map(p => p.country))];
  const sectors = [...new Set(profiles.map(p => p.sector))];
  const countrySummaries = countries.map(country => {
    const records = profiles.filter(p => p.country === country);
    const average = Math.round(records.reduce((sum,p) => sum + p.strategicValueIndex, 0) / records.length);
    return {country, records: records.length, average};
  }).sort((a,b) => b.average - a.average);

  return <PageShell eyebrow="Executive command centre" title="Diaspora intelligence dashboard" subtitle="A map-first operational view for decision makers to monitor diaspora concentration, sector strength, readiness for engagement, and priority missions.">
    <div className="mb-6 flex flex-wrap gap-3"><Pill tone="green"><span className="status-dot" /> Live API data flow</Pill><Pill>PostGIS-ready fields</Pill><Pill tone="gold">Production mock fallback disabled</Pill></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Kpi label="Estimated diaspora profiles" value={m.estimatedDiasporaProfiles}/>
      <Kpi label="Countries represented" value={m.countriesRepresented}/>
      <Kpi label="Top professional sector" value={m.topProfessionalSectors[0]?.sector || "—"} meta={`${m.topProfessionalSectors.length} tracked sectors`}/>
      <Kpi label="Investment opportunity index" value={`${m.investmentOpportunityIndex}/100`}/>
      <Kpi label="Engagement readiness score" value={`${m.engagementReadinessScore}/100`}/>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <Card>
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Operating filters</h2><span className="badge">Analyst view</span></div>
        <div className="mt-5 grid gap-3">
          <select><option>All countries</option>{countries.map(x => <option key={x}>{x}</option>)}</select>
          <select><option>All sectors</option>{sectors.map(x => <option key={x}>{x}</option>)}</select>
          <select><option>Score range: 70-100</option><option>80-100</option><option>90-100</option></select>
          <select><option>All engagement categories</option><option>Investor</option><option>Technology Innovator</option><option>Healthcare Expert</option></select>
        </div>
        <h3 className="mt-8 font-semibold text-[#f2c94c]">Sector leaders</h3>
        {m.topProfessionalSectors.length ? m.topProfessionalSectors.map(s => <div key={s.sector} className="mt-3 flex justify-between rounded-xl bg-white/5 p-3"><span>{s.sector}</span><span>{s.count}</span></div>) : <p className="mt-3 text-sm text-slate-400">No sector records available.</p>}
      </Card>

      <Card className="map-grid min-h-[540px]">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold">Global operational map</h2><span className="badge">ArcGIS-ready FeatureLayer</span></div>
        <div className="relative mt-6 h-[410px] overflow-hidden rounded-3xl border border-[#11b86f]/20 bg-[#03170f]">
          <div className="absolute inset-0 map-grid opacity-70" />
          <div className="absolute left-6 top-6 rounded-2xl border border-white/10 bg-[#010805]/80 p-4 text-sm text-slate-300"><span className="status-dot mr-2" /> Live database clusters</div>
          {profiles.length ? profiles.slice(0, 12).map((p,i) => <div key={p.id} className="absolute rounded-full border border-[#f2c94c] bg-[#11b86f] shadow-[0_0_30px_rgba(17,184,111,.8)]" style={{left:`${8 + (i * 9) % 80}%`,top:`${18 + (i * 13) % 62}%`,width:10 + p.strategicValueIndex / 7,height:10 + p.strategicValueIndex / 7}} title={`${p.city}, ${p.country}`} />) : <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">No verified geospatial records available.</div>}
        </div>
      </Card>
    </div>

    <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Card>
        <h2 className="text-2xl font-semibold">Country readiness</h2>
        <div className="mt-5 space-y-3">{countrySummaries.length ? countrySummaries.map(c => <div key={c.country} className="rounded-2xl bg-white/5 p-4">
          <div className="flex justify-between text-sm"><span>{c.country}</span><span>{c.records} profiles · SVI {c.average}</span></div>
          <div className="mt-3 h-2 rounded-full bg-white/10"><div className="score-bar" style={{width: `${c.average}%`}} /></div>
        </div>) : <p className="text-sm text-slate-400">No country readiness records available.</p>}</div>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">Priority engagement queue</h2>
        <div className="mt-5 space-y-3">{profiles.length ? profiles.slice().sort((a,b) => b.strategicValueIndex - a.strategicValueIndex).slice(0, 5).map((p,index) => <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
          <div><p className="font-semibold">0{index + 1}. {p.fullName}</p><p className="text-sm text-slate-400">{p.city}, {p.country} · {p.engagementCategory}</p></div>
          <span className="text-[#f2c94c]">{p.strategicValueIndex}</span>
        </div>) : <p className="text-sm text-slate-400">No priority profiles available.</p>}</div>
      </Card>
    </section>

    <section className="mt-6 grid gap-5 lg:grid-cols-3">{profiles.slice(0, 3).map(p => <ProfileCard key={p.id} p={p}/>)}</section>
  </PageShell>;
}
