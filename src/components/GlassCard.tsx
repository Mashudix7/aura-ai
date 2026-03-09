import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    hover = true,
}: GlassCardProps) {
    return (
        <div
            className={`rounded-2xl ${hover ? "glass-card" : "glass"
                } ${className}`}
        >
            {children}
        </div>
    );
}
