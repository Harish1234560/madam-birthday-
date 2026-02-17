import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const surprises = [
  { emoji: '💖', message: "You're absolutely amazing!" },
  { emoji: '🌟', message: "Never stop shining!" },
  { emoji: '🎈', message: "Float above your worries!" },
  { emoji: '🦋', message: "Spread your wings and fly!" },
  { emoji: '🌈', message: "You bring color to my life!" },
  { emoji: '🎭', message: "Life's a party with you!" },
  { emoji: '🚀', message: "To infinity and beyond!" },
  { emoji: '🎪', message: "Every day is an adventure!" },
  { emoji: '🌸', message: "Bloom wherever you're planted!" },
  { emoji: '⭐', message: "You're a star in my sky!" },
  { emoji: '🎵', message: "Your vibe is immaculate!" },
  { emoji: '🍀', message: "Lucky to have you!" },
  { emoji: '🌙', message: "You light up my world!" },
  { emoji: '💫', message: "Magic happens when you're near!" },
  { emoji: '🎀', message: "You're a gift to everyone!" },
];

interface SurpriseButtonProps {
  delay?: number;
}

export default function SurpriseButton({ delay = 0 }: SurpriseButtonProps) {
  const [currentSurprise, setCurrentSurprise] = useState<typeof surprises[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerSurprise = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Random confetti burst
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e57373', '#f06292', '#d4af37', '#ff7f50'],
    });

    // Random surprise
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    setCurrentSurprise(randomSurprise);

    setTimeout(() => {
      setCurrentSurprise(null);
      setIsAnimating(false);
    }, 2000);
  }, [isAnimating]);

  return (
    <div className="relative">
      <motion.button
        className="floating-action flex items-center gap-3 min-w-[140px]"
        onClick={triggerSurprise}
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
        }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          delay: delay,
          duration: 0.6
        }}
        whileHover={{ 
          scale: 1.08,
          y: -8,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="text-2xl"
          animate={isAnimating ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          ✨
        </motion.span>
        <span className="font-medium text-foreground">Surprise!</span>
      </motion.button>

      {/* Floating surprise message */}
      {currentSurprise && (
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 glass-card px-4 py-2 whitespace-nowrap"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
        >
          <span className="text-2xl mr-2">{currentSurprise.emoji}</span>
          <span className="text-foreground">{currentSurprise.message}</span>
        </motion.div>
      )}
    </div>
  );
}
