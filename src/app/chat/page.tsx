"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import ChatMessage from "@/components/ChatMessage";
import Spotlight from "@/components/Spotlight";
import { FadeIn } from "@/components/AnimationWrappers";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Auto-resize textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 160) + "px";
        }
    }, [input]);

    const handleSubmit = useCallback(
        async (e?: FormEvent) => {
            e?.preventDefault();
            const trimmed = input.trim();
            if (!trimmed || isLoading) return;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content: trimmed,
            };

            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);
            setInput("");
            setIsLoading(true);

            // Create placeholder AI message
            const aiMessageId = crypto.randomUUID();
            setMessages((prev) => [
                ...prev,
                { id: aiMessageId, role: "assistant", content: "" },
            ]);

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: updatedMessages.map((m) => ({
                            role: m.role === "assistant" ? "assistant" : "user",
                            content: m.content,
                        })),
                    }),
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Request failed");
                }

                // Read stream
                const reader = res.body?.getReader();
                if (!reader) throw new Error("No stream available");

                const decoder = new TextDecoder();
                let accumulatedContent = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedContent += chunk;

                    // Update the AI message content progressively
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessageId
                                ? { ...msg, content: accumulatedContent }
                                : msg
                        )
                    );
                }
            } catch (err) {
                console.error("Chat error:", err);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === aiMessageId
                            ? {
                                ...msg,
                                content:
                                    "⚠️ Oops, something went wrong. Please try again.",
                            }
                            : msg
                    )
                );
            } finally {
                setIsLoading(false);
            }
        },
        [input, isLoading, messages]
    );

    const handleNewChat = useCallback(() => {
        setMessages([]);
        setInput("");
    }, []);

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

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

                        {/* New Chat Button */}
                        <button
                            onClick={handleNewChat}
                            className="mb-4 flex items-center gap-3 px-4 py-3 w-64 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-2xl transition-all group"
                        >
                            <span className="material-symbols-outlined text-[18px] text-accent">add</span>
                            <span className="text-sm font-semibold text-accent">New Chat</span>
                        </button>

                        {/* Model Info */}
                        <div className="mb-4 px-4 py-3 w-64 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Active Model</span>
                            </div>
                            <p className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-accent text-[16px]">auto_awesome</span>
                                Gemini 2.5 Flash
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 w-64">
                            <div className="flex items-center justify-between mb-3 px-2 mt-2">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Current Session</span>
                            </div>

                            {messages.length > 0 ? (
                                <div className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.05] flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-200 truncate w-full flex items-center gap-2">
                                        <span className="material-symbols-outlined text-accent text-[14px]">chat_bubble</span>
                                        {messages[0].content.slice(0, 40)}{messages[0].content.length > 40 ? "..." : ""}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{messages.length} messages</span>
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <span className="material-symbols-outlined text-slate-600 text-3xl mb-2 block">forum</span>
                                    <p className="text-xs text-slate-500">Start a conversation to see it here</p>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-black/40 border border-white/[0.08] rounded-3xl relative z-10 overflow-hidden shadow-2xl backdrop-blur-3xl min-w-0 transition-all duration-300">

                {/* Chat Header */}
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

                    {/* Centered Model Badge */}
                    <div className="mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-full font-medium text-sm text-slate-200 shadow-lg">
                            <span className="text-accent material-symbols-outlined text-[18px]">auto_awesome</span>
                            <span>Gemini 2.5 Flash</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={handleNewChat}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all flex items-center justify-center"
                            title="New Chat"
                        >
                            <span className="material-symbols-outlined text-[22px]">edit_square</span>
                        </button>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all flex items-center justify-center"
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
                    {messages.length === 0 ? (
                        <FadeIn delay={0.2} className="text-center space-y-4 mt-12 mb-8">
                            <div className="w-20 h-20 bg-accent/10 rounded-3xl mx-auto flex items-center justify-center mb-6 text-accent border border-accent/20 shadow-[0_0_40px_rgba(255,215,0,0.1)]">
                                <span className="material-symbols-outlined text-4xl">smart_toy</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-100 font-sora tracking-tight">
                                {getGreeting()}{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
                            </h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">
                                How can Aura assist your workflow today? I&apos;m powered by <span className="text-accent font-medium">Gemini 2.5 Flash</span> for lightning-fast responses.
                            </p>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap justify-center gap-3 mt-6">
                                {[
                                    { icon: "code", text: "Write a React component" },
                                    { icon: "psychology", text: "Explain a concept" },
                                    { icon: "edit_note", text: "Help me draft an email" },
                                    { icon: "analytics", text: "Analyze this data" },
                                ].map((suggestion) => (
                                    <motion.button
                                        key={suggestion.text}
                                        onClick={() => {
                                            setInput(suggestion.text);
                                            textareaRef.current?.focus();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-accent/30 rounded-2xl text-sm text-slate-300 hover:text-slate-100 transition-all group"
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <span className="material-symbols-outlined text-[16px] text-slate-500 group-hover:text-accent transition-colors">{suggestion.icon}</span>
                                        {suggestion.text}
                                    </motion.button>
                                ))}
                            </div>
                        </FadeIn>
                    ) : null}

                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={msg.id}
                            role={msg.role === "user" ? "user" : "ai"}
                            content={msg.content}
                            timestamp=""
                            index={i}
                        />
                    ))}

                    {/* Thinking indicator */}
                    {isLoading && messages[messages.length - 1]?.content === "" && (
                        <ChatMessage role="ai" content="" timestamp="" isThinking index={messages.length} />
                    )}

                    {/* Invisible div to scroll to */}
                    <div ref={messagesEndRef} className="h-4" />
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
                                title="Attach file"
                            >
                                <span className="material-symbols-outlined text-[22px]">attach_file</span>
                            </motion.button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            className="flex-1 flex gap-2"
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-3.5 resize-none max-h-40 min-h-[52px] outline-none text-[15px] leading-relaxed relative top-1"
                                placeholder="Message Aura AI..."
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                            />
                            <motion.button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={`mb-1.5 mr-1 p-3 rounded-2xl font-bold flex items-center justify-center transition-colors ${input.trim()
                                    ? "bg-accent text-background hover:bg-[#ffe033]"
                                    : "bg-white/5 text-slate-500 cursor-not-allowed"
                                    }`}
                                whileHover={input.trim() ? { scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.4)" } : {}}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined font-bold animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined font-bold">arrow_upward</span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                    <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em] font-medium opacity-80">
                        Powered by Gemini 2.5 Flash • Aura AI v4.2.0
                    </p>
                </div>
            </main>
        </div>
    );
}
