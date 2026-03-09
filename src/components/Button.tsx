import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    children: ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export default function Button({
    variant = "primary",
    children,
    className = "",
    fullWidth = false,
    ...props
}: ButtonProps) {
    const base = "font-bold rounded-xl transition-all flex items-center justify-center gap-2";
    const width = fullWidth ? "w-full" : "";

    const variants = {
        primary:
            "bg-accent text-background px-6 py-3 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-105",
        secondary:
            "glass text-white px-6 py-3 border border-white/10 hover:bg-white/5",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
