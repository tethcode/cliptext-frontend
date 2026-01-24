import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ClipText AI",
  description: "Sign in to your account to start generating blogs.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}