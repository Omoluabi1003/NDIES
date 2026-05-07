import type { ReactNode } from "react";

export function PageShell({eyebrow,title,subtitle,children}:{eyebrow?:string;title:string;subtitle?:string;children:ReactNode}) {
  return <main className="relative mx-auto max-w-7xl px-5 py-10">
    <div className="mb-8">
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[.35em] text-[#11b86f]">{eyebrow}</p>}
      <h1 className="max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
      {subtitle && <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{subtitle}</p>}
    </div>
    {children}
  </main>;
}

export function Card({children,className=""}:{children:ReactNode;className?:string}) {
  return <section className={`glass rounded-3xl p-6 ${className}`}>{children}</section>;
}

export function Kpi({label,value,meta}:{label:string;value:string|number;meta?:string}) {
  return <Card className="relative overflow-hidden">
    <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-[#11b86f]/10 blur-2xl" />
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
    {meta && <p className="mt-2 text-sm text-[#11b86f]">{meta}</p>}
  </Card>;
}

export function Score({value,label="Score"}:{value:number;label?:string}) {
  return <div>
    <div className="mb-1 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}</span></div>
    <div className="h-2 rounded-full bg-white/10"><div className="score-bar" style={{width:`${value}%`}} /></div>
  </div>;
}

export function Pill({children,tone="blue"}:{children:ReactNode;tone?:"blue"|"gold"|"green"}) {
  const styles = tone === "gold" ? "border-[#f2c94c]/35 bg-[#f2c94c]/10 text-[#fff2b8]" : tone === "green" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-[#11b86f]/30 bg-[#11b86f]/10 text-[#dfffee]";
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${styles}`}>{children}</span>;
}
