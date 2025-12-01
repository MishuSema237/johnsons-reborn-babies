import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import { BackToTop } from "@/components/layout/back-to-top";
import { CartProvider } from "@/lib/context/cart-context";
import { MainContent } from "@/components/layout/main-content";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://joannasreborns.com"),
  title: {
    default: "Joanna's Reborns | Handcrafted Silicone Reborn Babies",
    template: "%s | Joanna's Reborns",
  },
  description:
    "Discover handcrafted silicone reborn babies, designed with passion and precision. Bring comfort, relief, and healing to your home with our lifelike creations.",
  keywords: [
    "reborn babies",
    "silicone babies",
    "handcrafted dolls",
    "lifelike dolls",
    "collectible dolls",
    "art dolls",
    "silicone reborns",
    "custom reborns",
  ],
  authors: [{ name: "Joanna's Reborns" }],
  creator: "Joanna's Reborns",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Joanna's Reborns | Handcrafted Silicone Reborn Babies",
    description:
      "Handcrafted with love to bring comfort, relief, and healing to hearts grieving the loss of a child or seeking companionship.",
    siteName: "Joanna's Reborns",
    images: [
      {
        url: '/assets/og-logo.jpg',
        width: 1200,
        height: 630,
        alt: "Joanna's Reborns - Lifelike Reborn Dolls",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Joanna's Reborns | Handcrafted Lifelike Dolls",
    description: "Discover our collection of handcrafted, lifelike reborn dolls. Each baby is a unique work of art waiting to be adopted.",
    images: ['/assets/og-logo.jpg'],
    creator: '@joannasreborns',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/assets/baby1.png', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/baby1.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} bg-white text-black antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <MainContent>
              {children}
            </MainContent>
            <SiteFooter />
          </div>
          <BackToTop />
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
