"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function FeatureCard({
    icon,   
    title,
    description,
}: FeatureCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className="relative group rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden p-[1px] cursor-pointer"
            onMouseMove={handleMouseMove}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            500px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 215, 0, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />
            
            <div className="relative h-full w-full rounded-[23px] bg-gradient-to-b from-accent/[0.03] to-background/80 backdrop-blur-3xl p-6 flex flex-col z-10 border border-t-accent/40 border-l-accent/20 border-r-transparent border-b-transparent transition-all duration-500 group-hover:border-accent/60 group-hover:bg-background/60 shadow-[0_0_15px_rgba(255,215,0,0.05)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <motion.div
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-shadow duration-500"
                        whileHover={{ rotate: 12, scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <span className="material-symbols-outlined text-accent text-2xl group-hover:text-yellow-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-colors">
                            {icon}
                        </span>
                    </motion.div>
                    
                    <div className="h-[2px] flex-1 mx-4 bg-gradient-to-r from-accent/20 to-transparent self-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h3 className="text-xl font-black mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent transition-all duration-300 relative z-10">
                    {title}
                </h3>
                
                <p className="text-sm font-medium text-slate-400/90 leading-relaxed relative z-10 group-hover:text-slate-300 transition-colors duration-300 flex-1">
                    {description}
                </p>
                

            </div>
        </motion.div>
    );
}
