"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormValues } from "@/lib/validations/auth";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post("auth/login/", data);
      localStorage.setItem("cliptext_token", response.data.token);
      setIsSuccess(true);
      setError("root", { message: "Login Successful. Redirecting..." });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      setIsSuccess(false);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Something went wrong. Please try again.";
      setError("root", { message });
    }
  };

  return (
    // 'p-4' provides a safe gutter so the card never touches the screen edges on mobile
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        // Changed p-10 to p-6 for mobile, sm:p-10 for desktop to maximize input space on small phones
        className="w-full max-w-md space-y-6 sm:space-y-8 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-10 backdrop-blur-xl"
      >
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              isSuccess
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {/* Added shrink-0 to prevent the dot from squishing on multi-line errors */}
            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full animate-pulse ${isSuccess ? "bg-emerald-400" : "bg-red-400"}`} />
            <p className="break-words">{errors.root.message}</p>
          </motion.div>
        )}

        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="w-full">
            <input
              {...register("username")}
              placeholder="Username"
              // 'text-base' (16px) is vital: it prevents iOS from zooming in and breaking your layout when tapping inputs
              className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-base text-white outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-500"
            />
            {errors.username && <p className="mt-2 text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="w-full">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-base text-white outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-500"
            />
            {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>}
            <div className="mt-2 text-right">
              <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            disabled={isSubmitting || isSuccess}
            className="w-full rounded-xl bg-white p-4 font-bold text-black hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 transition-all touch-none"
          >
            {isSubmitting ? "Authenticating..." : isSuccess ? "Redirecting..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white font-semibold hover:text-indigo-400 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}