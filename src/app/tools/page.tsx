"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ToolCard from "@/components/ToolCard";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";

const categories = ["All", "Writing", "Coding", "Productivity", "Creative"];

const tools = [
    {
        icon: "description",
        title: "Resume Generator",
        description: "Craft professional resumes tailored to any job description using AI-driven optimization.",
        category: "Writing",
    },
    {
        icon: "terminal",
        title: "Code Assistant",
        description: "Debug, refactor, and generate code snippets across 20+ programming languages.",
        category: "Coding",
    },
    {
        icon: "analytics",
        title: "Document Analyzer",
        description: "Summarize long PDFs and extract key insights instantly using advanced NLP.",
        category: "Productivity",
    },
    {
        icon: "school",
        title: "Study Assistant",
        description: "Create quizzes, flashcards, and study guides from your lecture notes or textbooks.",
        category: "Productivity",
    },
    {
        icon: "palette",
        title: "Image Generator",
        description: "Transform text prompts into high-resolution artistic imagery using DALL-E 3.",
        category: "Creative",
    },
    {
        icon: "mic",
        title: "Audio Transcriber",
        description: "Convert voice memos and meetings into accurate text with speaker diarization.",
        category: "Productivity",
    },
    {
        icon: "campaign",
        title: "Marketing Copy AI",
        description: "Generate high-converting ads, social posts, and email campaigns in seconds.",
        category: "Writing",
    },
    {
        icon: "business_center",
        title: "Business Planner",
        description: "Detailed market analysis and structured business plans for your startup idea.",
        category: "Productivity",
    },
];

export default function ToolsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = tools.filter((tool) => {
        const matchesCategory = activeFilter === "All" || tool.category === activeFilter;
        const matchesSearch =
            tool.title.toLowerCase().includes(search.toLowerCase()) ||
            tool.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <Spotlight className="!fixed" />

            {/* Hero */}
            <FadeIn className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    Neural Tools
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Powerful AI tools to boost productivity. Integrated neural networks at
                    your fingertips.
                </p>
            </FadeIn>

            {/* Search and Filters */}
            <FadeIn delay={0.15} className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
                <div className="w-full md:max-w-md relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
                        search
                    </span>
                    <input
                        className="glass-input w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-slate-100 placeholder-slate-500"
                        placeholder="Search AI tools..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === cat
                                ? "text-background"
                                : "text-slate-300 hover:bg-white/10 border border-white/10"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeFilter === cat && (
                                <motion.div
                                    className="absolute inset-0 bg-accent rounded-full"
                                    layoutId="activeToolFilter"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </motion.button>
                    ))}
                </div>
            </FadeIn>

            {/* Grid */}
            <StaggerContainer
                key={activeFilter + search}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                staggerDelay={0.06}
            >
                {filtered.map((tool) => (
                    <StaggerItem key={tool.title}>
                        <ToolCard {...tool} />
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {filtered.length === 0 && (
                <FadeIn className="text-center py-20 text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4 block">
                        search_off
                    </span>
                    <p className="text-lg">No tools found matching your criteria.</p>
                </FadeIn>
            )}
        </main>
    );
}
