"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormValues } from "@/lib/validations/auth";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
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
            
            // This triggers the green UI
            setIsSuccess(true);
            setError("root", { message: "Login Successful. Redirecting..." });

            // Send user to dashboard after they see the success message
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);

        } catch (error: any) {
            setIsSuccess(false);
            setError("root", { message: "Invalid username or password. Please try again." });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-zinc-900/50 p-10 backdrop-blur-xl"
            >
                {/* Dynamic Message Box: Red for error, Emerald for success */}
                {errors.root && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm ${
                            isSuccess 
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" 
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                    >
                        <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isSuccess ? "bg-emerald-400" : "bg-red-400"}`} />
                        <p>{errors.root.message}</p>
                    </motion.div>
                )}

                <h2 className="text-center text-3xl font-bold tracking-tight text-white">Welcome Back</h2>

                <button 
                    type="button" 
                    className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                    <FcGoogle className="text-2xl transition-transform group-hover:scale-110" />
                    <span className="font-medium tracking-wide">Continue with Google</span>
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-4 text-zinc-500 tracking-widest">Or continue with</span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            {...register("username")}
                            placeholder="Username"
                            className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-indigo-500 transition-all"
                        />
                        {errors.username && <p className="mt-2 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-indigo-500 transition-all"
                        />
                        {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting || isSuccess}
                        className="w-full rounded-xl bg-white p-4 font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition-all"
                    >
                        {isSubmitting ? "Authenticating..." : isSuccess ? "Redirecting..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-zinc-400">
                        Don't have an account?{" "}
                        <Link 
                            href="/signup" 
                            className="text-white font-semibold opacity-100 hover:opacity-70 transition-opacity"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}