import Link from "next/link";

const links = [['/dashboard','Dashboard'],['/map','Global Map'],['/profiles','Profiles'],['/ai-lab','AI Lab'],['/engagement','Engagement'],['/scenario','Scenario'],['/governance','Governance']];

export function Nav() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061225]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#d6a73a]/40 bg-[#d6a73a]/10 font-black text-[#d6a73a]">N</span>
        <span>
          <span className="block font-semibold tracking-[.22em] text-[#d6a73a]">NDIES</span>
          <span className="hidden text-xs text-slate-400 sm:block">Nigeria Diaspora Intelligence</span>
        </span>
      </Link>
      <nav className="hidden gap-5 text-sm text-slate-200 lg:flex">{links.map(([href,label]) => <Link className="hover:text-[#8fd4ff]" key={href} href={href}>{label}</Link>)}</nav>
      <Link href="/dashboard" className="rounded-full border border-[#8fd4ff]/25 px-4 py-2 text-sm text-[#8fd4ff]">Launch MVP</Link>
    </div>
  </header>;
}
