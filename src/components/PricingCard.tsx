"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PricingCardProps {
    name: string;
    price: string;
    period: string;
    description: string;
    features: { text: string; included: boolean }[];
    cta: string;
    href?: string;
    highlighted?: boolean;
    badge?: string;
}

export default function PricingCard({
    name,
    price,
    period,
    description,
    features,
    cta,
    href = "#",
    highlighted = false,
    badge,
}: PricingCardProps) {
    const ButtonComponent = (
        <motion.button
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all text-center block ${highlighted
                ? "bg-accent text-background"
                : "border border-white/15 text-slate-100 hover:bg-white/5"
                }`}
            whileHover={{
                scale: 1.02,
                boxShadow: highlighted ? "0 0 25px rgba(255,215,0,0.3)" : undefined,
            }}
            whileTap={{ scale: 0.98 }}
        >
            {cta}
        </motion.button>
    );

    return (
        <motion.div
            className={`relative rounded-2xl p-8 border flex flex-col h-full ${highlighted
                ? "glass border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-accent/5"
                : "glass border-white/10"
                }`}
            whileHover={{
                borderColor: highlighted
                    ? "rgba(255,215,0,0.6)"
                    : "rgba(255,215,0,0.3)",
                boxShadow: highlighted
                    ? "0 0 40px rgba(255,215,0,0.15)"
                    : "0 0 25px rgba(255,215,0,0.06)",
                y: -4,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {badge && (
                <motion.span
                    className="absolute top-4 right-4 bg-accent text-background text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.5 }}
                >
                    {badge}
                </motion.span>
            )}
            <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-2">
                {name}
            </h3>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black tracking-tight">{price}</span>
                {period && (
                    <span className="text-sm text-slate-400 font-medium">{period}</span>
                )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {description}
            </p>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li
                        key={i}
                        className={`flex items-center gap-2 text-sm ${feature.included
                            ? "text-slate-200"
                            : "text-slate-500 line-through"
                            }`}
                    >
                        <span
                            className={`material-symbols-outlined text-sm ${feature.included ? "text-accent" : "text-slate-600"
                                }`}
                            style={
                                feature.included
                                    ? { fontVariationSettings: "'FILL' 1" }
                                    : undefined
                            }
                        >
                            {feature.included ? "check_circle" : "cancel"}
                        </span>
                        <span className="font-medium">{feature.text}</span>
                    </li>
                ))}
            </ul>
            <Link href={href} className="w-full block">
                {ButtonComponent}
            </Link>
        </motion.div>
    );
}
