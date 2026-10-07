import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CommandPaletteProvider } from "@/components/layout/CommandPalette";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "BoseUI",
    "Bose UI",
    "Rishabh Bose",
    "React component library",
    "Framer Motion components",
    "Tailwind CSS",
    "shadcn registry",
    "kinetic UI",
    "animated React components",
  ],
  authors: [
    {
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.portfolio,
    },
  ],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  icons: {
    icon: "/boseui-logo.png",
    shortcut: "/boseui-logo.png",
    apple: "/boseui-logo.png",
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} — Crafted by ${SITE_CONFIG.author.name}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Modern React components built to copy and ship`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — Crafted by ${SITE_CONFIG.author.name}`,
    description: SITE_CONFIG.description,
    creator: "@Theb0se",
    images: [SITE_CONFIG.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-black antialiased selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
        <ThemeProvider>
          <CommandPaletteProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
