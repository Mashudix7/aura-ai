"use client";

import Link from "next/link";
import { useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import Spotlight from "@/components/Spotlight";
import { FadeIn } from "@/components/AnimationWrappers";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
    {
        role: "ai" as const,
        content:
            "Hello! I'm Aura, your advanced workspace assistant. I can help you analyze documents, generate project requirements, or debug code. What's on your mind?",
        timestamp: "10:42 AM",
    },
    {
        role: "user" as const,
        content:
            "Can you help me analyze the latest project requirements? I need a summary of the key deliverables for the Q4 roadmap.",
        timestamp: "10:44 AM",
    },
];

const historyChats = [
    { id: 1, title: "Q4 Roadmap Analysis", time: "2 hrs ago" },
    { id: 2, title: "Next.js Authentication", time: "Yesterday" },
    { id: 3, title: "Refactoring API routes", time: "Yesterday" },
    { id: 4, title: "Vercel Deployment Issues", time: "3 days ago" },
];

const models = ["Aura GPT", "Smart Mode", "Fast Mode", "Creative Mode"];

export default function ChatPage() {
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isFullscreen
                ? "fixed inset-0 flex gap-4 lg:gap-6 w-full p-4 md:p-6 z-[60] bg-[#050505]"
                : "fixed inset-x-0 top-[104px] bottom-[80px] lg:bottom-8 flex gap-4 lg:gap-6 max-w-[1600px] mx-auto px-4 md:px-6 z-0"
                }`}
        >
            <Spotlight className="!fixed opacity-20 pointer-events-none" />

            {/* Sidebar for History */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0, x: -50 }}
                        animate={{ width: "18rem", opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="hidden lg:flex flex-col shrink-0 bg-black/40 border border-white/[0.08] rounded-3xl p-5 relative z-10 backdrop-blur-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6 px-1 w-64">
                            <Link href="/" className="flex items-center gap-1.5 group">
                                <span className="text-xl tracking-tight text-white group-hover:text-accent transition-colors flex items-center">
                                    <span className="font-sora font-semibold">Aura</span>
                                    <span className="font-sora font-extrabold">AI</span>
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all"
                                title="Close Sidebar"
                            >
                                <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                            </button>
                        </div>

                        {/* Home Button in Sidebar */}
                        <Link href="/" className="mb-4 flex items-center gap-3 px-4 py-3 w-64 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl transition-colors group">
                            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:-translate-x-1 group-hover:text-accent transition-all">arrow_back</span>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100">Back to Home</span>
                        </Link>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 w-64">
                            <div className="flex items-center justify-between mb-3 px-2 mt-2">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Recent</span>
                                <button className="text-slate-500 hover:text-accent transition-colors" title="New Chat">
                                    <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                </button>
                            </div>

                            {historyChats.map((chat) => (
                                <button key={chat.id} className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/[0.06] transition-colors group flex flex-col gap-1.5 border border-transparent hover:border-white/[0.05]">
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 truncate w-full">{chat.title}</span>
                                    <span className="text-[10px] text-slate-500">{chat.time}</span>
                                </button>
                            ))}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-black/40 border border-white/[0.08] rounded-3xl relative z-10 overflow-hidden shadow-2xl backdrop-blur-3xl min-w-0 transition-all duration-300">

                {/* Chat Header with Dropdown */}
                <header className="h-[72px] border-b border-white/[0.05] flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-30 bg-black/20 backdrop-blur-md">
                    {/* Left Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Back Button */}
                        <Link href="/" className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all flex items-center">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>

                        {/* Toggle Sidebar Button (Desktop only, visible when sidebar is closed) */}
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all items-center"
                                title="Open Sidebar"
                            >
                                <span className="material-symbols-outlined">menu_open</span>
                            </button>
                        )}
                    </div>

                    {/* Centered Dropdown */}
                    <div className="relative mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-full transition-colors font-medium text-sm text-slate-200 shadow-lg"
                        >
                            <span className="text-accent material-symbols-outlined text-[18px]">auto_awesome</span>
                            {selectedModel}
                            <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <AnimatePresence>
                            {isModelDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-56 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden py-2"
                                >
                                    {models.map((model) => (
                                        <button
                                            key={model}
                                            onClick={() => {
                                                setSelectedModel(model);
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${selectedModel === model ? "bg-accent/10 text-accent font-medium" : "text-slate-300 hover:bg-white/[0.06]"
                                                }`}
                                        >
                                            {model}
                                            {selectedModel === model && <span className="material-symbols-outlined text-[16px]">check</span>}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Fullscreen Toggle */}
                    <div className="flex justify-end w-10 shrink-0">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 -mr-3 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all flex items-center justify-center"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8 relative z-10 w-full max-w-4xl mx-auto">
                    {/* Welcome */}
                    <FadeIn delay={0.2} className="text-center space-y-2 mb-8 mt-4">
                        <div className="w-16 h-16 bg-accent/10 rounded-3xl mx-auto flex items-center justify-center mb-6 text-accent border border-accent/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                            <span className="material-symbols-outlined text-3xl">smart_toy</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100 font-sora tracking-tight">
                            Good morning, Mashudi
                        </h2>
                        <p className="text-slate-400 text-sm">
                            How can Aura assist your workflow today?
                        </p>
                    </FadeIn>

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <ChatMessage key={i} {...msg} index={i} />
                    ))}

                    {/* Thinking indicator */}
                    <ChatMessage role="ai" content="" timestamp="" isThinking index={messages.length} />
                </div>

                {/* Input Area inside the main container */}
                <div className="p-4 md:p-6 bg-transparent shrink-0 relative z-20 w-full max-w-4xl mx-auto">
                    <motion.div
                        className="bg-[#050505]/80 backdrop-blur-3xl rounded-[28px] p-2.5 border border-white/[0.1] flex items-end gap-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                        whileHover={{ borderColor: "rgba(255,215,0,0.25)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-1 mb-1.5 px-1">
                            <motion.button
                                className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="material-symbols-outlined text-[22px]">attach_file</span>
                            </motion.button>
                            <motion.button
                                className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="material-symbols-outlined text-[22px]">mic</span>
                            </motion.button>
                        </div>
                        <textarea
                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-3.5 resize-none max-h-32 min-h-[52px] outline-none text-[15px] leading-relaxed"
                            placeholder="Message Aura AI..."
                            rows={1}
                        />
                        <motion.button
                            className="mb-1.5 mr-1 p-3 bg-accent text-background rounded-2xl font-bold flex items-center justify-center hover:bg-[#ffe033] transition-colors"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="material-symbols-outlined font-bold">arrow_upward</span>
                        </motion.button>
                    </motion.div>
                    <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em] font-medium opacity-80">
                        Powered by Aura Intelligence Engine • v4.2.0 Premium
                    </p>
                </div>
            </main>
        </div>
    );
}
