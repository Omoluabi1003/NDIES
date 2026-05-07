import type { DiasporaProfile } from "@/lib/types";
import { Card, Score } from "./ui";

function initials(name:string) {
  return name.split(" ").slice(0, 2).map(part => part[0]).join("");
}

export function ProfileCard({p}:{p:DiasporaProfile}) {
  return <Card className="h-full">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#8fd4ff]/25 bg-[#8fd4ff]/10 font-semibold text-[#8fd4ff]">{initials(p.fullName)}</div>
        <div>
          <h3 className="text-xl font-semibold">{p.fullName}</h3>
          <p className="text-sm text-slate-400">{p.professionTitle} · {p.organization}</p>
          <p className="mt-1 text-sm text-[#8fd4ff]">{p.city}, {p.country} · {p.sector}</p>
        </div>
      </div>
      <span className="badge">{p.engagementCategory}</span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">{p.skills.map(s => <span key={s} className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">{s}</span>)}</div>
    <div className="mt-5 grid gap-3">
      <Score label="Influence" value={p.influenceScore}/>
      <Score label="Investment capacity" value={p.investmentCapacityScore}/>
      <Score label="Strategic value" value={p.strategicValueIndex}/>
    </div>
    <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400 sm:grid-cols-2">
      <p><span className="block text-slate-500">Source</span><span className="text-slate-200">{p.sourceType}</span></p>
      <p><span className="block text-slate-500">Consent state</span><span className="text-emerald-200">{p.consentStatus}</span></p>
    </div>
  </Card>;
}
