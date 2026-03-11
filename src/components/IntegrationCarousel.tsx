import { useState, useEffect, useCallback } from "react";
import IntegrationCard from "./IntegrationCard";
import { motion, AnimatePresence } from "framer-motion";

interface IntegrationItem {
    icon: string;
    label: string;
    image: string;
}

interface IntegrationCarouselProps {
    items: IntegrationItem[];
}

export default function IntegrationCarousel({ items }: IntegrationCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            handleNext();
        }, 4000); // Change card every 4 seconds

        return () => clearInterval(timer);
    }, [items.length, isHovered, handleNext]);

    // Create an array to map across with a circular buffer approach based on currentIndex
    const visibleItems = [];
    const itemsCount = items.length;

    for (let i = -2; i <= 2; i++) {
        let index = (currentIndex + i) % itemsCount;
        if (index < 0) {
            index += itemsCount;
        }
        visibleItems.push({
            item: items[index],
            position: i,
            realIndex: index
        });
    }

    return (
        <div
            className="relative w-full h-[400px] flex items-center justify-center overflow-hidden py-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full max-w-7xl flex items-center justify-center h-full">
                <AnimatePresence mode="popLayout">
                    {visibleItems.map((visibleItem, idx) => {
                        const { item, position, realIndex } = visibleItem;

                        // Calculate styles based on position
                        let xOffset = position * 340; // Spacing adjusted
                        let scale = position === 0 ? 1 : (Math.abs(position) === 1 ? 0.75 : 0.6);
                        let opacity = position === 0 ? 1 : (Math.abs(position) === 1 ? 0.5 : 0.15);

                        // Ensure proper stacking order - center is highest, edges are lowest
                        const zIndex = position === 0 ? 30 : (Math.abs(position) === 1 ? 20 : 10);

                        return (
                            <motion.div
                                key={`${item.label}-${realIndex}`} // Use stable key relative to item content
                                className="absolute shrink-0 flex items-center justify-center cursor-pointer"
                                initial={{
                                    x: xOffset + (position > 0 ? 120 : position < 0 ? -120 : 0),
                                    scale: scale * 0.8,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: xOffset,
                                    scale: scale,
                                    opacity: opacity,
                                }}
                                exit={{
                                    x: xOffset + (position < 0 ? -200 : 200), // Slide away further instead of shrinking awkwardly
                                    scale: scale * 0.8,
                                    opacity: 0,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30,
                                    duration: 0.6 // Slightly softer spring
                                }}
                                style={{
                                    zIndex,
                                    filter: position !== 0 ? 'grayscale(70%) brightness(0.5)' : 'drop-shadow(0 0 40px rgba(255,215,0,0.15))',
                                }}
                                onClick={() => {
                                    if (position === 1) handleNext();
                                    if (position === -1) handlePrev();
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);

                                    if (swipe < -swipeConfidenceThreshold) {
                                        handleNext();
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        handlePrev();
                                    }
                                }}
                            >
                                <div className={`w-full h-full flex justify-center items-center ${position !== 0 && "pointer-events-none"}`}>
                                    <IntegrationCard {...item} isActive={position === 0} />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20">
                <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Previous slide"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
            </div>

            <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 z-20">
                <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Next slide"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};
