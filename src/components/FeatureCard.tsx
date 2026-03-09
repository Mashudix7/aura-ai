"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function FeatureCard({
    icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <motion.div
            className="glass-card rounded-2xl p-8 border border-white/10 group cursor-default relative overflow-hidden"
            whileHover={{
                borderColor: "rgba(255,215,0,0.3)",
                boxShadow: "0 0 30px rgba(255,215,0,0.08)",
                y: -4,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
                className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 relative z-10"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <span className="material-symbols-outlined text-accent text-2xl">
                    {icon}
                </span>
            </motion.div>
            <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                {description}
            </p>
        </motion.div>
    );
}
