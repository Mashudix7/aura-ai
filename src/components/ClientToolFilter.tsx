"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ToolCard from "@/components/ToolCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";

const categories = ["All", "Analysis", "Coding", "Writing", "Productivity"];

export default function ClientToolFilter({ tools }: { tools: any[] }) {
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
        <>
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
        </>
    );
}
