import type { Metadata } from "next";
// @ts-ignore
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
    apple: "/pic.png", // This generates the <link rel="apple-touch-icon" ... />
  },
};

export const viewport = {
  themeColor: "#09090b", // This handles the meta tag correctly
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#09090b" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased font-sans">
        {/* font-sans defaults to Arial/Helvetica/system-ui */}
        {children}
      </body>
    </html>
  );
}