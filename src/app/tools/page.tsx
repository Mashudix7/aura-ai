import Spotlight from "@/components/Spotlight";
import { FadeIn } from "@/components/AnimationWrappers";
import ClientToolFilter from "@/components/ClientToolFilter";

const tools = [
    {
        icon: "visibility",
        title: "Vision Analyzer",
        description: "Upload images to extract text, understand charts, or get detailed visual descriptions instantly.",
        category: "Analysis",
        actionPrompt: "Please analyze the following image and describe what you see in detail. [Upload Image]",
    },
    {
        icon: "terminal",
        title: "Code Assistant",
        description: "Debug, refactor, and generate clean code snippets across 20+ programming languages.",
        category: "Coding",
        actionPrompt: "Help me write a code snippet in [Language] that does [Functionality].",
    },
    {
        icon: "translate",
        title: "Language Translator",
        description: "Translate complex documents between 50+ languages while preserving original context.",
        category: "Productivity",
        actionPrompt: "Translate the following text to [Target Language]:\n\n",
    },
    {
        icon: "edit_document",
        title: "Creative Writer",
        description: "Draft high-end emails, compelling blog posts, and marketing copy with precise phrasing.",
        category: "Writing",
        actionPrompt: "Write a high-end, compelling [Email/Blog Post] about:\n\n",
    },
];

export default function ToolsPage() {
    return (
        <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <Spotlight className="!fixed" />

            {/* Hero */}
            <div className="max-w-4xl mx-auto text-center px-4 mb-16 relative z-10">
                <FadeIn>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-accent text-xs font-bold tracking-widest uppercase">
                            AI Output Generators
                        </span>
                    </div>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <h1 className="text-slate-100 tracking-tight text-5xl md:text-7xl font-black leading-tight mb-6">
                        Aura <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Tools</span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-4">
                        Powerful capabilities to boost productivity. Integrated intelligence at your fingertips.
                    </p>
                </FadeIn>
            </div>

            {/* Search, Filters, and Grid - Client Component */}
            <ClientToolFilter tools={tools} />
        </main>
    );
}
