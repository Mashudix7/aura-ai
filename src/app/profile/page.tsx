"use client";

import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function SettingsPage() {
    const { data: session } = useSession();
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

                    {/* Subscription (Moved to Left Column for balance) */}
                    <FadeIn delay={0.2}>
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-accent uppercase tracking-widest px-1">
                                Subscription
                            </h3>
                            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-accent border border-accent/30 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">
                                            Pro Plan
                                        </span>
                                        <h4 className="text-2xl font-black">
                                            $20.00{" "}
                                            <span className="text-xs text-slate-400 font-normal">
                                                / month
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-400 mb-4">
                                    Next billing date: <span className="font-medium text-slate-200">Oct 12, 2023</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="material-symbols-outlined text-accent text-sm">
                                            check_circle
                                        </span>
                                        Unlimited AI queries
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="material-symbols-outlined text-accent text-sm">
                                            check_circle
                                        </span>
                                        Priority model access
                                    </div>
                                </div>
                                <motion.button
                                    className="w-full bg-white text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="material-symbols-outlined text-lg">star</span>
                                    Manage Plan
                                </motion.button>
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
                                            <option value="aura-pro">Aura Pro 4.0 (Latest)</option>
                                            <option value="aura-light">Aura Light (Fast)</option>
                                            <option value="creative-v2">Creative Canvas V2</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            expand_more
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-1">Aura Pro 4.0 is recommended for complex reasoning and coding tasks.</p>
                                </div>

                                {/* Creativity Slider */}
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-300">
                                            Creativity (Temperature)
                                        </label>
                                        <span className="text-accent text-sm font-mono bg-accent/10 px-3 py-1 rounded-lg border border-accent/20">
                                            0.7
                                        </span>
                                    </div>
                                    <input
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                                        max="100"
                                        min="0"
                                        type="range"
                                        defaultValue="70"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-widest px-1">
                                        <span>Precise</span>
                                        <span>Balanced</span>
                                        <span>Creative</span>
                                    </div>
                                </div>

                                <hr className="border-white/5" />

                                {/* Concise Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400">
                                                notes
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-200">Concise Responses</p>
                                            <p className="text-sm text-slate-500">
                                                Force the AI to output shorter, more direct answers.
                                            </p>
                                        </div>
                                    </div>
                                    <label className="toggle-switch scale-110">
                                        <input type="checkbox" defaultChecked />
                                        <div className="toggle-slider" />
                                    </label>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Security */}
                    <FadeIn delay={0.2}>
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-accent uppercase tracking-widest px-1">
                                Security & Privacy
                            </h3>
                            <StaggerContainer className="glass rounded-2xl divide-y divide-white/5" staggerDelay={0.08} delay={0.2}>
                                <StaggerItem>
                                    <motion.button
                                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                        whileHover={{ x: 6 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-slate-400">
                                                    lock
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-200">Change Password</p>
                                                <p className="text-sm text-slate-500">
                                                    Last updated 3 months ago
                                                </p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-500">
                                            chevron_right
                                        </span>
                                    </motion.button>
                                </StaggerItem>
                                <StaggerItem>
                                    <motion.button
                                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                        whileHover={{ x: 6 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-accent">
                                                    security
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-200">Two-Factor Authentication</p>
                                                <p className="text-sm text-accent font-medium mt-0.5 border border-accent/20 bg-accent/10 inline-block px-2 py-0.5 rounded text-xs">
                                                    Enabled
                                                </p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-500">
                                            chevron_right
                                        </span>
                                    </motion.button>
                                </StaggerItem>
                                <StaggerItem>
                                    <motion.button
                                        className="w-full p-6 flex items-center justify-between hover:bg-red-500/10 transition-colors text-left group"
                                        whileHover={{ x: 6 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                <span className="material-symbols-outlined text-red-500/70 group-hover:text-red-400">
                                                    delete
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-base font-bold group-hover:text-red-400 transition-colors text-slate-300">
                                                    Delete Account
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Permanently remove all your data
                                                </p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-500">
                                            chevron_right
                                        </span>
                                    </motion.button>
                                </StaggerItem>
                            </StaggerContainer>
                        </section>
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
