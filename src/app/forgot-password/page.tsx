"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  username: z.string().min(3, "Enter your username"),
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await api.post("auth/forgot-password/", data);
      setIsSuccess(true);
    } catch (error: any) {
      const message = error.response?.data?.detail || "Could not process request.";
      setError("root", { message });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-white">Check your email</h2>
          <p className="mt-2 text-emerald-400/80">
            If an account exists with the username and email provided, a reset link has been sent.
          </p>
          <div className="mt-6">
            <Link href="/login" className="text-white underline hover:text-emerald-400">
              Back to login
            </Link>
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
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-zinc-400 mb-6">Enter your username and email to reset your password.</p>

        {errors.root && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 border border-red-500/50 text-center">
            <p className="text-red-400 text-sm">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-blue-500/50 transition-all"
          />
          {errors.username && <p className="text-red-400 text-xs">{errors.username.message}</p>}

          <input
            {...register("email")}
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-blue-500/50 transition-all"
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white p-4 font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Submitting..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-white underline hover:text-emerald-400">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
