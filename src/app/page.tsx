import Image from "next/image";
import Link from "next/link";
import { Card, Pill } from "@/components/ui";

const modules = [
  ["Executive Dashboard", "KPI cards, sector filters, readiness scores, and operating briefs for senior leaders.", "/dashboard"],
  ["Global GIS Map", "ArcGIS-ready FeatureLayer patterns for city clusters, heatmap styling, and diaspora density.", "/map"],
  ["Voluntary Enrollment", "Public opt-in wizard with explicit NDPA 2023 consent, email verification, and withdrawal controls.", "/enroll"],
  ["Profiles Registry", "Consent-aware profile cards with sector scores, source labels, and engagement categories.", "/profiles"],
  ["AI Intelligence Lab", "Structured JSON classification with deterministic fallback when API keys are not configured.", "/ai-lab"],
  ["Scenario Planning", "Country, sector, and mission planning for delegations, investments, and expert councils.", "/scenario"],
  ["Governance & Trust", "GDPR-aware controls, auditability, human review, and role-based access concepts.", "/governance"],
];

const signals = [
  ["15", "demo city records", "Houston · London · Toronto · Dubai"],
  ["8", "priority sectors", "Health, tech, finance, academia, policy"],
  ["92", "top strategic value", "Highest demo profile index"],
];

const workflow = ["Invite voluntary enrollment", "Capture explicit NDPA consent", "Verify email ownership", "Map diaspora strengths", "Enable user-controlled engagement"];

export default function Home() {
  return <main className="relative mx-auto max-w-7xl px-5 py-12">
    <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <div className="mb-8 flex flex-wrap items-center gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-[1.75rem] border border-[#f2c94c]/30 bg-[#010805] shadow-[0_22px_60px_rgba(0,0,0,.35)]">
            <Image src="/assets/brand/ndies-app-icon-square.png" alt="NDIES app icon" fill sizes="96px" className="object-cover" priority />
          </div>
          <Image src="/assets/brand/ndies-wordmark-share.png" alt="NDIES Nigeria Diaspora Intelligence & Engagement System wordmark" width={345} height={100} className="h-auto w-full max-w-[345px] rounded-2xl border border-white/10 bg-white/5 object-contain shadow-[0_18px_48px_rgba(0,0,0,.28)]" priority />
        </div>
        <Pill tone="green"><span className="status-dot" /> Public voluntary enrollment now open</Pill>
        <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">Nigeria Diaspora Intelligence & Engagement System</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">Nigerians in Diaspora can now enroll voluntarily and join the NDIES database through explicit opt-in consent, no scraping, and NDPA 2023 compliant data controls for lawful diaspora engagement and national development.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="rounded-full bg-[#f2c94c] px-6 py-3 font-semibold text-[#06291c] shadow-[0_16px_40px_rgba(242,201,76,.22)]" href="/enroll">Nigerians in Diaspora – Enroll Voluntarily & Join the NDIES Database</Link>
          <Link className="rounded-full border border-[#11b86f]/40 px-6 py-3 text-[#11b86f]" href="/dashboard?role=admin">Open Executive Dashboard</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {signals.map(([value,label,meta]) => <div key={label} className="metric-tile rounded-3xl p-4">
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-slate-300">{label}</p>
            <p className="mt-2 text-xs text-slate-500">{meta}</p>
          </div>)}
        </div>
      </div>

      <div className="glass map-grid relative overflow-hidden rounded-[2rem] p-5">
        <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[#f2c94c]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 opacity-20">
          <Image src="/assets/brand/ndies-global-emblem.png" alt="" fill sizes="288px" className="object-contain" />
        </div>
        <div className="relative rounded-[1.5rem] border border-[#11b86f]/20 bg-[#06291c]/80 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src="/assets/brand/ndies-orb-logo.png" alt="NDIES orbital logo" width={106} height={79} className="hidden h-auto w-24 rounded-2xl border border-white/10 bg-white/5 object-contain sm:block" />
              <div>
                <p className="text-sm text-slate-400">Live mission board</p>
                <h2 className="mt-2 text-2xl font-semibold">Diaspora readiness overview</h2>
              </div>
            </div>
            <span className="badge">ArcGIS + AI + CRM</span>
          </div>
          <div className="mt-6 grid gap-3">
            {["North America health and technology mission", "UK academic and policy roundtable", "Gulf investment forum pipeline", "Germany mobility AI partnership"].map((x,i) => <div key={x} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{x}</span>
                <span className="text-[#f2c94c]">0{i + 1}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10"><div className="score-bar" style={{width: `${86 - i * 7}%`}} /></div>
            </div>)}
          </div>
          <div className="mt-6 rounded-3xl border border-[#11b86f]/15 bg-[#010805]/70 p-4">
            <p className="text-xs uppercase tracking-[.25em] text-[#11b86f]">Analyst note</p>
            <p className="mt-2 leading-7 text-slate-300">Prototype data falls back to bundled demo records, so the interface remains presentation-ready without a database or API key.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.35em] text-[#11b86f]">Product scope</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Realistic web pages for the NDIES concept</h2>
        </div>
        <Pill>Built from the README roadmap and existing MVP git history</Pill>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(([title,description,href]) => <Link href={href} key={title} className="group">
          <Card className="h-full">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold text-[#11b86f]">{title}</h3>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400 group-hover:border-[#f2c94c]/50 group-hover:text-[#f2c94c]">Open</span>
            </div>
            <p className="mt-4 leading-7 text-slate-300">{description}</p>
          </Card>
        </Link>)}
      </div>
    </section>

    <section className="mt-16 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card>
        <p className="text-xs font-bold uppercase tracking-[.35em] text-[#f2c94c]">Operating model</p>
        <h2 className="mt-3 text-3xl font-semibold">From scattered signals to measurable engagement</h2>
        <p className="mt-4 leading-8 text-slate-300">The dummy product is intentionally designed to feel procurement-ready: every page communicates a real workflow, shows credible data states, and preserves governance language for public-sector confidence.</p>
      </Card>
      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          {workflow.map((step,index) => <div key={step} className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-[#f2c94c]">0{index + 1}</p>
            <p className="mt-3 text-sm font-semibold leading-6">{step}</p>
          </div>)}
        </div>
      </Card>
    </section>

    <p className="mt-12 rounded-3xl border border-[#f2c94c]/30 bg-[#f2c94c]/10 p-5 text-[#fff2b8]">Prepared by Paul A.K. Iyogun, Principal Consultant, ETL GIS Consulting LLC.</p>
  </main>;
}
