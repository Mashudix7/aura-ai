"use client";

import { motion } from "framer-motion";

interface SpotlightProps {
    className?: string;
}

export default function Spotlight({ className = "" }: SpotlightProps) {
    return (
        <motion.div
            className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            {/* Central Gaussian glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.04) 35%, transparent 70%)",
                }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {/* Secondary softer ring */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 60%)",
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            />
        </motion.div>
    );
}
