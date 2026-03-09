"use client";

import { motion } from "framer-motion";

interface ChatHistoryCardProps {
    title: string;
    model: string;
    preview: string;
    date: string;
    messageCount: number;
    icon: string;
}

export default function ChatHistoryCard({
    title,
    model,
    preview,
    date,
    messageCount,
    icon,
}: ChatHistoryCardProps) {
    return (
        <motion.div
            className="glass-card rounded-2xl border border-white/10 p-5 flex gap-5 items-start group cursor-pointer relative overflow-hidden"
            whileHover={{
                borderColor: "rgba(255,215,0,0.25)",
                boxShadow: "0 0 25px rgba(255,215,0,0.06)",
                y: -2,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {/* Thumbnail */}
            <div className="w-24 h-20 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-accent/40 text-3xl">
                    {icon}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-100 truncate">{title}</h3>
                    <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20 shrink-0">
                        {model}
                    </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {preview}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                            calendar_today
                        </span>
                        {date}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                            chat_bubble
                        </span>
                        {messageCount} Messages
                    </span>
                </div>
            </div>

            {/* Continue Button */}
            <motion.button
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-accent/15 border border-accent/30 text-accent text-xs font-bold px-3 py-1 rounded-lg"
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.05 }}
            >
                Continue
            </motion.button>
        </motion.div>
    );
}
