import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

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
  return <DashboardClient>{children}</DashboardClient>;
}