import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

const title = "NDIES | Nigeria Diaspora Intelligence & Engagement System";
const description = "GIS, AI, data intelligence, and executive dashboards for Nigeria diaspora engagement.";
const deploymentHost = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
const metadataBase = new URL(deploymentHost.startsWith("http") ? deploymentHost : `https://${deploymentHost}`);

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  icons: {
    icon: [
      { url: "/assets/brand/ndies-icon-compact.png", sizes: "190x175", type: "image/png" },
      { url: "/assets/brand/ndies-app-icon-square.png", sizes: "405x365", type: "image/png" },
    ],
    apple: [{ url: "/assets/brand/ndies-app-icon-square.png", sizes: "405x365", type: "image/png" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "NDIES",
    images: [
      {
        url: "/assets/brand/ndies-wordmark-share.png",
        width: 690,
        height: 200,
        alt: "NDIES logo and Nigeria Diaspora Intelligence & Engagement System wordmark",
      },
      {
        url: "/assets/brand/ndies-global-emblem.png",
        width: 1024,
        height: 1024,
        alt: "NDIES global Nigeria diaspora emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/assets/brand/ndies-wordmark-share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Nav />{children}</body></html>;
}
