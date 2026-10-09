import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/lib/utils";

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blocks | ${SITE_CONFIG.name}`,
    description: "Explore pre-built composable UI blocks and landing sections.",
  };
}

export default async function BlockDetailPage() {
  redirect("/components");
}
