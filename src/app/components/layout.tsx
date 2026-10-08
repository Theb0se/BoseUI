import React from "react";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Components — React, Tailwind CSS & Framer Motion",
  description:
    "Browse open-source React components built with Framer Motion, Tailwind CSS, and TypeScript. Install with one CLI command or copy the code.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/components`,
  },
  openGraph: {
    title: `Components · ${SITE_CONFIG.name}`,
    description:
      "Browse open-source React components built with Framer Motion, Tailwind CSS, and TypeScript.",
    url: `${SITE_CONFIG.url}/components`,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Components`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Components · ${SITE_CONFIG.name}`,
    description:
      "Browse open-source React components built with Framer Motion, Tailwind CSS, and TypeScript.",
    creator: "@Theb0se",
    images: [SITE_CONFIG.ogImage],
  },
};

export default function ComponentsLayout({
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
