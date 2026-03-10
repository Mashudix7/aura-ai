"use client";

import { motion } from "framer-motion";

export default function GeometricElement() {
    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center opacity-40 pointer-events-none" style={{ perspective: "1000px" }}>
            <motion.div
                className="relative w-48 h-48 md:w-64 md:h-64"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* Faces of a geometric 3D cube */}
                {[
                    "rotateY(0deg) translateZ(8rem)",
                    "rotateY(90deg) translateZ(8rem)",
                    "rotateY(180deg) translateZ(8rem)",
                    "rotateY(-90deg) translateZ(8rem)",
                    "rotateX(90deg) translateZ(8rem)",
                    "rotateX(-90deg) translateZ(8rem)",
                ].map((transform, index) => (
                    <div
                        key={index}
                        className="absolute top-0 left-0 w-full h-full border-[1.5px] border-accent/30 bg-accent/[0.02] backdrop-blur-[2px] shadow-[inset_0_0_30px_rgba(255,215,0,0.1),0_0_20px_rgba(255,215,0,0.1)] before:content-[''] before:absolute before:inset-2 before:border before:border-accent/20 before:rounded-sm flex items-center justify-center"
                        style={{ transform }}
                    >
                        {/* Inner cyber/AI detailing */}
                        <div className="w-16 h-16 border rounded-full border-accent/20 flex flex-col items-center justify-center gap-1">
                            <div className="w-1 h-1 bg-accent/40 rounded-full" />
                            <div className="w-full h-[1px] bg-accent/20" />
                            <div className="w-1 h-1 bg-accent/40 rounded-full" />
                        </div>

                        {/* Corner dots */}
                        <div className="absolute top-1 left-1 w-1 h-1 bg-accent/50 rounded-full" />
                        <div className="absolute top-1 right-1 w-1 h-1 bg-accent/50 rounded-full" />
                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-accent/50 rounded-full" />
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-accent/50 rounded-full" />
                    </div>
                ))}

                {/* Inner glowing core */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent/30 rounded-full blur-[20px]"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </div>
    );
}
