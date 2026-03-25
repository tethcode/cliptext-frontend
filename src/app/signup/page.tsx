"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useState } from "react";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupValues) => {
    try {
      const response = await api.post("auth/signup/", {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    }catch (error: any) {
    // This will help you see the EXACT error from Django in your UI
    const message =
      error?.response?.data?.error || 
      error?.response?.data?.detail || 
      JSON.stringify(error?.response?.data) || // Catch-all for validation dicts
      "Signup failed. Please try again.";

    setError("root", { message });
  }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          // Optimized p-8 for mobile success state
          className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-12 text-center backdrop-blur-xl"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-500 p-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to ClipText!</h2>
          <p className="mt-2 text-emerald-400/80">Account created successfully.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Redirecting to login...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // Adjusted padding (p-6 sm:p-8) to ensure all 4 inputs fit on smaller mobile screens without excessive scrolling
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-xl"
      >
        <h1 className="mb-1 text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
        <p className="mb-6 sm:mb-8 text-sm sm:text-base text-zinc-400">Join ClipText and start creating.</p>

        {errors.root && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-4 border border-red-500/20">
            <p className="text-sm text-red-400 text-center break-words">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <input
              {...register("username")}
              placeholder="Username"
              // text-base (16px) prevents iOS auto-zoom
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-500"
            />
            {errors.username && <p className="mt-1.5 text-xs text-red-400 px-1">{errors.username.message}</p>}
          </div>

          <div className="w-full">
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-500"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-400 px-1">{errors.email.message}</p>}
          </div>

          <div className="w-full">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-500"
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-400 px-1">{errors.password.message}</p>}
          </div>

          <div className="w-full">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-500"
            />
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400 px-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white p-4 font-bold text-black hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-semibold hover:text-blue-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
