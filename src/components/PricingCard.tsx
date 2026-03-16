"use client";

import Link from "next/link";

interface PricingFeature {
    text: string;
    included?: boolean;
    icon?: string;
}

interface PricingCardProps {
    name: string;
    price: string;
    period: string;
    description: string;
    features: PricingFeature[];
    cta: string;
    href?: string;
    onClick?: () => void;
    highlighted?: boolean;
    badge?: string;
}

export default function PricingCard({
    name,
    price,
    period,
    description,
    features,
    cta,
    href = "#",
    onClick,
    highlighted = false,
    badge,
}: PricingCardProps) {
    return (
        <div className={`glass-card relative flex flex-col gap-8 rounded-2xl p-8 transition-transform hover:scale-[1.02] duration-300 overflow-hidden h-full ${highlighted ? "pro-glow" : ""}`}>
            {highlighted && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none"></div>
            )}

            <div className="flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                    <h3 className={`${highlighted ? "text-accent font-black" : "text-slate-400 font-bold"} text-sm uppercase tracking-widest`}>
                        {name}
                    </h3>
                    {badge && (
                        <span className="bg-accent text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                            {badge}
                        </span>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-slate-100 text-5xl font-black tracking-tight">{price}</span>
                    <span className="text-slate-500 text-lg font-medium">{period}</span>
                </div>
                <p className={`${highlighted ? "text-slate-300" : "text-slate-400"} mt-2`}>
                    {description}
                </p>
            </div>

            <div className="space-y-4 relative flex-1">
                {features.map((feature, i) => {
                    const isIncluded = feature.included !== false;
                    const iconName = feature.icon || (isIncluded ? "check_circle" : "block");

                    return (
                        <div key={i} className={`flex items-center gap-3 ${isIncluded ? "text-slate-200" : "text-slate-400 line-through decoration-slate-600"}`}>
                            <span
                                className={`material-symbols-outlined text-xl ${isIncluded ? "text-accent" : "text-slate-600"}`}
                                style={isIncluded && iconName === 'stars' ? { fontVariationSettings: '"FILL" 1' } : undefined}
                            >
                                {iconName}
                            </span>
                            <span className={highlighted && i === 0 && iconName === 'stars' ? "font-bold text-slate-100" : "font-medium"}>
                                {feature.text}
                            </span>
                        </div>
                    );
                })}
            </div>

            {onClick ? (
                <div className="mt-auto w-full block relative cursor-pointer" onClick={onClick}>
                    <button className={`w-full py-4 rounded-xl font-bold transition-all text-base ${highlighted ? "bg-accent hover:bg-accent/90 text-background font-black shadow-lg shadow-accent/20" : "border border-white/10 bg-white/5 hover:bg-white/10 text-white"}`}>
                        {cta}
                    </button>
                </div>
            ) : (
                <Link href={href} className="mt-auto w-full block relative">
                    <button className={`w-full py-4 rounded-xl font-bold transition-all text-base ${highlighted ? "bg-accent hover:bg-accent/90 text-background font-black shadow-lg shadow-accent/20" : "border border-white/10 bg-white/5 hover:bg-white/10 text-white"}`}>
                        {cta}
                    </button>
                </Link>
            )}
        </div>
    );
}
