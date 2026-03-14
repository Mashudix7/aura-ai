"use client";

import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [usage, setUsage] = useState<{ tier: string; promptCount: number; lastPromptDate: string | null } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const res = await fetch("/api/user/usage");
                if (res.ok) {
                    const data = await res.json();
                    setUsage(data);
                }
            } catch (err) {
                console.error("Failed to fetch usage:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user) {
            fetchUsage();
        }
    }, [session]);

    const userTier = usage?.tier || "Standard";
    const isElite = userTier === "Elite Access";
    const promptCount = usage?.promptCount || 0;

    return (
        <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 pt-28 pb-24">
            <Spotlight className="!fixed opacity-30" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Left Column: Profile */}
                <div className="lg:col-span-4 space-y-8">
                    <FadeIn>
                        <section className="glass rounded-2xl p-8">
                            <div className="flex flex-col items-center gap-5">
                                <div className="relative">
                                    <motion.div
                                        className="w-32 h-32 rounded-full border-2 border-accent p-1 overflow-hidden relative group"
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,215,0,0.2)" }}
                                    >
                                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                                            {session?.user?.image ? (
                                                <Image src={session.user.image} alt="Profile" fill className="object-cover" sizes="128px" priority />
                                            ) : (
                                                <span className="material-symbols-outlined text-accent text-5xl">person</span>
                                            )}
                                        </div>
                                    </motion.div>
                                    <motion.button
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-background border-4 border-background"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </motion.button>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-1">{session?.user?.name || "User"}</h2>
                                    <p className="text-slate-400">{session?.user?.email || "No email available"}</p>
                                </div>
                                <div className="flex flex-col gap-3 w-full mt-4">
                                    <motion.button
                                        className="w-full bg-accent text-background font-bold py-3 px-4 rounded-xl"
                                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,215,0,0.2)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Edit Profile
                                    </motion.button>
                                    <motion.button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(239,68,68,0.15)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="material-symbols-outlined text-sm">logout</span>
                                        Sign Out
                                    </motion.button>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Subscription */}
                    <FadeIn delay={0.2}>
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-accent uppercase tracking-widest px-1">
                                Subscription Status
                            </h3>
                            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`text-[10px] font-bold ${isElite ? 'text-accent border-accent/30' : 'text-slate-400 border-white/10'} border px-2 py-0.5 rounded-full uppercase mb-2 inline-block`}>
                                            {userTier} Plan
                                        </span>
                                        <h4 className="text-2xl font-black">
                                            {isElite ? "$29.00" : "$0.00"}{" "}
                                            <span className="text-xs text-slate-400 font-normal">
                                                / month
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-400 mb-4">
                                    Usage today: <span className="font-medium text-slate-200">{promptCount} {isElite ? "prompts" : "/ 20 prompts"}</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="material-symbols-outlined text-accent text-sm">
                                            check_circle
                                        </span>
                                        {isElite ? "Unlimited AI queries" : "Standard model access"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="material-symbols-outlined text-accent text-sm">
                                            check_circle
                                        </span>
                                        Secure cloud storage
                                    </div>
                                </div>
                                {!isElite && (
                                    <motion.button
                                        onClick={() => window.location.href = "/upgrade"}
                                        className="w-full bg-accent text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="material-symbols-outlined text-lg">bolt</span>
                                        Upgrade to Elite
                                    </motion.button>
                                )}
                            </div>
                        </section>
                    </FadeIn>
                </div>

                {/* Right Column: Settings */}
                <div className="lg:col-span-8 space-y-8">
                    {/* AI Preferences */}
                    <FadeIn delay={0.1}>
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-accent uppercase tracking-widest px-1">
                                AI Preferences
                            </h3>
                            <div className="glass rounded-2xl p-8 space-y-8">
                                {/* Model Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-300">
                                        Default Model
                                    </label>
                                    <div className="relative">
                                        <select className="glass-input w-full rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-accent/50 focus:outline-none text-slate-100 bg-transparent text-lg">
                                            <option value="gemini-2.5-flash">Aura AI 2.5 (Gemini)</option>
                                            <option value="stepfun" disabled={!isElite}>Step 3.5 Flash (Elite Only)</option>
                                            <option value="arcee" disabled={!isElite}>Trinity Large (Elite Only)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            expand_more
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-1">Aura AI 2.5 is our most balanced and precise model for daily tasks.</p>
                                </div>

                                <hr className="border-white/5" />

                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-accent">info</span>
                                        <p className="text-sm text-slate-400">More settings such as Creativity (Temperature) and Custom Instructions will be available in the next update.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
