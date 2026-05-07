"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CONSENT_VERSION, consentStatements, enrollmentSchema, type EnrollmentInput, sectors } from "@/lib/enrollment";
import { Card, Pill } from "@/components/ui";

const steps = ["Identity", "Contact", "Professional", "NDPA Consent"];

type EnrollmentFormValues = Omit<EnrollmentInput, "nigerianIdentityConfirmed" | "consentPersonalData" | "consentLawfulUse" | "consentWithdrawal" | "consentPolicyTerms"> & {
  nigerianIdentityConfirmed: boolean;
  consentPersonalData: boolean;
  consentLawfulUse: boolean;
  consentWithdrawal: boolean;
  consentPolicyTerms: boolean;
};

const defaults: Partial<EnrollmentFormValues> = {
  gender: "",
  sector: "",
  consentPersonalData: false,
  consentLawfulUse: false,
  consentWithdrawal: false,
  consentPolicyTerms: false,
  nigerianIdentityConfirmed: false,
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-red-200">{message}</p> : null;
}

export function EnrollmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const form = useForm<EnrollmentFormValues>({ resolver: zodResolver(enrollmentSchema) as never, defaultValues: defaults, mode: "onChange" });
  const values = form.watch();
  const allConsentChecked = !!(values.consentPersonalData && values.consentLawfulUse && values.consentWithdrawal && values.consentPolicyTerms);
  const [consentTimestamp] = useState(() => new Date().toISOString());

  async function next() {
    const fields: (keyof EnrollmentFormValues)[][] = [
      ["fullName", "dateOfBirth", "gender", "nigerianIdentityConfirmed"],
      ["email", "phone", "city", "country"],
      ["sector", "currentRole", "linkedinUrl", "portfolioUrl", "skills"],
      ["consentPersonalData", "consentLawfulUse", "consentWithdrawal", "consentPolicyTerms"],
    ];
    const valid = await form.trigger(fields[step]);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function onSubmit(input: EnrollmentFormValues) {
    setServerError("");
    const response = await fetch("/api/enroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error || "Enrollment could not be completed. Please review your details and try again.");
      return;
    }
    router.push(`/enroll/success?profileId=${encodeURIComponent(payload.data.id)}&email=${encodeURIComponent(payload.data.email || input.email)}`);
  }

  return <Card className="overflow-hidden p-0">
    <div className="border-b border-white/10 bg-[#008751]/15 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill tone="green">100% Voluntary • Explicit Opt-In Consent • No Scraping</Pill>
          <h2 className="mt-4 text-3xl font-semibold">Public NDIES Enrollment Wizard</h2>
          <p className="mt-2 max-w-3xl text-slate-300">Add your own diaspora profile through a lawful, transparent, NDPA 2023 compliant process.</p>
        </div>
        <div className="rounded-2xl border border-[#f2c94c]/30 bg-[#f2c94c]/10 p-4 text-sm text-[#fff2b8]">Secure • Encrypted • User-Controlled Data</div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4">{steps.map((label, index) => <div key={label} className={`rounded-2xl border p-3 text-sm ${index === step ? "border-[#f2c94c] bg-[#f2c94c]/15 text-[#fff2b8]" : index < step ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-white/5 text-slate-400"}`}><span className="mr-2 font-semibold">0{index + 1}</span>{label}</div>)}</div>
    </div>

    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
      {step === 0 && <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">Full name<input {...form.register("fullName")} placeholder="As shown on official records" /><FieldError message={form.formState.errors.fullName?.message} /></label>
        <label className="grid gap-2">Date of birth<input type="date" {...form.register("dateOfBirth")} /><FieldError message={form.formState.errors.dateOfBirth?.message} /></label>
        <label className="grid gap-2">Gender<select {...form.register("gender")}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select><FieldError message={form.formState.errors.gender?.message} /></label>
        <label className="flex items-start gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 md:col-span-2"><input className="mt-1 h-5 w-5" type="checkbox" {...form.register("nigerianIdentityConfirmed")} /><span><strong>I am a Nigerian citizen or of Nigerian descent.</strong><span className="block text-sm text-slate-300">This public enrollment is only for Nigerians at home or in diaspora who voluntarily submit their own information.</span><FieldError message={form.formState.errors.nigerianIdentityConfirmed?.message} /></span></label>
      </div>}

      {step === 1 && <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">Email address<input type="email" {...form.register("email")} placeholder="you@example.com" /><FieldError message={form.formState.errors.email?.message} /></label>
        <label className="grid gap-2">Phone with country code<input {...form.register("phone")} placeholder="+1 555 000 0000" /><FieldError message={form.formState.errors.phone?.message} /></label>
        <label className="grid gap-2">Current city<input {...form.register("city")} placeholder="Houston" /><FieldError message={form.formState.errors.city?.message} /></label>
        <label className="grid gap-2">Country of residence<input {...form.register("country")} placeholder="United States" /><FieldError message={form.formState.errors.country?.message} /></label>
      </div>}

      {step === 2 && <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">Sector<select {...form.register("sector")}><option value="">Select a sector</option>{sectors.map((sector) => <option key={sector}>{sector}</option>)}</select></label>
        <label className="grid gap-2">Current role<input {...form.register("currentRole")} placeholder="Senior Product Manager" /></label>
        <label className="grid gap-2">LinkedIn URL<input {...form.register("linkedinUrl")} placeholder="https://linkedin.com/in/..." /><FieldError message={form.formState.errors.linkedinUrl?.message} /></label>
        <label className="grid gap-2">Portfolio URL<input {...form.register("portfolioUrl")} placeholder="https://..." /><FieldError message={form.formState.errors.portfolioUrl?.message} /></label>
        <label className="grid gap-2 md:col-span-2">Skills/tags<textarea {...form.register("skills")} rows={4} placeholder="GIS, public health, fintech, AI policy" /></label>
      </div>}

      {step === 3 && <div className="space-y-5">
        <div className="rounded-3xl border border-[#f2c94c]/40 bg-[#f2c94c]/10 p-5">
          <h3 className="text-3xl font-semibold text-[#fff2b8]">Your Explicit Consent is Required – NDPA 2023</h3>
          <p className="mt-3 leading-7 text-slate-200">You cannot complete enrollment until every consent box is checked. NDIES records the consent version, timestamp, and IP address for lawful accountability.</p>
          <p className="mt-3 text-sm text-[#fff2b8]">Consent version: {CONSENT_VERSION} • Timestamp preview: {consentTimestamp}</p>
        </div>
        {consentStatements.map((statement, index) => {
          const names = ["consentPersonalData", "consentLawfulUse", "consentWithdrawal", "consentPolicyTerms"] as const;
          return <label key={statement} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><input className="mt-1 h-5 w-5" type="checkbox" {...form.register(names[index])} /><span>{statement}{index === 3 && <span> <Link className="text-[#11b86f] underline" href="/governance#privacy-policy" target="_blank">Read policy and terms</Link>.</span>}</span></label>;
        })}
      </div>}

      {serverError && <div className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-red-100">{serverError}</div>}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))} className="rounded-full border border-white/15 px-5 py-3 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Back</button>
        {step < steps.length - 1 ? <button type="button" onClick={next} className="rounded-full bg-[#f2c94c] px-6 py-3 font-semibold text-[#06291c]">Continue</button> : <button type="submit" disabled={!allConsentChecked || form.formState.isSubmitting} className="rounded-full bg-[#008751] px-6 py-3 font-semibold text-white shadow-[0_16px_40px_rgba(0,135,81,.25)] disabled:cursor-not-allowed disabled:opacity-40">{form.formState.isSubmitting ? "Submitting..." : "Submit Voluntary Enrollment"}</button>}
      </div>
    </form>
  </Card>;
}
