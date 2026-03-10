"use client";

import Link from "next/link";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import ChatMessage from "@/components/ChatMessage";
import Spotlight from "@/components/Spotlight";
import { FadeIn } from "@/components/AnimationWrappers";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
];
const MAX_IMAGE_SIZE_MB = 4;
const MAX_IMAGES = 5;

interface ImageAttachment {
    data: string; // base64
    mimeType: string;
    preview: string; // data URL for preview
    name: string;
    size: number;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    images?: { data: string; mimeType: string }[];
}

/**
 * Convert a File to base64
 */
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(",")[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatPage() {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Image upload state
    const [attachedImages, setAttachedImages] = useState<ImageAttachment[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Clear image error after 4s
    useEffect(() => {
        if (imageError) {
            const timer = setTimeout(() => setImageError(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [imageError]);

    /**
     * Process files for upload (validate and convert to base64)
     */
    const processFiles = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);
            const remainingSlots = MAX_IMAGES - attachedImages.length;

            if (remainingSlots <= 0) {
                setImageError(`Maximum ${MAX_IMAGES} images per message`);
                return;
            }

            const filesToProcess = fileArray.slice(0, remainingSlots);
            const newImages: ImageAttachment[] = [];

            for (const file of filesToProcess) {
                // Validate type
                if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
                    setImageError(
                        `Unsupported format: ${file.type.split("/")[1] || "unknown"}. Use JPEG, PNG, WebP, GIF, or HEIC.`
                    );
                    continue;
                }

                // Validate size
                if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                    setImageError(
                        `"${file.name}" is too large (${formatFileSize(file.size)}). Max ${MAX_IMAGE_SIZE_MB}MB.`
                    );
                    continue;
                }

                try {
                    const base64 = await fileToBase64(file);
                    newImages.push({
                        data: base64,
                        mimeType: file.type,
                        preview: `data:${file.type};base64,${base64}`,
                        name: file.name,
                        size: file.size,
                    });
                } catch {
                    setImageError(`Failed to process "${file.name}"`);
                }
            }

            if (newImages.length > 0) {
                setAttachedImages((prev) => [...prev, ...newImages]);
            }

            if (fileArray.length > remainingSlots) {
                setImageError(
                    `Only ${remainingSlots} more image(s) can be added (max ${MAX_IMAGES})`
                );
            }
        },
        [attachedImages.length]
    );

    /**
     * Remove an attached image
     */
    const removeImage = useCallback((index: number) => {
        setAttachedImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    /**
     * Handle paste event for images
     */
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const imageFiles: File[] = [];
            for (const item of Array.from(items)) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) imageFiles.push(file);
                }
            }

            if (imageFiles.length > 0) {
                e.preventDefault();
                processFiles(imageFiles);
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [processFiles]);

    /**
     * Drag & drop handlers
     */
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFiles(files);
            }
        },
        [processFiles]
    );

    const handleSubmit = useCallback(
        async (e?: FormEvent) => {
            e?.preventDefault();
            const trimmed = input.trim();
            const hasImages = attachedImages.length > 0;

            if ((!trimmed && !hasImages) || isLoading) return;

            // Prepare images for the message
            const messageImages = hasImages
                ? attachedImages.map((img) => ({
                    data: img.data,
                    mimeType: img.mimeType,
                }))
                : undefined;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content: trimmed,
                images: messageImages,
            };

            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);
            setInput("");
            setAttachedImages([]);
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
                            ...(m.images && { images: m.images }),
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
        [input, isLoading, messages, attachedImages]
    );

    const handleNewChat = useCallback(() => {
        setMessages([]);
        setInput("");
        setAttachedImages([]);
    }, []);

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const canSend = input.trim() || attachedImages.length > 0;

    return (
        <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isFullscreen
                ? "fixed inset-0 flex gap-4 lg:gap-6 w-full p-4 md:p-6 z-[60] bg-[#050505]"
                : "fixed inset-x-0 top-[104px] bottom-[80px] lg:bottom-8 flex gap-4 lg:gap-6 max-w-[1600px] mx-auto px-4 md:px-6 z-0"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Spotlight className="!fixed opacity-20 pointer-events-none" />

            {/* Drag & Drop Overlay */}
            <AnimatePresence>
                {isDragOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center gap-4 p-12 rounded-3xl border-2 border-dashed border-accent/60 bg-accent/5"
                        >
                            <motion.span
                                className="material-symbols-outlined text-accent text-6xl"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                upload_file
                            </motion.span>
                            <div className="text-center">
                                <p className="text-xl font-semibold text-white mb-1">
                                    Drop your image here
                                </p>
                                <p className="text-sm text-slate-400">
                                    JPEG, PNG, WebP, GIF, HEIC • Max {MAX_IMAGE_SIZE_MB}MB
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={SUPPORTED_IMAGE_TYPES.join(",")}
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) {
                        processFiles(e.target.files);
                        e.target.value = "";
                    }
                }}
            />

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
                            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 group hover:border-accent/40 transition-all">
                                <span className="material-symbols-outlined text-accent text-[22px] group-hover:scale-110 transition-transform">
                                    auto_awesome
                                </span>
                            </Link>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleNewChat}
                                    className="p-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all"
                                    title="New Chat"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                </button>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 text-slate-400 hover:text-accent hover:bg-white/[0.05] rounded-xl transition-all"
                                    title="Close Sidebar"
                                >
                                    <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                                </button>
                            </div>
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
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-200">
                                    Aura AI 2.5
                                </p>
                                <span className="text-[10px] text-accent/70 bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                                    Multimodal
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1 w-64">
                            <div className="flex items-center justify-between mb-3 px-2 mt-2">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Current Session</span>
                            </div>

                            {messages.length > 0 ? (
                                <div className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.05] flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-200 truncate w-full flex items-center gap-2">
                                        <span className="material-symbols-outlined text-accent text-[14px]">chat_bubble</span>
                                        {messages[0].content
                                            ? `${messages[0].content.slice(0, 40)}${messages[0].content.length > 40 ? "..." : ""}`
                                            : messages[0].images
                                                ? "📷 Image attachment"
                                                : "New chat"}
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

                        {/* Toggle Sidebar Button */}
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

                    <div className="mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-full font-medium text-sm text-slate-200 shadow-lg">
                            <span>Aura AI 2.5</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 shrink-0">
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
                                    { icon: "image", text: "Analyze an image" },
                                    { icon: "analytics", text: "Analyze this data" },
                                ].map((suggestion) => (
                                    <motion.button
                                        key={suggestion.text}
                                        onClick={() => {
                                            if (suggestion.text === "Analyze an image") {
                                                fileInputRef.current?.click();
                                            } else {
                                                setInput(suggestion.text);
                                                textareaRef.current?.focus();
                                            }
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

                    {messages.map((msg, i) => {
                        const isThinking = isLoading && i === messages.length - 1 && msg.role === "assistant" && msg.content === "";

                        return (
                            <ChatMessage
                                key={msg.id}
                                role={msg.role === "user" ? "user" : "ai"}
                                content={msg.content}
                                timestamp=""
                                index={i}
                                isThinking={isThinking}
                                images={msg.images}
                            />
                        );
                    })}

                    {/* Invisible div to scroll to */}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-transparent shrink-0 relative z-20 w-full max-w-4xl mx-auto">
                    {/* Image Error Toast */}
                    <AnimatePresence>
                        {imageError && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mb-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-sm text-red-400"
                            >
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {imageError}
                                <button
                                    onClick={() => setImageError(null)}
                                    className="ml-auto text-red-400/60 hover:text-red-400 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className={`bg-[#050505]/80 backdrop-blur-3xl rounded-[28px] border shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-colors ${isDragOver
                            ? "border-accent/50 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                            : "border-white/[0.1]"
                            }`}
                        whileHover={{ borderColor: "rgba(255,215,0,0.25)" }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Image Preview Strip */}
                        <AnimatePresence>
                            {attachedImages.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto custom-scrollbar">
                                        {attachedImages.map((img, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="relative group shrink-0"
                                            >
                                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-accent/30 transition-colors">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={img.preview}
                                                        alt={img.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* Remove button */}
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 z-10 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center transition-colors shadow-lg opacity-0 group-hover:opacity-100 backdrop-blur-md"
                                                >
                                                    <span className="material-symbols-outlined text-white text-[14px] font-bold">close</span>
                                                </button>
                                                {/* Size label */}
                                                <div className="absolute bottom-1 left-1 right-1 text-center">
                                                    <span className="text-[8px] bg-black/70 text-slate-300 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                        {formatFileSize(img.size)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Add more images button */}
                                        {attachedImages.length < MAX_IMAGES && (
                                            <motion.button
                                                onClick={() => fileInputRef.current?.click()}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-20 h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-accent/30 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-accent transition-all shrink-0"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                                                <span className="text-[9px]">Add more</span>
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input row */}
                        <div className="p-2 flex items-end gap-2">
                            <div className="flex items-center px-1">
                                <motion.button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-[44px] h-[48px] flex items-center justify-center rounded-2xl transition-all ${attachedImages.length > 0
                                        ? "text-accent bg-accent/10"
                                        : "text-slate-400 hover:text-accent hover:bg-accent/10"
                                        }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title={`Attach image (${attachedImages.length}/${MAX_IMAGES})`}
                                >
                                    <span className="material-symbols-outlined text-[22px]">
                                        {attachedImages.length > 0 ? "image" : "attach_file"}
                                    </span>
                                </motion.button>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }}
                                className="flex-1 flex gap-2 items-end"
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 py-[12px] resize-none max-h-40 min-h-[48px] outline-none text-[15px] leading-relaxed scrollbar-hide"
                                    placeholder={
                                        attachedImages.length > 0
                                            ? "Add a message about your image(s)..."
                                            : "Message Aura AI..."
                                    }
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
                                    disabled={isLoading || !canSend}
                                    className={`w-[48px] h-[48px] mr-1 rounded-2xl font-bold flex items-center justify-center transition-colors ${canSend
                                        ? "bg-accent text-background hover:bg-[#ffe033]"
                                        : "bg-white/5 text-slate-500 cursor-not-allowed"
                                        }`}
                                    whileHover={canSend ? { scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.4)" } : {}}
                                    whileTap={canSend ? { scale: 0.95 } : {}}
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined font-bold animate-spin text-[20px]">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined font-bold text-[20px]">arrow_upward</span>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                    <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em] font-medium opacity-80">
                        Powered by Gemini 2.5 Flash • Aura AI v4.2.0
                    </p>
                </div>
            </main>
        </div>
    );
}
