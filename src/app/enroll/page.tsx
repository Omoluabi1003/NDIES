import { EnrollmentWizard } from "@/components/enrollment/enrollment-wizard";
import { Card, PageShell, Pill } from "@/components/ui";

export default function EnrollPage() {
  return <PageShell eyebrow="Public voluntary enrollment" title="Nigerians in Diaspora – Enroll Voluntarily & Join the NDIES Database" subtitle="A consent-first public pathway for Nigerians and people of Nigerian descent to add their own data for lawful diaspora engagement, mapping, and national development.">
    <div className="mb-6 flex flex-wrap gap-3"><Pill tone="green">100% Voluntary</Pill><Pill tone="gold">Explicit Opt-In Consent</Pill><Pill>No Scraping</Pill><Pill tone="green">NDPA 2023 Compliant</Pill></div>
    <EnrollmentWizard />
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {[["Secure", "Consent records include version, timestamp, IP note, and withdrawal status for accountability."], ["Encrypted", "Deploy with HTTPS, PostgreSQL encryption at rest, and least-privilege database credentials."], ["User-Controlled Data", "Enrollees can view their profile, update records, and withdraw consent from the dashboard."]].map(([title, text]) => <Card key={title}><h3 className="text-2xl font-semibold text-[#f2c94c]">{title}</h3><p className="mt-3 leading-7 text-slate-300">{text}</p></Card>)}
    </div>
  </PageShell>;
}
