"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/AnimationWrappers";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to register");
                setIsLoading(false);
                return;
            }

            // Auto sign in after registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Account created, but failed to securely login.");
                setIsLoading(false);
            } else {
                window.location.href = "/chat";
            }
        } catch (err) {
            setError("Server might be unreachable");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <FadeIn>
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent mb-6">
                            <span className="material-symbols-outlined text-background font-black text-2xl">auto_awesome</span>
                        </Link>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create an Account</h1>
                        <p className="text-slate-400">Unlock Elite Access and premium intelligence tools.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-slate-100 hover:bg-white text-surface-dark font-black transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center relative z-10">
                            <p className="text-sm text-slate-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-white font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
