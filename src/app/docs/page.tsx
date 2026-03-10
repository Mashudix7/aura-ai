"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import Spotlight from "@/components/Spotlight";
import { motion } from "framer-motion";
import Link from "next/link";

const docSections = [
    {
        title: "Getting Started",
        icon: "rocket_launch",
        links: [
            { title: "Introduction", href: "#" },
            { title: "Quick Start Guide", href: "#" },
            { title: "Installation", href: "#" },
        ],
    },
    {
        title: "Features",
        icon: "auto_awesome",
        links: [
            { title: "Neural Chat", href: "#" },
            { type: "badge", badge: "Pro", title: "Image Analysis", href: "#" },
            { title: "Data Analytics", href: "#" },
            { title: "Workflow Automation", href: "#" },
        ],
    },
    {
        title: "API Reference",
        icon: "api",
        links: [
            { title: "Authentication", href: "#" },
            { title: "Endpoints", href: "#" },
            { title: "Rate Limits", href: "#" },
            { title: "Webhooks", href: "#" },
        ],
    },
    {
        title: "Community",
        icon: "group",
        links: [
            { title: "Discord Server", href: "#" },
            { title: "Twitter", href: "#" },
            { title: "GitHub Repository", href: "#" },
        ],
    },
];

export default function DocsPage() {
    return (
        <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <Spotlight className="!fixed opacity-30" />

            {/* Hero */}
            <FadeIn className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">
                    Documentation
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto backdrop-blur-sm">
                    Everything you need to build, integrate, and scale with Aura AI.
                </p>
            </FadeIn>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10 w-full max-w-5xl mx-auto">
                {/* Main Content Area */}
                <div className="flex-1 w-full order-2 lg:order-1">
                    <FadeIn delay={0.1}>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <h2 className="text-3xl font-sora font-semibold text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent text-3xl">lightbulb</span>
                                Introduction
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                Welcome to the official Aura AI documentation. Whether you are building an interactive AI agent or simply trying to streamline your workflow with powerful tools, you are in the right place.
                            </p>
                            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 mb-10 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
                                <h3 className="text-xl font-bold text-accent mb-2">Notice</h3>
                                <p className="text-sm text-slate-300">
                                    Aura AI is currently powered by Gemini 2.5 Flash. We are actively rolling out continuous upgrades. Keep an eye on our changelog for updates on new models.
                                </p>
                            </div>

                            <h3 className="text-2xl font-semibold text-white mt-10 mb-4 border-b border-white/10 pb-2">Quick Links</h3>

                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" staggerDelay={0.06}>
                                <StaggerItem>
                                    <Link href="/chat" className="block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-accent/40 hover:bg-white/[0.05] transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                            <span className="material-symbols-outlined text-accent">chat_bubble</span>
                                        </div>
                                        <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-accent transition-colors">Neural Chat</h4>
                                        <p className="text-sm text-slate-400">Experience lighting-fast conversations powered by Gemini.</p>
                                    </Link>
                                </StaggerItem>
                                <StaggerItem>
                                    <Link href="/tools" className="block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-400/40 hover:bg-white/[0.05] transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4 group-hover:bg-emerald-400/20 transition-colors">
                                            <span className="material-symbols-outlined text-emerald-400">build</span>
                                        </div>
                                        <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">AI Tools</h4>
                                        <p className="text-sm text-slate-400">Access our suite of generative AI tools for productivity.</p>
                                    </Link>
                                </StaggerItem>
                            </StaggerContainer>
                        </div>
                    </FadeIn>
                </div>

                {/* Table of Contents Sidebar */}
                <motion.aside
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full lg:w-72 shrink-0 order-1 lg:order-2"
                >
                    <div className="sticky top-28 bg-black/40 border border-white/[0.06] rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest mb-6">Contents</h3>
                        <nav className="space-y-6">
                            {docSections.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="flex items-center gap-2 text-slate-100 font-medium mb-3">
                                        <span className="material-symbols-outlined text-[18px] text-accent/80">{section.icon}</span>
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-2.5 border-l border-white/10 ml-2.5 pl-4">
                                        {section.links.map((link, lIdx) => (
                                            <li key={lIdx}>
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-slate-400 hover:text-accent transition-colors flex items-center justify-between"
                                                >
                                                    {link.title}
                                                    {link.type === "badge" && (
                                                        <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-md ml-2 border border-accent/20 font-bold uppercase tracking-wider">
                                                            {link.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>
                </motion.aside>
            </div>
        </main>
    );
}
