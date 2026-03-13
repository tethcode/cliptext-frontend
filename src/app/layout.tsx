import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipText AI",
  description: "The ultimate YouTube to Blog tool",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClipText AI",
  },
  icons: {
    // Use your single icon.png as the main favicon
    // (Next.js will generate <link rel="icon" href="/icon.png" ... /> automatically)
    icon: "/icon.png",

    // Use pic.png from /public/ as Apple touch icon
    // (generates <link rel="apple-touch-icon" href="/pic.png" ... />)
    apple: "/pic.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1,  ← commented out – better UX if you allow pinch-zoom on mobile
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* No <head> manual tags needed – Next.js injects everything from metadata + viewport */}
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}