"use client";

import Link from "next/link";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import ChatMessage from "@/components/ChatMessage";
import Spotlight from "@/components/Spotlight";
import { FadeIn } from "@/components/AnimationWrappers";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

interface UserUsage {
    tier: string;
    promptCount: number;
    lastPromptDate: string | null;
}

const MODELS = [
    { id: "gemini-2.5-flash", name: "Aura AI 2.5" },
    { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
];

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
    modelName?: string;
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

// Simple client-side cache for API responses to prevent redundant re-fetching
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

export default function ChatPage() {
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const modelDropdownRef = useRef<HTMLDivElement>(null);

    // Image upload state
    const [attachedImages, setAttachedImages] = useState<ImageAttachment[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // User subscription & usage state
    const [usage, setUsage] = useState<UserUsage | null>(null);
    const [isFetchingUsage, setIsFetchingUsage] = useState(true);

    // Chat History state
    const [threads, setThreads] = useState<any[]>([]);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [isLoadingThread, setIsLoadingThread] = useState(false);

    // Default to Standard restrictions unless explicitly Elite Access
    const isStandard = usage?.tier !== "Elite Access";
    const promptsRemaining = isStandard ? Math.max(0, 20 - (usage?.promptCount || 0)) : null;
    const isLimitReached = isStandard && (usage?.promptCount || 0) >= 20;

    // Fetch user usage
    const fetchUsage = useCallback(async (force = false) => {
        if (!session?.user?.id) return;
        const cacheKey = `usage_${session.user.id}`;

        if (!force && apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_TTL_MS) {
            setUsage(apiCache[cacheKey].data);
            if (apiCache[cacheKey].data.tier === "Standard") {
                setSelectedModelId(MODELS[0].id);
            }
            setIsFetchingUsage(false);
            return;
        }

        try {
            const res = await fetch("/api/user/usage");
            if (res.ok) {
                const data = await res.json();
                apiCache[cacheKey] = { data, timestamp: Date.now() };
                setUsage(data);
                if (data.tier === "Standard") {
                    setSelectedModelId(MODELS[0].id); // Force basic model for standard
                }
            } else if (res.status === 401) {
                // Invalid session, trigger logout
                signOut({ callbackUrl: "/login" });
            }
        } catch (error) {
            console.error("Failed to fetch usage:", error);
        } finally {
            setIsFetchingUsage(false);
        }
    }, [session?.user?.id]);

    // Fetch user threads
    const fetchThreads = useCallback(async (force = false) => {
        if (!session?.user?.id) return;
        const cacheKey = `threads_${session.user.id}`;

        if (!force && apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_TTL_MS) {
            setThreads(apiCache[cacheKey].data);
            return;
        }

        try {
            const res = await fetch("/api/chat/threads");
            if (res.ok) {
                const data = await res.json();
                apiCache[cacheKey] = { data, timestamp: Date.now() };
                setThreads(data);
            }
        } catch (error) {
            console.error("Failed to fetch threads:", error);
        }
    }, [session?.user?.id]);

    // Load specific thread UI
    const loadThread = async (id: string) => {
        if (id === currentThreadId) return;
        setIsLoadingThread(true);
        setCurrentThreadId(id);
        try {
            const res = await fetch(`/api/chat/threads/${id}`);
            if (res.ok) {
                const thread = await res.json();
                const loadedMessages = thread.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content || "",
                }));
                setMessages(loadedMessages);
                
                // If on mobile, close sidebar after selecting
                if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                }
            }
        } catch (err) {
            console.error("Failed to load thread:", err);
        } finally {
            setIsLoadingThread(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchUsage();
            fetchThreads();
        } else {
            setIsFetchingUsage(false);
        }
    }, [session?.user, fetchUsage, fetchThreads]);

    // Handle initial prompt from URL query params (e.g. from Tools launch)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const promptParam = params.get("prompt");
            if (promptParam) {
                setInput(promptParam);
                setTimeout(() => textareaRef.current?.focus(), 100);
            }
        }
    }, []);

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

    // Close model dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
                setIsModelDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /**
     * Process files for upload (validate and convert to base64)
     */
    const processFiles = useCallback(
        async (files: FileList | File[]) => {
            if (isStandard) {
                setImageError("File uploads require Elite Access.");
                return;
            }

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

            if (isLimitReached) {
                setImageError("Daily prompt limit reached for Standard tier. Please upgrade.");
                return;
            }

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

            // Create thread if none exists (Auth users only)
            let actualThreadId = currentThreadId;
            if (!actualThreadId && session?.user?.id) {
                try {
                    const threadRes = await fetch("/api/chat/threads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: trimmed ? trimmed.substring(0, 40) : "New Conversation" }),
                    });
                    if (threadRes.ok) {
                        const newThread = await threadRes.json();
                        setCurrentThreadId(newThread.id);
                        actualThreadId = newThread.id;
                        fetchThreads(true); // Refresh list in sidebar
                    }
                } catch (e) {
                    console.error("Error creating thread:", e);
                }
            }

            // Create placeholder AI message
            const aiMessageId = crypto.randomUUID();
            const currentModelName = MODELS.find(m => m.id === selectedModelId)?.name || "Aura AI 2.5";
            setMessages((prev) => [
                ...prev,
                { id: aiMessageId, role: "assistant", content: "", modelName: currentModelName },
            ]);

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        modelId: selectedModelId,
                        threadId: actualThreadId,
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
                                    err instanceof Error ? `⚠️ ${err.message}` : "⚠️ Oops, something went wrong. Please try again.",
                            }
                            : msg
                    )
                );
            } finally {
                setIsLoading(false);
                fetchUsage(true); // Refresh usage after generation
            }
        },
        [input, isLoading, messages, attachedImages, selectedModelId, isLimitReached, fetchUsage, fetchThreads, currentThreadId]
    );

    const handleNewChat = useCallback(() => {
        setCurrentThreadId(null);
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
                                    {MODELS.find(m => m.id === selectedModelId)?.name || "Aura AI 2.5"}
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

                            {/* Render active un-saved session if any */}
                            {currentThreadId === null && messages.length > 0 && (
                                <div className="w-full text-left px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.05] flex flex-col gap-1.5 mb-2">
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
                            )}

                            {/* Render historical threads */}
                            {threads.length > 0 ? (
                                threads.map((thread) => (
                                    <button
                                        key={thread.id}
                                        onClick={() => loadThread(thread.id)}
                                        disabled={isLoadingThread}
                                        className={`w-full text-left px-4 py-3 rounded-2xl flex flex-col gap-1.5 transition-all
                                            ${currentThreadId === thread.id
                                                ? "bg-white/[0.06] border border-white/[0.05]"
                                                : "bg-transparent hover:bg-white/[0.02] border border-transparent hover:border-white/[0.02]"
                                            }`}
                                    >
                                        <span className={`text-sm font-medium truncate w-full flex items-center gap-2 
                                            ${currentThreadId === thread.id ? "text-slate-200" : "text-slate-400"}`}
                                        >
                                            <span className={`material-symbols-outlined text-[14px] 
                                                ${currentThreadId === thread.id ? "text-accent" : "text-slate-500"}`}
                                            >
                                                chat_bubble
                                            </span>
                                            {thread.title}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                currentThreadId === null && messages.length === 0 && (
                                    <div className="px-4 py-6 text-center">
                                        <span className="material-symbols-outlined text-slate-600 text-3xl mb-2 block">forum</span>
                                        <p className="text-xs text-slate-500">Start a conversation to see it here</p>
                                    </div>
                                )
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

                    <div className="mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 relative" ref={modelDropdownRef}>
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-full font-medium text-sm text-slate-200 shadow-lg hover:border-accent/30 hover:bg-white/[0.07] transition-all cursor-pointer"
                        >
                            <span>{MODELS.find(m => m.id === selectedModelId)?.name || "Aura AI 2.5"}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {/* Model Dropdown */}
                        <AnimatePresence>
                            {isModelDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                                >
                                    <div className="p-2 space-y-1">
                                        {MODELS.map((model) => {
                                            const disabled = isStandard && model.id !== "gemini-2.5-flash";
                                            return (
                                                <button
                                                    key={model.id}
                                                    disabled={disabled}
                                                    onClick={() => {
                                                        setSelectedModelId(model.id);
                                                        setIsModelDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
                                                        disabled ? "opacity-50 cursor-not-allowed" :
                                                        selectedModelId === model.id
                                                            ? "bg-accent/15 text-accent"
                                                            : "text-slate-300 hover:bg-white/[0.06]"
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <span className={`material-symbols-outlined text-[18px] ${
                                                            selectedModelId === model.id ? "text-accent" : "text-slate-500 group-hover:text-slate-300"
                                                        }`}>smart_toy</span>
                                                        {model.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {disabled && (
                                                            <span className="material-symbols-outlined text-[14px] text-slate-500">lock</span>
                                                        )}
                                                        {selectedModelId === model.id && (
                                                            <span className="material-symbols-outlined text-accent text-[16px]">check</span>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                        {isStandard && (
                                            <div className="px-3 pt-3 pb-2 mt-2 border-t border-white/10 flex flex-col gap-2">
                                                <span className="text-xs text-slate-400">Upgrade to unlock all premium AI models.</span>
                                                <Link href="/upgrade" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
                                                    Upgrade Now <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                                How can Aura assist your workflow today? Currently using <span className="text-accent font-medium">{MODELS.find(m => m.id === selectedModelId)?.name || "Aura AI 2.5"}</span> for lightning-fast responses.
                            </p>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap justify-center gap-3 mt-6">
                                {[
                                    { icon: "code", text: "Write a React component" },
                                    { icon: "psychology", text: "Explain a concept" },
                                    { icon: "image", text: "Analyze an image", disabled: isStandard },
                                    { icon: "analytics", text: "Analyze this data" },
                                ].map((suggestion) => (
                                    <motion.button
                                        key={suggestion.text}
                                        disabled={suggestion.disabled}
                                        onClick={() => {
                                            if (suggestion.text === "Analyze an image") {
                                                fileInputRef.current?.click();
                                            } else {
                                                setInput(suggestion.text);
                                                textareaRef.current?.focus();
                                            }
                                        }}
                                        title={suggestion.disabled ? "File uploads require Elite Access" : ""}
                                        className={`flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-accent/30 rounded-2xl text-sm text-slate-300 hover:text-slate-100 transition-all group ${suggestion.disabled ? "opacity-50 cursor-not-allowed hover:bg-white/[0.03] hover:border-white/[0.08]" : ""}`}
                                        whileHover={!suggestion.disabled ? { scale: 1.03, y: -2 } : {}}
                                        whileTap={!suggestion.disabled ? { scale: 0.97 } : {}}
                                    >
                                        <span className={`material-symbols-outlined text-[16px] text-slate-500 transition-colors ${!suggestion.disabled && "group-hover:text-accent"}`}>{suggestion.icon}</span>
                                        {suggestion.text}
                                        {suggestion.disabled && <span className="material-symbols-outlined text-[12px] text-slate-500 ml-1">lock</span>}
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
                                modelName={msg.modelName}
                            />
                        );
                    })}

                    {/* Invisible div to scroll to */}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-transparent shrink-0 relative z-20 w-full max-w-4xl mx-auto flex flex-col gap-2">
                    
                    {/* Prompt Limit Warning */}
                    <AnimatePresence>
                        {isStandard && promptsRemaining !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: 10, height: 0 }}
                                className={`flex items-center justify-between px-5 py-2.5 rounded-2xl border backdrop-blur-md text-sm transition-colors ${
                                    isLimitReached 
                                        ? "bg-red-500/10 border-red-500/30 text-red-200" 
                                        : promptsRemaining <= 5 
                                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-200/90" 
                                            : "bg-white/[0.03] border-white/10 text-slate-400"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-[18px]">
                                        {isLimitReached ? "error" : promptsRemaining <= 5 ? "warning" : "info"}
                                    </span>
                                    <span>
                                        {isLimitReached 
                                            ? "You've reached your daily limit of 20 prompts." 
                                            : `You have ${promptsRemaining} prompt${promptsRemaining !== 1 ? 's' : ''} remaining today.`}
                                    </span>
                                </div>
                                <Link href="/upgrade" className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                                    isLimitReached || promptsRemaining <= 5
                                        ? "bg-accent text-background border-accent shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                                        : "border-white/20 hover:border-accent hover:text-accent"
                                }`}>
                                    Upgrade
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                            <div className="flex items-center px-1 relative group/upload">
                                <motion.button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isStandard}
                                    className={`w-[44px] h-[48px] flex items-center justify-center rounded-2xl transition-all ${
                                        isStandard ? "opacity-50 cursor-not-allowed text-slate-500 bg-white/5" :
                                        attachedImages.length > 0
                                        ? "text-accent bg-accent/10"
                                        : "text-slate-400 hover:text-accent hover:bg-accent/10"
                                        }`}
                                    whileHover={!isStandard ? { scale: 1.1 } : {}}
                                    whileTap={!isStandard ? { scale: 0.9 } : {}}
                                >
                                    <span className="material-symbols-outlined text-[22px]">
                                        {attachedImages.length > 0 ? "image" : "attach_file"}
                                    </span>
                                    {isStandard && (
                                        <div className="absolute opacity-0 group-hover/upload:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur border border-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-lg pointer-events-none z-50 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px] text-accent">lock</span>
                                            File uploads require Elite Access
                                        </div>
                                    )}
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
                                    disabled={isLimitReached}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 disabled:text-slate-500 placeholder-slate-500 py-[12px] resize-none max-h-40 min-h-[48px] outline-none text-[15px] leading-relaxed scrollbar-hide"
                                    placeholder={
                                        isLimitReached
                                            ? "Daily limit reached. Please upgrade to continue."
                                            : attachedImages.length > 0
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
                                    disabled={!canSend || isLimitReached || (isLoading && !input.trim() && attachedImages.length === 0)}
                                    className={`w-[44px] h-[48px] flex items-center justify-center rounded-2xl transition-all mb-0 shrink-0 ${canSend && !isLimitReached
                                        ? "bg-accent/10 text-accent hover:bg-accent/20"
                                        : "bg-white/[0.03] text-slate-500 opacity-50 cursor-not-allowed"
                                        }`}
                                    whileHover={canSend && !isLimitReached ? { scale: 1.05 } : {}}
                                    whileTap={canSend && !isLimitReached ? { scale: 0.95 } : {}}
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
                        Powered by {selectedModelId === "gemini-2.5-flash" ? "Gemini" : "OpenRouter"} • {MODELS.find(m => m.id === selectedModelId)?.name || "Aura AI 2.5"}
                    </p>
                </div>
            </main>
        </div>
    );
}
