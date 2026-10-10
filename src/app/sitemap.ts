import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/utils";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { BLOG_POSTS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Core static routes
  const routes = [
    "",
    "/components",
    "/docs",
    "/blog",
  ].map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.9,
  }));

  // Dynamic component routes
  const componentRoutes = PULSE_COMPONENTS.map((component) => ({
    url: `${SITE_CONFIG.url}/components/${component.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic blog routes
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...componentRoutes, ...blogRoutes];
}
