import { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import InstallPWA from "@/components/InstallPWA";

// This sets the browser tab title and description
export const metadata: Metadata = {
  title: "Dashboard - ClipText AI",
  description: "Transform YouTube videos into blogs",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <div className="relative min-h-screen">
    <DashboardClient>{children}</DashboardClient>
    <InstallPWA />
    </div>
  );
}