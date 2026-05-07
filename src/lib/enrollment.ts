import { z } from "zod";

export const CONSENT_VERSION = "NDIES-NDPA-2023-v1.0";
export const PRIVACY_POLICY_URL = "/governance#privacy-policy";
export const TERMS_URL = "/governance#terms";

export const consentStatements = [
  "I voluntarily consent to my personal data being added to the NDIES database.",
  "I understand my data will only be used for lawful diaspora engagement, mapping, and national development purposes.",
  "I can withdraw my consent at any time via the dashboard.",
  "I have read and agree to the NDIES Privacy Policy and Terms (NDPA 2023 compliant).",
] as const;

export const sectors = ["Health", "Tech", "Finance", "Academia", "Engineering", "Public Policy", "Creative Economy", "Entrepreneurship", "Legal", "Agriculture", "Energy", "Other"] as const;

export const enrollmentSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full legal name"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Select a gender option"),
  nigerianIdentityConfirmed: z.literal(true, { errorMap: () => ({ message: "You must confirm Nigerian citizenship or descent" }) }),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a phone number with country code").max(32),
  city: z.string().trim().min(2, "Enter your current city"),
  country: z.string().trim().min(2, "Enter your country of residence"),
  sector: z.enum(sectors).optional().or(z.literal("")),
  currentRole: z.string().trim().max(120).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  skills: z.string().trim().max(500).optional().or(z.literal("")),
  consentPersonalData: z.literal(true),
  consentLawfulUse: z.literal(true),
  consentWithdrawal: z.literal(true),
  consentPolicyTerms: z.literal(true),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

export function splitSkills(value?: string) {
  return (value || "")
    .split(/[;,]/)
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function normalizeSector(sector?: string) {
  if (!sector) return "Other";
  if (sector === "Health") return "Healthcare";
  if (sector === "Tech") return "Technology";
  return sector;
}

export function engagementCategoryForSector(sector: string) {
  if (sector === "Healthcare" || sector === "Health") return "Healthcare Expert";
  if (sector === "Technology" || sector === "Tech") return "Technology Innovator";
  if (sector === "Academia") return "Academic Partner";
  if (sector === "Finance" || sector === "Entrepreneurship") return "Investor";
  if (sector === "Creative Economy") return "Cultural Ambassador";
  if (sector === "Public Policy" || sector === "Legal") return "Policy Influencer";
  return "Skilled Professional";
}

export function approximateCoordinates(country: string) {
  const key = country.toLowerCase();
  if (key.includes("united states") || key.includes("usa")) return { latitude: 39.8283, longitude: -98.5795 };
  if (key.includes("united kingdom") || key.includes("uk")) return { latitude: 55.3781, longitude: -3.436 };
  if (key.includes("canada")) return { latitude: 56.1304, longitude: -106.3468 };
  if (key.includes("germany")) return { latitude: 51.1657, longitude: 10.4515 };
  if (key.includes("uae") || key.includes("emirates")) return { latitude: 23.4241, longitude: 53.8478 };
  if (key.includes("nigeria")) return { latitude: 9.082, longitude: 8.6753 };
  return { latitude: 0, longitude: 0 };
}
