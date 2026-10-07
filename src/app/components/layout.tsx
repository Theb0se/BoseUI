import React from "react";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Components Directory — 40 Kinetic React Primitives",
  description:
    "Browse 40 open-source React components engineered with Framer Motion spring physics, Tailwind CSS, and TypeScript.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/components`,
  },
  openGraph: {
    title: `Components Directory · ${SITE_CONFIG.name}`,
    description:
      "Browse 40 open-source React components engineered with Framer Motion spring physics, Tailwind CSS, and TypeScript.",
    url: `${SITE_CONFIG.url}/components`,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Components Directory`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Components Directory · ${SITE_CONFIG.name}`,
    description:
      "Browse 40 open-source React components engineered with Framer Motion spring physics, Tailwind CSS, and TypeScript.",
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
    <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

