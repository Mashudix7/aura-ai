"use client";

import { motion } from "framer-motion";

interface ToolCardProps {
    icon: string;
    title: string;
    description: string;
    category: string;
}

export default function ToolCard({
    icon,
    title,
    description,
    category,
}: ToolCardProps) {
    return (
        <motion.div
            className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-4 group cursor-pointer relative overflow-hidden"
            whileHover={{
                borderColor: "rgba(255,215,0,0.3)",
                boxShadow: "0 0 30px rgba(255,215,0,0.08)",
                y: -4,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {/* Hover glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between relative z-10">
                <motion.div
                    className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"
                    whileHover={{ rotate: 8 }}
                >
                    <span className="material-symbols-outlined text-accent text-xl">
                        {icon}
                    </span>
                </motion.div>
                <motion.span
                    className="material-symbols-outlined text-slate-600 group-hover:text-accent text-lg transition-colors"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                >
                    north_east
                </motion.span>
            </div>
            <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto relative z-10">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    {category}
                </span>
                <motion.button
                    className="bg-accent text-background text-xs font-bold px-4 py-1.5 rounded-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Launch
                </motion.button>
            </div>
        </motion.div>
    );
}
