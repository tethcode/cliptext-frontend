import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipText AI",
  description: "The ultimate YouTube to Blog tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {/* font-sans defaults to Arial/Helvetica/system-ui */}
        {children}
      </body>
    </html>
  );
}