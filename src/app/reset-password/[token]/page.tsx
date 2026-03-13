"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams(); 
  const token = params.token as string;

  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await api.post("auth/reset-password/", { token, password: data.password });
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Reset password failed.";
      setError("root", { message });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10 text-center backdrop-blur-xl"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-500/20 p-3 text-emerald-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Password Reset Successful</h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-400/80">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-zinc-400 mb-6 text-sm sm:text-base">Enter your new password below.</p>

        {errors.root && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-4 border border-red-500/20 text-center">
            <p className="text-red-400 text-sm">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="New Password"
              // text-base (16px) prevents iOS auto-zoom
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1.5 px-1">{errors.password.message}</p>}
          </div>

          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm New Password"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 px-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white p-4 font-bold text-black hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}