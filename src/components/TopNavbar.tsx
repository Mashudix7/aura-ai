"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/tools", label: "Tools" },
    { href: "/upgrade", label: "Upgrade" },
];

export default function TopNavbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            className="sticky top-6 z-50 mx-4 md:mx-auto w-[calc(100%-2rem)] md:max-w-7xl xl:max-w-[95%] rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] text-slate-100"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
            <div className="h-16 px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group ml-1">
                    <span className="text-2xl tracking-tight text-white group-hover:text-accent transition-colors flex items-center">
                        <span className="font-sora font-semibold">Aura </span>
                        <span className="font-sora font-extrabold">AI</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-full px-1.5 py-1 border border-white/[0.06]">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-accent/15 border border-accent/20"
                                        layoutId="activeNavTab"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span
                                    className={`relative z-10 ${isActive ? "text-accent" : "text-slate-400 hover:text-slate-200"
                                        }`}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <motion.button
                        className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors hidden sm:flex"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="material-symbols-outlined text-slate-300">
                            notifications
                        </span>
                    </motion.button>
                    <Link href="/settings">
                        <motion.div
                            className="h-9 w-9 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center"
                            whileHover={{
                                scale: 1.08,
                                boxShadow: "0 0 15px rgba(255,215,0,0.25)",
                                borderColor: "rgba(255,215,0,0.5)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="material-symbols-outlined text-accent text-sm">
                                person
                            </span>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
