"use client";

import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useState } from "react";

interface ImageAttachment {
    data: string;
    mimeType: string;
}

interface ChatMessageProps {
    role: "user" | "ai";
    content: string;
    timestamp: string;
    isThinking?: boolean;
    index?: number;
    images?: ImageAttachment[];
}

export default function ChatMessage({
    role,
    content,
    timestamp,
    isThinking = false,
    index = 0,
    images,
}: ChatMessageProps) {
    const animInitial = { opacity: 0, y: 20, scale: 0.95 };
    const animAnimate = { opacity: 1, y: 0, scale: 1 };
    const animTransition = {
        duration: 0.4,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
    };

    if (isThinking) {
        return (
            <motion.div
                className="w-full flex justify-start items-end gap-3 max-w-3xl"
                initial={animInitial}
                animate={animAnimate}
                transition={animTransition}
            >
                <motion.div
                    className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mb-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="material-symbols-outlined text-accent text-sm">
                        smart_toy
                    </span>
                </motion.div>
                <div className="flex flex-col gap-1.5">
                    <motion.div
                        className="glass rounded-2xl rounded-bl-none px-5 py-3 flex items-center gap-3 shadow-lg"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(255,215,0,0)",
                                "0 0 15px rgba(255,215,0,0.1)",
                                "0 0 0px rgba(255,215,0,0)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-accent rounded-full"
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-accent/80 italic">
                            Aura AI is thinking...
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (role === "ai") {
        return (
            <motion.div
                className="w-full flex justify-start items-end gap-3 max-w-3xl"
                initial={animInitial}
                animate={animAnimate}
                transition={animTransition}
            >
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-accent text-sm">
                        smart_toy
                    </span>
                </div>
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                    <div className="glass rounded-2xl rounded-bl-none px-5 py-4 shadow-lg text-[15px] leading-relaxed text-slate-200">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ node, ...props }: any) => <p className="mb-3 last:mb-0" {...props} />,
                                ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                li: ({ node, ...props }: any) => <li className="" {...props} />,
                                strong: ({ node, ...props }: any) => <strong className="font-semibold text-white" {...props} />,
                                a: ({ node, ...props }: any) => <a className="text-accent hover:underline decoration-accent/50 underline-offset-2 transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
                                h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mb-3 mt-5 text-white" {...props} />,
                                h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mb-3 mt-4 text-white" {...props} />,
                                h3: ({ node, ...props }: any) => <h3 className="text-base font-bold mb-2 mt-4 text-white" {...props} />,
                                code: ({ node, inline, ...props }: any) =>
                                    inline ? (
                                        <code className="bg-black/30 px-1.5 py-0.5 rounded-md text-accent/90 font-mono text-[13px] border border-white/5" {...props} />
                                    ) : (
                                        <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto border border-white/10 my-4 custom-scrollbar">
                                            <code className="text-slate-300 font-mono text-[13px] leading-snug" {...props} />
                                        </pre>
                                    ),
                                table: ({ node, ...props }: any) => (
                                    <div className="overflow-x-auto my-4 rounded-xl border border-white/10 bg-black/20">
                                        <table className="w-full text-left text-sm border-collapse" {...props} />
                                    </div>
                                ),
                                th: ({ node, ...props }: any) => <th className="bg-black/40 px-4 py-3 font-medium border-b border-white/10 text-slate-200" {...props} />,
                                td: ({ node, ...props }: any) => <td className="px-4 py-3 border-b border-white/5 last:border-0" {...props} />,
                                blockquote: ({ node, ...props }: any) => <blockquote className="border-l-2 border-accent/50 pl-4 py-1 my-3 text-slate-300 italic bg-accent/5 rounded-r-lg" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">
                        Aura AI • {timestamp}
                    </span>
                </div>
            </motion.div>
        );
    }

    // User message
    return (
        <motion.div
            className="w-full flex justify-end items-end gap-3 max-w-3xl"
            initial={animInitial}
            animate={animAnimate}
            transition={animTransition}
        >
            <div className="flex flex-col gap-1.5 items-end max-w-[85%]">
                <div className="bg-background border border-accent/40 rounded-2xl rounded-br-none px-5 py-4 shadow-lg">
                    {/* Image attachments */}
                    {images && images.length > 0 && (
                        <ImageGrid images={images} />
                    )}
                    {content && (
                        <p className="leading-relaxed text-[15px] text-slate-100">
                            {content}
                        </p>
                    )}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 mr-1">
                    You • {timestamp}
                </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-accent/30 bg-accent/20 flex items-center justify-center shrink-0 mb-1">
                <span className="material-symbols-outlined text-accent text-sm">
                    person
                </span>
            </div>
        </motion.div>
    );
}

/**
 * Image grid component for displaying attached images in messages
 */
function ImageGrid({ images }: { images: ImageAttachment[] }) {
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const gridClass =
        images.length === 1
            ? "grid-cols-1"
            : images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2";

    return (
        <>
            <div className={`grid ${gridClass} gap-2 mb-3`}>
                {images.map((img, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() =>
                            setExpandedImage(`data:${img.mimeType};base64,${img.data}`)
                        }
                        className="relative group overflow-hidden rounded-xl border border-white/10 hover:border-accent/40 transition-all cursor-zoom-in"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`data:${img.mimeType};base64,${img.data}`}
                            alt={`Attachment ${idx + 1}`}
                            className={`w-full object-cover rounded-xl ${images.length === 1 ? "max-h-72" : "max-h-40"
                                }`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl drop-shadow-lg">
                                zoom_in
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Lightbox Modal */}
            {expandedImage && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out"
                    onClick={() => setExpandedImage(null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative max-w-4xl max-h-[85vh]"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={expandedImage}
                            alt="Expanded view"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImage(null);
                            }}
                            className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
                        >
                            <span className="material-symbols-outlined text-white text-[20px]">close</span>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
