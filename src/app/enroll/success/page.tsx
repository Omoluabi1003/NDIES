import Link from "next/link";
import { Card, PageShell, Pill } from "@/components/ui";

export default async function EnrollmentSuccess({ searchParams }: { searchParams: Promise<{ profileId?: string; email?: string; verified?: string }> }) {
  const params = await searchParams;
  const profileId = params.profileId || "";
  const dashboardHref = profileId ? `/dashboard?profileId=${encodeURIComponent(profileId)}${params.email ? `&email=${encodeURIComponent(params.email)}` : ""}` : "/dashboard";
  const shareUrl = profileId ? `https://ndies.vercel.app/enroll/success?profileId=${encodeURIComponent(profileId)}` : "https://ndies.vercel.app/enroll";

  return <PageShell eyebrow="Enrollment received" title="Thank you for voluntarily joining NDIES" subtitle="Your profile and NDPA 2023 consent record have been securely captured. Please verify your email if you have not already done so.">
    <Card className="relative overflow-hidden">
      <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-[#008751]/25 blur-3xl" />
      <Pill tone="green">Consent Active • User-Controlled</Pill>
      <h2 className="mt-5 text-4xl font-semibold">Enrollment confirmation</h2>
      <p className="mt-4 max-w-3xl leading-8 text-slate-300">NDIES records only the data you voluntarily submitted. You can view, correct, or withdraw consent at any time from your personal dashboard.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4"><p className="text-sm text-slate-400">Profile reference</p><p className="mt-2 break-all text-[#fff2b8]">{profileId || "Pending"}</p></div>
        <div className="rounded-2xl bg-white/5 p-4"><p className="text-sm text-slate-400">Email status</p><p className="mt-2 text-[#11b86f]">{params.verified ? "Verified" : "Verification email sent when configured"}</p></div>
        <div className="rounded-2xl bg-white/5 p-4"><p className="text-sm text-slate-400">Trust posture</p><p className="mt-2 text-emerald-200">Secure • Encrypted • User-Controlled</p></div>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href={dashboardHref} className="rounded-full bg-[#f2c94c] px-6 py-3 font-semibold text-[#06291c]">View / Edit Profile in Dashboard</Link>
        <Link href={shareUrl} className="rounded-full border border-[#11b86f]/35 px-6 py-3 text-[#11b86f]">Copy Shareable Link</Link>
      </div>
    </Card>
  </PageShell>;
}
