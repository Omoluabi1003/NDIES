import Link from "next/link";

const links = [['/enroll','Enroll'],['/dashboard?role=admin','Dashboard'],['/map','Global Map'],['/profiles','Profiles'],['/ai-lab','AI Lab'],['/engagement','Engagement'],['/scenario','Scenario'],['/governance','Governance']];

export function Nav() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03170f]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#f2c94c]/40 bg-[#f2c94c]/10 font-black text-[#f2c94c]">N</span>
        <span>
          <span className="block font-semibold tracking-[.22em] text-[#f2c94c]">NDIES</span>
          <span className="hidden text-xs text-slate-400 sm:block">Nigeria Diaspora Intelligence</span>
        </span>
      </Link>
      <nav className="hidden gap-5 text-sm text-slate-200 lg:flex">{links.map(([href,label]) => <Link className="hover:text-[#11b86f]" key={href} href={href}>{label}</Link>)}</nav>
      <Link href="/enroll" className="rounded-full border border-[#f2c94c]/40 bg-[#f2c94c]/10 px-4 py-2 text-sm text-[#fff2b8]">Enroll Voluntarily</Link>
    </div>
  </header>;
}
