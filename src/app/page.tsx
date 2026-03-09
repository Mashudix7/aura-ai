"use client";

import FeatureCard from "@/components/FeatureCard";
import PricingCard from "@/components/PricingCard";
import IntegrationCard from "@/components/IntegrationCard";
import IntegrationCarousel from "@/components/IntegrationCarousel";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "psychology",
    title: "Neural Synthesis",
    description: "Advanced language models trained on trillion-parameter datasets for human-like reasoning.",
  },
  {
    icon: "monitoring",
    title: "Predictive Logic",
    description: "Anticipate market trends and consumer behavior with 99.9% accuracy using temporal processing.",
  },
  {
    icon: "encrypted",
    title: "Quantum Guard",
    description: "Military-grade encryption securing your proprietary data with next-gen blockchain protocols.",
  },
];

const integrations = [
  { icon: "cloud", label: "Cloud Sync", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "api", label: "REST API", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "database", label: "SQL Engine", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "terminal", label: "CLI Tool", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "token", label: "Web3 Ready", image: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "hub", label: "Multimodal", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=300&auto=format&fit=crop" },
];

const pricingPlans = [
  {
    name: "Standard",
    price: "$0",
    period: "/ forever",
    description: "Perfect for exploring the basics of generative intelligence.",
    features: [
      { text: "10 prompts per day", included: true },
      { text: "Basic AI model access", included: true },
      { text: "Priority server access", included: false },
      { text: "File & document uploads", included: false },
    ],
    cta: "Get Started",
    href: "/chat",
    highlighted: false,
  },
  {
    name: "Elite Access",
    price: "$29",
    period: "/ month",
    description: "The ultimate suite for professionals and power users.",
    features: [
      { text: "Unlimited prompts", included: true },
      { text: "Ultra-fast response time", included: true },
      { text: "Advanced file & data uploads", included: true },
      { text: "Priority server access (No wait)", included: true },
      { text: "Latest premium AI models", included: true },
    ],
    cta: "Subscribe with Mayar",
    href: "/checkout",
  },
];

export default function HomePage() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmittingContact(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });

      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <Spotlight />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Next-Gen Intelligence
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 text-white">
              Experience the Future <br /> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Intelligence</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
              Aura AI blends glassmorphism aesthetics with powerful neural networks
              to elevate your workflow. Premium. Precise. Powerful.
            </p>
          </FadeIn>

          <FadeIn delay={0.65}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/chat" className="block w-full">
                  <Button variant="primary" className="w-full sm:w-auto px-8 py-4 rounded-xl font-black">
                    Start for Free
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 rounded-xl">
                  <span className="material-symbols-outlined">play_circle</span>
                  View Demo
                </Button>
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* Hero Image */}
        <FadeIn delay={0.8} className="mt-20 max-w-5xl mx-auto px-4">
          <motion.div
            className="relative rounded-2xl border border-white/10 overflow-hidden glass-card group"
            whileHover={{ boxShadow: "0 0 40px rgba(255,215,0,0.08)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />
            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-surface to-background flex items-center justify-center">
              {/* Removed smart_toy icon to avoid overlap with play button */}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full glass flex items-center justify-center cursor-pointer border border-accent/30"
                whileHover={{
                  scale: 1.15,
                  boxShadow: "0 0 30px rgba(255,215,0,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined text-accent text-4xl">
                  play_arrow
                </span>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </section>

      {/* Demo Section */}
      <section className="py-24 relative" id="demo">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Interactive Intelligence</h2>
            <p className="text-slate-400">
              Experience how Aura thinks and reacts in real-time.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <motion.div
              className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ boxShadow: "0 0 40px rgba(255,215,0,0.06)" }}
            >
              {/* Window chrome */}
              <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  Aura v4.0 Active
                </div>
              </div>
              {/* Chat Messages */}
              <div className="p-4 md:p-6 space-y-4 md:space-y-6 min-h-[300px] md:min-h-[400px]">
                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent text-sm md:text-base">person</span>
                  </div>
                  <div className="bg-white/5 p-3 md:p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%] md:max-w-[80%]">
                    <p className="text-xs md:text-sm">
                      Optimize my landing page copy for a high-end luxury audience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 flex-row-reverse">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-background text-sm md:text-base">auto_awesome</span>
                  </div>
                  <div className="bg-accent/10 p-3 md:p-4 rounded-2xl rounded-tr-none border border-accent/20 max-w-[85%] md:max-w-[80%] text-right md:text-left">
                    <p className="text-xs md:text-sm text-accent font-bold mb-1 md:mb-2">Aura AI</p>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Analyzing luxury market trends... For a high-end feel, we should
                      focus on exclusivity, heritage, and minimalist aesthetics. I
                      recommend using high-contrast typography and subtle golden accents
                      to symbolize value without being ostentatious.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent text-sm md:text-base">person</span>
                  </div>
                  <div className="bg-white/5 p-3 md:p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%] md:max-w-[80%]">
                    <p className="text-xs md:text-sm">
                      That&apos;s perfect. Generate a color palette for this vision.
                    </p>
                  </div>
                </div>
              </div>
              {/* Input */}
              <div className="p-3 md:p-4 bg-white/5 border-t border-white/10 flex items-center gap-2 md:gap-3">
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-600 outline-none"
                  placeholder="Type your prompt..."
                  type="text"
                  readOnly
                />
                <button className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-background hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <FeatureCard {...feature} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 relative overflow-hidden bg-background" id="tools">
        {/* Abstract Aura AI Accent Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <FadeIn className="mb-16">
            <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">
              Seamless Integration
            </h2>
            <p className="text-center text-slate-400 mt-4 max-w-2xl mx-auto">Connect and sync with your favorite tools seamlessly with the power of Aura AI.</p>
          </FadeIn>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full z-10 w-full overflow-hidden">
          <IntegrationCarousel items={integrations} />
          {/* Edge fades for seamless look */}
          <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Pricing Plans</h2>
            <p className="text-slate-400">Scalable intelligence for every ambition.</p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" staggerDelay={0.12}>
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.name}>
                <PricingCard {...plan} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative overflow-hidden bg-background" id="contact">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Contact Us</h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
              Have questions about Elite Access or need a custom Enterprise solution? Our intelligence division is ready to assist.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-8 max-w-2xl mx-auto text-left flex flex-col gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <AnimatePresence mode="wait">
                {contactSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10 text-center relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 mb-4">
                      <span className="material-symbols-outlined text-green-400 text-3xl">check</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
                    <p className="text-slate-400">Our intelligence division will contact you shortly.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="form"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-400">Name</label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-400">Email</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 relative z-10">
                      <label className="text-sm font-bold text-slate-400">Message</label>
                      <textarea
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/30 transition-colors resize-none"
                        placeholder="How can we help you accelerate?"
                      ></textarea>
                    </div>
                    <button
                      onClick={handleContactSubmit}
                      disabled={isSubmittingContact || !contactForm.name || !contactForm.email || !contactForm.message}
                      className={`w-full py-4 rounded-xl font-black transition-all mt-6 relative z-10 flex items-center justify-center gap-2 ${(!contactForm.name || !contactForm.email || !contactForm.message)
                        ? "bg-white/5 text-slate-500 cursor-not-allowed"
                        : "bg-accent hover:bg-accent/90 text-background shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                        }`}
                    >
                      {isSubmittingContact ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
