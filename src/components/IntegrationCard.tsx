// import { motion } from "framer-motion";
import Image from "next/image";

interface IntegrationCardProps {
    icon: string;
    label: string;
    image: string;
}

export default function IntegrationCard({ icon, label, image }: IntegrationCardProps) {
    return (
        <div className="relative w-[300px] h-[200px] rounded-2xl overflow-hidden glass-card group cursor-pointer border border-white/10 shrink-0 mx-4">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 will-change-[opacity]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent z-10" />
            </div>

            {/* Aura AI Accents - glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[50px] mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-end pb-8 gap-3">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center border border-accent/30 group-hover:border-accent/80 group-hover:gold-glow transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-accent text-2xl group-hover:scale-110 transition-transform">
                        {icon}
                    </span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-accent transition-colors">
                    {label}
                </span>
            </div>
        </div>
    );
}
