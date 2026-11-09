import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Onboardly";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — client onboarding, on autopilot`,
    template: `%s · ${siteName}`,
  },
  description:
    "A done-for-you client onboarding automation: intake, kickoff scheduling, document collection and progress tracking — wired end to end so nothing slips.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: `${siteName} — client onboarding, on autopilot`,
    description:
      "Intake, kickoff, document collection and tracking, automated end to end.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
