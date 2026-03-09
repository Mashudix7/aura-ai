"use client";

import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";

const plans = [
    {
        name: "Standard",
        price: "$0",
        period: "/ forever",
        description: "Perfect for exploring the basics of generative intelligence.",
        features: [
            { text: "10 prompts per day", included: true },
            { text: "Basic AI model access", included: true },
            { text: "Priority server access", included: false },
            { text: "File & document uploads", included: false },
        ],
        cta: "Start Free",
    },
    {
        name: "Elite Access",
        price: "$29",
        period: "/ month",
        description: "The ultimate suite for professionals and power users.",
        features: [
            { text: "Unlimited prompts", included: true },
            { text: "Ultra-fast response time", included: true },
            { text: "Advanced file & data uploads", included: true },
            { text: "Priority server access (No wait)", included: true },
            { text: "Latest premium AI models", included: true },
        ],
        cta: "Subscribe with Mayar",
        highlighted: true,
        badge: "Best Value",
    },
];

const paymentMethods = [
    { icon: "qr_code_2", label: "QRIS" },
    { icon: "account_balance_wallet", label: "E-Wallet" },
    { icon: "account_balance", label: "VA Transfer" },
    { icon: "credit_card", label: "Cards" },
];

export default function PricingPage() {
    return (
        <>
            <main className="relative flex-1">
                <Spotlight />

                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center px-4 pt-28 pb-16 relative z-10">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-accent text-xs font-bold tracking-widest uppercase">
                                New Era of Intelligence
                            </span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.15}>
                        <h1 className="text-slate-100 tracking-tight text-5xl md:text-7xl font-black leading-tight mb-6">
                            Upgrade Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">
                                Intelligence
                            </span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Choose the plan that unlocks your full potential and empowers your
                            creative workflow with advanced AI.
                        </p>
                    </FadeIn>
                </div>

                {/* Pricing Cards */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-5xl mx-auto w-full pb-20" staggerDelay={0.15}>
                    {plans.map((plan) => (
                        <StaggerItem key={plan.name}>
                            <PricingCard {...plan} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* Payment Methods */}
                <FadeIn delay={0.2} className="max-w-4xl mx-auto w-full px-4 text-center pb-20">
                    <h4 className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase mb-8">
                        Secure Payments Powered by Mayar
                    </h4>
                    <StaggerContainer className="flex flex-wrap justify-center items-center gap-8" staggerDelay={0.08}>
                        {paymentMethods.map((method) => (
                            <StaggerItem key={method.label}>
                                <div className="flex flex-col items-center gap-1 group cursor-default">
                                    <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-accent transition-colors">
                                        {method.icon}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 uppercase">
                                        {method.label}
                                    </span>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </FadeIn>
            </main>
            <Footer />
        </>
    );
}
