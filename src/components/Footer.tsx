import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-2xl">
                        auto_awesome
                    </span>
                    <span className="text-lg font-bold tracking-tighter uppercase">
                        Aura AI
                    </span>
                </div>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Link href="#" className="hover:text-accent transition-colors">
                        Privacy
                    </Link>
                    <Link href="#" className="hover:text-accent transition-colors">
                        Terms
                    </Link>
                    <Link href="/docs" className="hover:text-accent transition-colors">
                        Docs
                    </Link>
                    <Link href="#" className="hover:text-accent transition-colors">
                        Status
                    </Link>
                </div>
                <p className="text-xs text-slate-600">
                    © 2024 Aura Technologies. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
