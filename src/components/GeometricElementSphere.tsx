"use client";

import { motion } from "framer-motion";

export default function GeometricElementSphere() {
    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center opacity-40 pointer-events-none" style={{ perspective: "1000px" }}>
            <motion.div
                className="relative w-48 h-48 md:w-64 md:h-64"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    rotateZ: [0, 360],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* Rings of the sphere */}
                {[
                    "rotateY(0deg)",
                    "rotateY(45deg)",
                    "rotateY(90deg)",
                    "rotateY(135deg)",
                    "rotateX(90deg)",
                ].map((transform, index) => (
                    <div
                        key={index}
                        className="absolute top-0 left-0 w-full h-full rounded-full border-[1.5px] border-accent/40 bg-accent/[0.01] backdrop-blur-[1px] shadow-[inset_0_0_30px_rgba(255,215,0,0.1),0_0_20px_rgba(255,215,0,0.1)] flex items-center justify-center"
                        style={{ transform }}
                    >
                        {/* Dots on the ring */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent/70 rounded-full" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent/70 rounded-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent/70 rounded-full" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent/70 rounded-full" />
                    </div>
                ))}

                {/* Inner glowing core */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent/30 rounded-full blur-[24px]"
                    animate={{
                        scale: [1, 1.4, 1],
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
