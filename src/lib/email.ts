export async function sendEnrollmentVerificationEmail({ email, fullName, token, profileId }: { email: string; fullName: string; token: string; profileId: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/enroll/verify?token=${encodeURIComponent(token)}&profileId=${encodeURIComponent(profileId)}`;

  if (!process.env.RESEND_API_KEY) {
    console.info("RESEND_API_KEY is not configured; enrollment verification email not sent.", { email, verifyUrl });
    return { skipped: true, verifyUrl };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "NDIES Enrollment <onboarding@resend.dev>",
      to: email,
      subject: "Verify your voluntary NDIES enrollment",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0b1728"><h1>Verify your NDIES enrollment</h1><p>Dear ${fullName},</p><p>Thank you for voluntarily opting in to the Nigeria Diaspora Intelligence & Engagement System. Please verify your email address to activate your user-controlled profile.</p><p><a href="${verifyUrl}" style="display:inline-block;background:#008751;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Verify my email</a></p><p>This consent-led enrollment is governed by NDPA 2023 principles and can be withdrawn from your dashboard.</p></div>`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Unable to send verification email: ${text}`);
  }

  return response.json();
}
