"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
    { href: "/", icon: "house", label: "Home" },
    { href: "/chat", icon: "chat_bubble", label: "Chat" },
    { href: "/tools", icon: "grid_view", label: "Tools" },
    { href: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            className="lg:hidden fixed bottom-6 left-4 right-4 z-50 rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] px-2 py-3"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        >
            <div className="max-w-md mx-auto flex items-center justify-around h-full">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            prefetch={false}
                            className="relative flex flex-col items-center gap-1 transition-colors px-3 py-1"
                        >
                            {isActive && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-accent" />
                            )}
                            <motion.span
                                className={`material-symbols-outlined text-xl ${isActive ? "text-accent" : "text-slate-500"
                                    }`}
                                style={
                                    isActive
                                        ? { fontVariationSettings: "'FILL' 1" }
                                        : undefined
                                }
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {tab.icon}
                            </motion.span>
                            <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-accent" : "text-slate-500"
                                    }`}
                            >
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
