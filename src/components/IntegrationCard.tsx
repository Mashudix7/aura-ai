// import { motion } from "framer-motion";
import Image from "next/image";

interface IntegrationCardProps {
    icon: string;
    label: string;
    image: string;
    isActive?: boolean;
}

export default function IntegrationCard({ icon, label, image, isActive = false }: IntegrationCardProps) {
    return (
        <div className={`relative w-[320px] h-[220px] rounded-[24px] overflow-hidden group cursor-pointer border shrink-0 mx-4 transition-all duration-500 shadow-2xl ${isActive ? 'border-accent/40 bg-white/10 scale-105' : 'border-white/10 glass-card bg-black/40'}`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className={`object-cover transition-all duration-700 will-change-transform ${isActive ? 'opacity-70 scale-110' : 'opacity-30 group-hover:opacity-50 scale-100'}`}
                    priority={isActive}
                />
                <div className={`absolute inset-0 z-10 transition-colors duration-500 bg-gradient-to-t ${isActive ? 'from-[#050510] via-[#050510]/60 to-transparent' : 'from-[#050510] via-[#050510]/90 to-black/40'}`} />
            </div>

            {/* Aura AI Accents - glow */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] mix-blend-screen transition-all duration-700 z-10 ${isActive ? 'bg-accent/30 opacity-100' : 'bg-accent/10 opacity-0 group-hover:opacity-50'}`} />
            <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] mix-blend-screen transition-all duration-700 z-10 ${isActive ? 'bg-yellow-500/20 opacity-100' : 'bg-transparent opacity-0'}`} />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-end pb-8 gap-4 px-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 transform ${isActive ? 'bg-accent/20 border-accent glow-strong -translate-y-3' : 'glass border-white/20 group-hover:border-accent/50 group-hover:-translate-y-1'}`}>
                    <span className={`material-symbols-outlined text-3xl transition-all duration-500 ${isActive ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)] scale-110' : 'text-slate-300 group-hover:text-accent group-hover:scale-105'}`}>
                        {icon}
                    </span>
                </div>
                
                <div className="flex flex-col items-center gap-1.5 transform transition-transform duration-500">
                    <span className={`text-base font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-white drop-shadow-md' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {label}
                    </span>
                    {isActive && (
                        <div className="w-8 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
                    )}
                </div>
            </div>
        </div>
    );
}
