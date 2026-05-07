import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
export const metadata: Metadata={title:"NDIES | Nigeria Diaspora Intelligence & Engagement System",description:"GIS, AI, data intelligence, and executive dashboards for Nigeria diaspora engagement."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Nav />{children}</body></html>}
