"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimationWrappers";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | null>(null);
    const [usage, setUsage] = useState<{ tier: string } | null>(null);
    const [isFetchingUsage, setIsFetchingUsage] = useState(true);

    useEffect(() => {
        const fetchUsage = async () => {
            if (!session?.user) return;
            try {
                const res = await fetch("/api/user/usage");
                if (res.ok) {
                    const data = await res.json();
                    setUsage(data);
                }
            } catch (err) {
                console.error("Failed to fetch usage:", err);
            } finally {
                setIsFetchingUsage(false);
            }
        };
        if (session?.user) {
            fetchUsage();
        } else if (status === "unauthenticated") {
            setIsFetchingUsage(false);
        }
    }, [session, status]);

    if (status === "loading" || (status === "authenticated" && isFetchingUsage)) {
        return (
            <div className="min-h-screen bg-surface-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined animate-spin text-accent text-4xl">refresh</span>
                    <p className="text-slate-400 text-sm">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        window.location.href = "/login?callbackUrl=/checkout";
        return null;
    }

    const isElite = usage?.tier === "Elite Access";

    if (isElite) {
        return (
            <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
                <div className="glass rounded-3xl p-8 max-w-md w-full text-center border border-white/5 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-accent text-3xl">workspace_premium</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Elite Access Active</h2>
                    <p className="text-slate-400 text-sm">You are already an Elite subscriber. Unlimited intelligence is at your service.</p>
                    <button onClick={() => window.location.href = "/profile"} className="w-full bg-accent text-background font-bold py-3 rounded-xl mt-4">
                        View Profile
                    </button>
                </div>
            </div>
        );
    }

    const paymentMethods = [
        { id: "qris", name: "QRIS", icon: "qr_code_2", type: "Instant" },
        { id: "gopay", name: "GoPay", icon: "account_balance_wallet", type: "E-Wallet" },
        { id: "ovo", name: "OVO", icon: "account_balance_wallet", type: "E-Wallet" },
        { id: "bca", name: "BCA Virtual Account", icon: "account_balance", type: "Bank Transfer" },
        { id: "mandiri", name: "Mandiri Virtual Account", icon: "account_balance", type: "Bank Transfer" },
        { id: "card", name: "Credit/Debit Card", icon: "credit_card", type: "Card" },
    ];

    const handlePayment = async () => {
        if (!selectedMethod) return;
        setIsProcessing(true);
        setPaymentStatus("processing");

        try {
            const res = await fetch("/api/user/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier: "Elite Access" })
            });

            if (res.ok) {
                setPaymentStatus("success");
                // Wait for success animation then redirect
                setTimeout(() => {
                    setIsProcessing(false);
                    // Force a reload to refresh the NextAuth session if needed
                    window.location.href = "/profile";
                }, 2500);
            } else {
                // If it fails (e.g., not logged in), just redirect to login
                setIsProcessing(false);
                window.location.href = "/login";
            }
        } catch (error) {
            setIsProcessing(false);
            setPaymentStatus(null);
            console.error("Payment error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col md:flex-row">
            {/* Left Column: Order Summary */}
            <div className="w-full md:w-[45%] lg:w-[40%] bg-background p-8 md:p-12 lg:p-16 flex flex-col justify-center border-r border-white/5 relative overflow-hidden">
                {/* Abstract background detail */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.05)_0,transparent_50%)] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md mx-auto">
                    <FadeIn>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                <span className="material-symbols-outlined text-background font-black">auto_awesome</span>
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">Aura AI</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Subscribe to Elite Access</h2>
                            <p className="text-slate-400">Unlock unlimited intelligence, priority access, and advanced multimodal features.</p>

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="font-medium">Elite Access Plan (Monthly)</span>
                                    <span className="font-bold text-white">$29.00</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 text-sm">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total due today</span>
                                <span className="text-3xl font-black text-accent">$29.00</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Right Column: Payment Form (Mayar inspired) */}
            <div className="w-full md:w-[55%] lg:w-[60%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-surface-dark">
                <div className="w-full max-w-lg mx-auto">
                    <FadeIn delay={0.2}>
                        <div className="bg-surface rounded-2xl border border-white/5 shadow-2xl p-6 md:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white">Select payment method</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-widest uppercase">
                                    <span className="material-symbols-outlined text-sm">lock</span>
                                    Secure Checkout
                                </div>
                            </div>

                            <StaggerContainer className="space-y-3 mb-8" staggerDelay={0.05}>
                                {paymentMethods.map((method) => (
                                    <StaggerItem key={method.id}>
                                        <label
                                            className={`
                        flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                        ${selectedMethod === method.id
                                                    ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                                    : 'border-white/10 hover:border-white/20 bg-black/20 hover:bg-white/5'}
                      `}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                className="hidden"
                                                value={method.id}
                                                checked={selectedMethod === method.id}
                                                onChange={() => setSelectedMethod(method.id)}
                                            />
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface mr-4 text-slate-300">
                                                <span className="material-symbols-outlined text-xl">{method.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-sm md:text-base">{method.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{method.type}</div>
                                            </div>
                                            <div className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                        ${selectedMethod === method.id ? 'border-accent' : 'border-slate-600'}
                      `}>
                                                {selectedMethod === method.id && (
                                                    <motion.div
                                                        layoutId="radio-indicator"
                                                        className="w-2.5 h-2.5 rounded-full bg-accent"
                                                    />
                                                )}
                                            </div>
                                        </label>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            <div className="pt-6 border-t border-white/5">
                                <button
                                    onClick={handlePayment}
                                    disabled={!selectedMethod || isProcessing}
                                    className={`
                    w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2
                    ${!selectedMethod
                                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                            : 'bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(255,215,0,0.3)]'}
                  `}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay $29.00
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Powered by <strong className="text-slate-300">Mayar</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Payment Processing Modal */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-surface border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Animated glowing background */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/5 to-accent/0 animate-shimmer" />

                            <AnimatePresence mode="wait">
                                {paymentStatus === "processing" ? (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 mb-6 relative flex items-center justify-center">
                                            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                            <span className="material-symbols-outlined text-accent text-3xl">lock</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
                                        <p className="text-slate-400 text-sm">Please do not close this window or tap back.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 mb-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                            <motion.span
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                className="material-symbols-outlined text-green-400 text-4xl"
                                            >
                                                check
                                            </motion.span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                                        <p className="text-slate-400 text-sm mb-6">Welcome to Aura AI Elite Access.</p>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 1.5 }}
                                                className="h-full bg-accent"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
