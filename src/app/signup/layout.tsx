import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - ClipText AI",
  description: "Join ClipText AI and transform YouTube videos into content.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}