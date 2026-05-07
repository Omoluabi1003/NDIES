"use client";

import { useState } from "react";
import type { DiasporaProfile } from "@/lib/types";
import { Card, Pill } from "@/components/ui";

export function PersonalDashboard({ profile, email }: { profile: DiasporaProfile; email?: string }) {
  const [status, setStatus] = useState(profile.consentStatus);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function withdrawConsent() {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/consent/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: profile.id, email: email || profile.email, reason: "Dashboard withdrawal" }),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(payload.error || "Unable to withdraw consent.");
      return;
    }
    setStatus(payload.data.consentStatus);
    setMessage("Your consent has been withdrawn. NDIES will stop using this profile for engagement workflows.");
  }

  return <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
    <Card>
      <Pill tone={status === "ACTIVE" ? "green" : "gold"}>{status === "ACTIVE" ? "Consent Active" : "Consent Withdrawn"}</Pill>
      <h2 className="mt-4 text-3xl font-semibold">My NDIES Profile</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">Full name<input readOnly defaultValue={profile.fullName} /></label>
        <label className="grid gap-2">Email<input readOnly defaultValue={profile.email || email || ""} /></label>
        <label className="grid gap-2">Current city<input readOnly defaultValue={profile.city} /></label>
        <label className="grid gap-2">Country<input readOnly defaultValue={profile.country} /></label>
        <label className="grid gap-2">Sector<input readOnly defaultValue={profile.sector} /></label>
        <label className="grid gap-2">Current role<input readOnly defaultValue={profile.professionTitle} /></label>
      </div>
      <p className="mt-5 text-sm text-slate-400">Profile editing can be expanded with authenticated sessions. This dashboard already exposes the legal control required for withdrawal of consent.</p>
    </Card>
    <Card>
      <h3 className="text-2xl font-semibold text-[#f2c94c]">Consent controls</h3>
      <p className="mt-3 leading-7 text-slate-300">NDPA 2023 requires transparent, user-controlled processing. You may withdraw your voluntary opt-in at any time.</p>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p><strong>Profile ID:</strong> {profile.id}</p>
        <p className="mt-2"><strong>Source:</strong> {profile.sourceType}</p>
        <p className="mt-2"><strong>Status:</strong> {status}</p>
      </div>
      <button disabled={busy || status === "WITHDRAWN"} onClick={withdrawConsent} className="mt-6 w-full rounded-full bg-red-500 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Withdrawing..." : "Withdraw Consent"}</button>
      {message && <p className="mt-4 rounded-2xl border border-[#11b86f]/20 bg-[#11b86f]/10 p-4 text-sm text-[#dfffee]">{message}</p>}
    </Card>
  </div>;
}
