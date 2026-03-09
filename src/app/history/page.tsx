"use client";

import ChatHistoryCard from "@/components/ChatHistoryCard";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { motion } from "framer-motion";

const chats = [
    {
        title: "Quantum Computing Paradox",
        model: "GPT-4 Turbo",
        preview: "Exploring the observer effect in deep space and its implications on multi-dimensional networking...",
        date: "Yesterday",
        messageCount: 24,
        icon: "neurology",
    },
    {
        title: "Rust Architecture Review",
        model: "Claude 3 Opus",
        preview: "Refactoring the microservices communication layer using gRPC and zero-copy deserialization buffers...",
        date: "3 Days Ago",
        messageCount: 112,
        icon: "code",
    },
    {
        title: "UI Design Strategy 2025",
        model: "Aura Pro",
        preview: "Brainstorming the future of glassmorphism and spatial computing interfaces for the next decade...",
        date: "Oct 12, 2024",
        messageCount: 45,
        icon: "palette",
    },
];

export default function HistoryPage() {
    return (
        <main className="relative flex-1 max-w-4xl mx-auto w-full px-6 pt-28 pb-8 space-y-8">
            <Spotlight className="!fixed opacity-40" />

            {/* Search */}
            <FadeIn>
                <section className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">
                            search
                        </span>
                    </div>
                    <input
                        className="w-full h-14 pl-12 pr-4 bg-accent/5 border border-accent/20 rounded-2xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                        placeholder="Search past conversations..."
                        type="text"
                    />
                </section>
            </FadeIn>

            {/* List */}
            <div className="space-y-6">
                <FadeIn delay={0.1}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent/80">
                            Recent Activity
                        </h2>
                        <button className="text-xs font-medium text-slate-500 hover:text-accent transition-colors">
                            Clear All
                        </button>
                    </div>
                </FadeIn>
                <StaggerContainer className="grid gap-4 custom-scrollbar" staggerDelay={0.1}>
                    {chats.map((chat) => (
                        <StaggerItem key={chat.title}>
                            <ChatHistoryCard {...chat} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>

            {/* Load More */}
            <FadeIn delay={0.4} className="flex justify-center pb-24">
                <motion.button
                    className="px-8 py-3 rounded-full border border-accent/30 text-accent font-medium hover:bg-accent/10 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="material-symbols-outlined">history</span>
                    Load Older History
                </motion.button>
            </FadeIn>
        </main>
    );
}
