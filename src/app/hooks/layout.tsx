import React from "react";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hooks — Zero-Dependency React & TypeScript Hooks",
  description:
    "Browse copy-paste, SSR-safe React hooks built with strict TypeScript and zero external dependencies.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/hooks`,
  },
  openGraph: {
    title: `Hooks · ${SITE_CONFIG.name}`,
    description:
      "Browse copy-paste, SSR-safe React hooks built with strict TypeScript and zero external dependencies.",
    url: `${SITE_CONFIG.url}/hooks`,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Hooks`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Hooks · ${SITE_CONFIG.name}`,
    description:
      "Browse copy-paste, SSR-safe React hooks built with strict TypeScript and zero external dependencies.",
    creator: "@Theb0se",
    images: [SITE_CONFIG.ogImage],
  },
};

export default function HooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
