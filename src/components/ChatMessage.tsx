"use client";

import { motion } from "framer-motion";

interface ChatMessageProps {
    role: "user" | "ai";
    content: string;
    timestamp: string;
    isThinking?: boolean;
    index?: number;
}

export default function ChatMessage({
    role,
    content,
    timestamp,
    isThinking = false,
    index = 0,
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
                    <div className="glass rounded-2xl rounded-bl-none px-5 py-4 shadow-lg">
                        <p className="leading-relaxed text-[15px]">{content}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">
                        Aura AI • {timestamp}
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="w-full flex justify-end items-end gap-3 max-w-3xl"
            initial={animInitial}
            animate={animAnimate}
            transition={animTransition}
        >
            <div className="flex flex-col gap-1.5 items-end max-w-[85%]">
                <div className="bg-background border border-accent/40 rounded-2xl rounded-br-none px-5 py-4 shadow-lg">
                    <p className="leading-relaxed text-[15px] text-slate-100">
                        {content}
                    </p>
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
