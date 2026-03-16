"use client";

import Button from "@/components/Button";
import Spotlight from "@/components/Spotlight";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const FeatureCard = dynamic(() => import("@/components/FeatureCard"), { ssr: false });
const PricingCard = dynamic(() => import("@/components/PricingCard"), { ssr: false });
const IntegrationCarousel = dynamic(() => import("@/components/IntegrationCarousel"));
const Footer = dynamic(() => import("@/components/Footer"));
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const GeometricElement = dynamic(() => import("@/components/GeometricElement"), { ssr: false });
const GeometricElementSphere = dynamic(() => import("@/components/GeometricElementSphere"), { ssr: false });
const GeometricElementAtom = dynamic(() => import("@/components/GeometricElementAtom"), { ssr: false });

const features = [
  {
    icon: "visibility",
    title: "Multimodal Vision",
    description: "Upload images and let Aura AI analyze, extract data, or explain complex visual information instantly.",
  },
  {
    icon: "psychology",
    title: "Elite AI Models",
    description: "Switch seamlessly between Gemini Flash, Step Flash, and Trinity Large to find the perfect intelligence for your task.",
  },
  {
    icon: "bolt",
    title: "Real-Time Streaming",
    description: "Experience blazing-fast responses streamed directly to your screen with our optimized serverless architecture.",
  },
];

const capabilities = [
  { icon: "visibility", label: "Image Analysis", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "code", label: "Code Generation", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "edit_document", label: "Creative Writing", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "data_object", label: "Data Extraction", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "translate", label: "Translation", image: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=400&h=300&auto=format&fit=crop" },
  { icon: "analytics", label: "Logical Reasoning", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=300&auto=format&fit=crop" },
];

const pricingPlans = [
  {
    name: "Standard",
    price: "$0",
    period: "/ forever",
    description: "Perfect for exploring the basics of generative intelligence.",
    features: [
      { text: "20 prompts per day", included: true, icon: "check_circle" },
      { text: "Basic AI model access", included: true, icon: "check_circle" },
      { text: "Priority server access", included: false, icon: "block" },
      { text: "File & document uploads", included: false, icon: "block" },
    ],
    cta: "Start Free",
    href: "/chat",
    highlighted: false,
  },
  {
    name: "Elite Access",
    price: "$29",
    period: "/ month",
    description: "The ultimate suite for professionals and power users.",
    features: [
      { text: "Unlimited prompts", included: true, icon: "stars" },
      { text: "Ultra-fast response time", included: true, icon: "bolt" },
      { text: "Advanced file & data uploads", included: true, icon: "upload_file" },
      { text: "Priority server access (No wait)", included: true, icon: "lan" },
      { text: "Latest premium AI models", included: true, icon: "psychology" },
    ],
    cta: "Subscribe with Mayar",
    href: "/checkout",
    highlighted: true,
    badge: "Best Value"
  },
];

// Deterministic seeded random so particles are stable across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function HomeClient() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Parallax Scroll Values
  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 1000], ["0%", "25%"]);
  const textParallaxY = useTransform(scrollY, [0, 1000], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const previewParallaxY = useTransform(scrollY, [0, 1000], ["0%", "15%"]);
  const geo1ParallaxY = useTransform(scrollY, [0, 1000], ["-50%", "-10%"]);
  const geo2ParallaxY = useTransform(scrollY, [0, 1000], ["-50%", "-90%"]);

  useEffect(() => { setMounted(true); }, []);

  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  const authenticatedPricingPlans = useMemo(() => {
    return pricingPlans.map(plan => {
      if (plan.name === "Elite Access" && !session) {
        return {
          ...plan,
          onClick: () => setAuthOpen(true)
        };
      }
      return plan;
    });
  }, [session, pricingPlans]);

  const particles = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      top: seededRandom(i * 3) * 100,
      left: seededRandom(i * 3 + 1) * 100,
      yMove: -(seededRandom(i * 3 + 2) * 100 + 50),
      xMove: (seededRandom(i * 3 + 3) - 0.5) * 50,
      opacity: seededRandom(i * 3 + 4) * 0.8 + 0.2,
      scale: seededRandom(i * 3 + 5) * 2 + 1,
      duration: seededRandom(i * 3 + 6) * 5 + 5,
      delay: seededRandom(i * 3 + 7) * 5,
    })),
    []);

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
      <section className="relative pt-24 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Dynamic Animated Background */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ y: bgParallaxY, opacity: heroOpacity }}
        >
          {/* Animated Gradients */}
          <motion.div
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-yellow-500/10 blur-[150px]"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />

          {/* Floating Particles - only rendered client-side to avoid hydration mismatch */}
          {mounted && particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/40 rounded-full"
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
              animate={{
                y: [0, p.yMove],
                x: [0, p.xMove],
                opacity: [0, p.opacity, 0],
                scale: [0, p.scale, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* 3D Geometric Art */}
        <motion.div
          className="absolute top-[35%] right-[10%] opacity-60 z-0 pointer-events-none hidden lg:flex"
          style={{ y: geo1ParallaxY }}
        >
          <GeometricElement />
        </motion.div>
        <motion.div
          className="absolute top-[65%] left-[5%] opacity-30 z-0 pointer-events-none hidden lg:flex scale-75"
          style={{ y: geo2ParallaxY }}
        >
          <GeometricElement />
        </motion.div>

        <Spotlight />
        <motion.div
          className="max-w-7xl mx-auto px-4 text-center relative z-10 w-full pt-16 md:pt-24"
          style={{ y: textParallaxY, opacity: heroOpacity }}
        >
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Project Submits for Mayar Competition
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 text-white">
              Experience the Future <br /> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">AURA AI</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
              Aura AI unites elite intelligence models into one seamless hub. Enhance your workflow with multimodal vision, rapid reasoning, and ultimate precision.
            </p>
          </FadeIn>

          <FadeIn delay={0.65}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/chat" className="block w-full" prefetch={false}>
                  <Button variant="primary" className="w-full sm:w-auto px-8 py-4 rounded-xl font-black">
                    Start for Free
                  </Button>
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </motion.div>

        {/* Hero Demo Preview */}
        <motion.div style={{ y: previewParallaxY }}>
          <FadeIn delay={0.8} className="mt-20 max-w-5xl mx-auto px-4">
            <motion.div
              className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              whileHover={{ boxShadow: "0 0 60px rgba(255,215,0,0.10)" }}
            >
              {/* Window chrome */}
              <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] border border-white/10 rounded-full font-medium text-xs text-slate-200 shadow-lg">
                  <span>Aura AI 2.5</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="w-16" />
              </div>

              {/* Chat preview body */}
              <div className="bg-[#0a0a0e] p-6 md:p-8 min-h-[280px] md:min-h-[340px] flex flex-col gap-5 justify-end pb-20">
                {/* User message */}
                <motion.div className="w-full flex justify-end items-end gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.5 }}>
                  <div className="flex flex-col gap-1.5 items-end max-w-[85%]">
                    <div className="bg-background border border-accent/40 rounded-2xl rounded-br-none px-5 py-3 shadow-lg">
                      <p className="leading-relaxed text-[15px] text-slate-100">Write a clean React component for a glassmorphism card.</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mr-1">You •</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-accent/30 bg-accent/20 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-accent text-sm">person</span>
                  </div>
                </motion.div>

                {/* AI response */}
                <motion.div className="w-full flex justify-start items-end gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.5 }}>
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-accent text-sm">smart_toy</span>
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-[85%]">
                    <div className="glass rounded-2xl rounded-bl-none p-5 shadow-lg text-[15px] leading-relaxed text-slate-200">
                      <p className="mb-3">Here is a customizable glassmorphism card component using Tailwind CSS:</p>
                      <pre className="bg-black/50 p-4 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar">
                        <code className="text-slate-300 font-mono text-[13px] leading-snug">
                          {`export default function GlassCard({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  );
}`}
                        </code>
                      </pre>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">Aura AI •</span>
                  </div>
                </motion.div>
              </div>

              {/* Glow overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            </motion.div>
          </FadeIn>
        </motion.div>
      </section>


      {/* Features Section */}
      <section className="pt-32 md:pt-40 pb-24 bg-surface relative overflow-hidden" id="features">
        {/* 3D Geometric Art Variant A - Sphere */}
        <div className="absolute top-10 right-[5%] opacity-60 z-0 pointer-events-none hidden lg:flex scale-90">
            <GeometricElementSphere />
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-20 relative z-10">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.12}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <FeatureCard {...feature} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 relative overflow-hidden bg-background" id="tools">
        {/* Abstract Aura AI Accent Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <FadeIn className="mb-16">
            <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">
              Core Capabilities
            </h2>
            <p className="text-center text-slate-400 mt-4 max-w-2xl mx-auto">From writing code to analyzing complex images, Aura AI handles your most demanding tasks.</p>
          </FadeIn>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full z-10 w-full overflow-hidden">
          <IntegrationCarousel items={capabilities} />
          {/* Edge fades for seamless look */}
          <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative overflow-hidden" id="pricing">
        {/* 3D Geometric Art Variant B - Atom */}
        <div className="absolute bottom-10 left-[5%] opacity-60 z-0 pointer-events-none hidden lg:flex scale-90">
            <GeometricElementAtom />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent">Pricing Plans</h2>
            <p className="text-slate-400">Scalable intelligence for every ambition.</p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" staggerDelay={0.12}>
            {authenticatedPricingPlans.map((plan) => (
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
            <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto text-left flex flex-col gap-6 shadow-2xl relative overflow-hidden">
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
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
