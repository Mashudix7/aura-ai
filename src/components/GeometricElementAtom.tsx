"use client";

import { motion } from "framer-motion";

export default function GeometricElementAtom() {
    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center opacity-40 pointer-events-none" style={{ perspective: "1000px" }}>
            <motion.div
                className="relative w-48 h-48 md:w-64 md:h-64"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                    rotateX: [360, 0],
                    rotateY: [0, 360],
                    rotateZ: [0, -180],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* Intersecting squares to form an atomic/crystal structure */}
                {[
                    "rotateY(0deg)",
                    "rotateY(60deg)",
                    "rotateY(120deg)",
                    "rotateX(90deg) rotateY(0deg)",
                ].map((transform, index) => (
                    <div
                        key={index}
                        className="absolute top-0 left-0 w-full h-full border-[1.5px] border-accent/40 bg-accent/[0.01] backdrop-blur-[1px] shadow-[inset_0_0_30px_rgba(255,215,0,0.1),0_0_20px_rgba(255,215,0,0.1)] flex items-center justify-center"
                        style={{ transform, borderRadius: '40px' }}
                    >
                        {/* Inner detail */}
                        <div className="w-16 h-16 rounded-full border border-accent/30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-accent/60 rounded-full" />
                        </div>
                        
                        {/* Corner dots */}
                        <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-accent/60 rounded-full" />
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-accent/60 rounded-full" />
                        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-accent/60 rounded-full" />
                        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-accent/60 rounded-full" />
                    </div>
                ))}

                {/* Inner glowing core */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent/30 rounded-full blur-[20px]"
                    animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0.9, 0.4]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </div>
    );
}
