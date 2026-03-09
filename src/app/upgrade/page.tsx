"use client";

import Footer from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";

const paymentMethods = [
    { icon: "qr_code_2", label: "QRIS" },
    { icon: "account_balance_wallet", label: "E-Wallet" },
    { icon: "account_balance", label: "VA Transfer" },
    { icon: "credit_card", label: "Cards" },
];

export default function UpgradePage() {
    return (
        <div className="relative flex flex-col flex-1 bg-[radial-gradient(at_0%_0%,rgba(255,215,0,0.05)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(255,215,0,0.05)_0px,transparent_50%)]">
            <main className="flex-1 w-full max-w-7xl mx-auto pt-24 md:pt-32">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center px-4 pb-16">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-accent text-xs font-bold tracking-widest uppercase">New Era of Intelligence</span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h1 className="text-slate-100 tracking-tight text-5xl md:text-7xl font-black leading-tight mb-6">
                            Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Intelligence</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Choose the plan that unlocks your full potential and empowers your creative workflow with advanced AI.
                        </p>
                    </FadeIn>
                </div>

                {/* Pricing Cards Container */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-5xl mx-auto w-full pb-20" staggerDelay={0.1}>
                    {/* Free Plan */}
                    <StaggerItem>
                        <div className="glass-card flex flex-col gap-8 rounded-2xl p-8 transition-transform hover:scale-[1.02] duration-300 h-full">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Standard</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-100 text-5xl font-black tracking-tight">$0</span>
                                    <span className="text-slate-500 text-lg font-medium">/ forever</span>
                                </div>
                                <p className="text-slate-400 mt-2">Perfect for exploring the basics of generative intelligence.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">check_circle</span>
                                    <span className="font-medium">10 prompts per day</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">check_circle</span>
                                    <span className="font-medium">Basic AI model access</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 line-through decoration-slate-600">
                                    <span className="material-symbols-outlined text-slate-600 text-xl">block</span>
                                    <span className="font-medium">Priority server access</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 line-through decoration-slate-600">
                                    <span className="material-symbols-outlined text-slate-600 text-xl">block</span>
                                    <span className="font-medium">File &amp; document uploads</span>
                                </div>
                            </div>
                            <button onClick={() => window.location.href = '/chat'} className="mt-auto w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-base">
                                Start Free
                            </button>
                        </div>
                    </StaggerItem>

                    {/* Pro Plan */}
                    <StaggerItem>
                        <div className="glass-card pro-glow relative flex flex-col gap-8 rounded-2xl p-8 transition-transform hover:scale-[1.02] duration-300 overflow-hidden h-full">
                            {/* Highlight Glow Background */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[80px] rounded-full"></div>
                            <div className="flex flex-col gap-2 relative">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-accent text-sm font-black uppercase tracking-widest">Elite Access</h3>
                                    <span className="bg-accent text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Best Value</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-100 text-5xl font-black tracking-tight">$29</span>
                                    <span className="text-slate-500 text-lg font-medium">/ month</span>
                                </div>
                                <p className="text-slate-300 mt-2">The ultimate suite for professionals and power users.</p>
                            </div>
                            <div className="space-y-4 relative">
                                <div className="flex items-center gap-3 text-slate-100">
                                    <span className="material-symbols-outlined text-accent font-[100] text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>stars</span>
                                    <span className="font-bold">Unlimited prompts</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">bolt</span>
                                    <span className="font-medium">Ultra-fast response time</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">upload_file</span>
                                    <span className="font-medium">Advanced file &amp; data uploads</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">lan</span>
                                    <span className="font-medium">Priority server access (No wait)</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="material-symbols-outlined text-accent text-xl">psychology</span>
                                    <span className="font-medium">Latest premium AI models</span>
                                </div>
                            </div>
                            <button onClick={() => window.location.href = '/checkout'} className="mt-auto w-full py-4 rounded-xl bg-accent hover:bg-accent/90 text-background font-black transition-all shadow-lg shadow-accent/20 text-base">
                                Subscribe with Mayar
                            </button>
                        </div>
                    </StaggerItem>
                </StaggerContainer>

                {/* Payment Methods */}
                <FadeIn delay={0.4} className="max-w-4xl mx-auto w-full px-4 text-center pb-20">
                    <h4 className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase mb-8">Secure Payments Powered by Mayar</h4>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
                        {paymentMethods.map((method) => (
                            <div key={method.label} className="flex flex-col items-center gap-1 group cursor-default">
                                <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-accent transition-colors">
                                    {method.icon}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 uppercase">
                                    {method.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}
