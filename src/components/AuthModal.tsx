"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialTab = "signin" }: AuthModalProps) {
    const [tab, setTab] = useState<"signin" | "signup">(initialTab);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setName(""); setEmail(""); setPassword(""); setError("");
    };

    const switchTab = (t: "signin" | "signup") => {
        setTab(t);
        resetForm();
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                onClose();
                window.location.reload();
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
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
                setError(data.message || "Failed to register.");
                return;
            }
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) {
                setError("Account created! Please sign in.");
                setTab("signin");
            } else {
                onClose();
                window.location.reload();
            }
        } catch {
            setError("Server might be unreachable. Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        onClick={onClose}
                    >
                        <div
                            className="w-full max-w-md bg-[#0f0f13] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glow line top */}
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                            {/* Header */}
                            <div className="px-8 pt-8 pb-6 text-center relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>

                                <div className="w-12 h-12 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-background text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-1">
                                    {tab === "signin" ? "Welcome Back" : "Create Account"}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {tab === "signin"
                                        ? "Sign in to continue with Aura AI"
                                        : "Unlock the power of elite intelligence"}
                                </p>
                            </div>

                            {/* Tab switcher */}
                            <div className="px-8 mb-6">
                                <div className="flex bg-white/[0.04] border border-white/[0.07] p-1 rounded-xl">
                                    {(["signin", "signup"] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => switchTab(t)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t
                                                ? "bg-accent text-background shadow"
                                                : "text-slate-400 hover:text-slate-200"
                                                }`}
                                        >
                                            {t === "signin" ? "Sign In" : "Sign Up"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="px-8 relative min-h-[340px] pb-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm mb-5 relative z-20"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.form
                                        key={tab}
                                        initial={{ opacity: 0, x: tab === "signin" ? -40 : 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: tab === "signin" ? 40 : -40 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        onSubmit={tab === "signin" ? handleSignIn : handleSignUp}
                                        className="space-y-4 w-full"
                                    >
                                        {tab === "signup" && (
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/40 transition-colors placeholder:text-slate-600"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 mb-1.5 block">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/40 transition-colors placeholder:text-slate-600"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-xs font-bold text-slate-400">Password</label>
                                                {tab === "signin" && (
                                                    <button type="button" className="text-xs text-accent/70 hover:text-accent font-medium">Forgot password?</button>
                                                )}
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={tab === "signup" ? 6 : undefined}
                                                className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/40 transition-colors placeholder:text-slate-600"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-3.5 mt-2 rounded-xl bg-accent hover:bg-accent/90 text-background font-black text-sm transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                                            ) : (
                                                <>
                                                    {tab === "signin" ? "Sign In" : "Create Account"}
                                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                </AnimatePresence>

                                <div className="mt-6 w-full pt-4 border-t border-white/[0.04] relative z-20">
                                    <p className="text-center text-xs text-slate-500">
                                        {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                switchTab(tab === "signin" ? "signup" : "signin")
                                            }}
                                            className="text-accent font-bold hover:underline ml-1"
                                        >
                                            {tab === "signin" ? "Sign Up" : "Sign In"}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
