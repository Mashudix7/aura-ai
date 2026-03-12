"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ToolCard from "@/components/ToolCard";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";

const categories = ["All", "Analysis", "Coding", "Writing", "Productivity"];

const tools = [
    {
        icon: "visibility",
        title: "Vision Analyzer",
        description: "Upload images to extract text, understand charts, or get detailed visual descriptions instantly.",
        category: "Analysis",
    },
    {
        icon: "terminal",
        title: "Code Assistant",
        description: "Debug, refactor, and generate clean code snippets across 20+ programming languages.",
        category: "Coding",
    },
    {
        icon: "translate",
        title: "Language Translator",
        description: "Translate complex documents between 50+ languages while preserving original context and tone.",
        category: "Productivity",
    },
    {
        icon: "edit_document",
        title: "Creative Writer",
        description: "Draft high-end emails, compelling blog posts, and marketing copy with precise phrasing.",
        category: "Writing",
    },
    {
        icon: "data_object",
        title: "Data Extractor",
        description: "Turn messy text or images into structured JSON data easily for your applications.",
        category: "Analysis",
    },
    {
        icon: "psychology",
        title: "Logic & Math Solver",
        description: "Tackle complex mathematical problems and logic puzzles with advanced reasoning models.",
        category: "Coding",
    },
    {
        icon: "lightbulb",
        title: "Brainstorm Partner",
        description: "Bounce ideas off elite AI models to overcome creative blocks and find innovative solutions.",
        category: "Writing",
    },
    {
        icon: "design_services",
        title: "UI/UX Consultant",
        description: "Share a screenshot of your app interface and receive expert design feedback and improvements.",
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
            <div className="max-w-4xl mx-auto text-center px-4 mb-16 relative z-10">
                <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-accent text-xs font-bold tracking-widest uppercase">
                            AI Output Generators
                        </span>
                    </div>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <h1 className="text-slate-100 tracking-tight text-5xl md:text-7xl font-black leading-tight mb-6">
                        Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Tools</span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-4">
                        Powerful AI tools to boost productivity. Integrated neural networks at your fingertips.
                    </p>
                </FadeIn>
            </div>

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
                <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
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
