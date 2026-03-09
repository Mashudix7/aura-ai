interface IntegrationIconProps {
    icon: string;
    label: string;
}

export default function IntegrationIcon({ icon, label }: IntegrationIconProps) {
    return (
        <div className="aspect-square glass-card rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-accent/50 transition-colors">
            <span className="material-symbols-outlined text-accent text-4xl">
                {icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {label}
            </span>
        </div>
    );
}
