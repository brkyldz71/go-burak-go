import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "Go Burak Go | Dijital İçerik Asistanı",
  description:
    "13 ülkeli dünya turuna çıkan Burak Yıldız'ın viral içerik üretim platformu. Trendleri tara, senaryolar yaz, otomatik paylaş!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Go Burak Go",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://goburakgo.com",
    siteName: "Go Burak Go",
    title: "Go Burak Go | Dijital İçerik Asistanı",
    description: "13 ülkeli dünya turuna çıkan Burak Yıldız'ın viral içerik üretim platformu.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Go Burak Go",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Burak Go | Dijital İçerik Asistanı",
    description: "13 ülkeli dünya turuna çıkan Burak Yıldız'ın viral içerik üretim platformu.",
    images: ["/images/hero-bg.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B35",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Go Burak Go" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Go Burak Go" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-512.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-512.png" />
        
        {/* Splash Screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/images/hero-bg.jpg"
          media="(device-width: 375px) and (device-height: 812px)"
        />
      </head>
      <body className="min-h-screen antialiased overscroll-none">
        <PWAProvider />
        {children}
      </body>
    </html>
  );
}
