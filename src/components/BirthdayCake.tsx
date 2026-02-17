import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BirthdayCakeProps {
  onBlow: () => void;
  name: string;
}

export default function BirthdayCake({ onBlow, name }: BirthdayCakeProps) {
  const [candleLit, setCandleLit] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);

  const triggerConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;

    const colors = ['#e57373', '#f06292', '#d4af37', '#ff7f50', '#64b5f6'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Big burst in the center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors
    });
  };

  const handleBlowCandle = () => {
    if (!candleLit) return;
    
    setIsBlowing(true);
    
    setTimeout(() => {
      setCandleLit(false);
      setIsBlowing(false);
      triggerConfetti();
      
      setTimeout(() => {
        setShowMessage(true);
        onBlow();
      }, 500);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Cake container */}
      <motion.div
        className="relative cursor-pointer select-none"
        onClick={handleBlowCandle}
        whileHover={{ scale: candleLit ? 1.02 : 1 }}
        whileTap={{ scale: candleLit ? 0.98 : 1 }}
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          delay: 0.5,
          duration: 1 
        }}
      >
        {/* Cake SVG */}
        <svg 
          width="200" 
          height="180" 
          viewBox="0 0 200 180" 
          className="drop-shadow-2xl"
        >
          {/* Plate */}
          <ellipse cx="100" cy="170" rx="95" ry="10" fill="#c9a85c" opacity="0.8" />
          
          {/* Bottom layer */}
          <rect x="20" y="120" width="160" height="50" rx="8" fill="#f8b4b4" />
          <rect x="20" y="120" width="160" height="10" rx="4" fill="#fcd5d5" />
          
          {/* Middle layer */}
          <rect x="35" y="80" width="130" height="45" rx="6" fill="#fbbf24" />
          <rect x="35" y="80" width="130" height="8" rx="3" fill="#fcd34d" />
          
          {/* Top layer */}
          <rect x="50" y="50" width="100" height="35" rx="5" fill="#f472b6" />
          <rect x="50" y="50" width="100" height="6" rx="3" fill="#f9a8d4" />
          
          {/* Frosting drips */}
          {[60, 80, 100, 120, 140].map((x, i) => (
            <ellipse key={i} cx={x} cy="85" rx="8" ry="12" fill="#fcd34d" />
          ))}
          {[40, 70, 100, 130, 160].map((x, i) => (
            <ellipse key={i} cx={x} cy="125" rx="10" ry="15" fill="#fcd5d5" />
          ))}
          
          {/* Decorative cherries */}
          <circle cx="65" cy="45" r="8" fill="#ef4444" />
          <circle cx="100" cy="42" r="8" fill="#ef4444" />
          <circle cx="135" cy="45" r="8" fill="#ef4444" />
          <circle cx="65" cy="43" r="2" fill="#fca5a5" />
          <circle cx="100" cy="40" r="2" fill="#fca5a5" />
          <circle cx="135" cy="43" r="2" fill="#fca5a5" />
        </svg>

        {/* Candles */}
        <div className="absolute top-[15px] left-1/2 -translate-x-1/2 flex gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              {/* Candle stick */}
              <div 
                className="w-3 h-10 rounded-t-full"
                style={{
                  background: 'linear-gradient(90deg, #fbbf24 0%, #fcd34d 50%, #fbbf24 100%)',
                }}
              />
              {/* Wick */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-800" />
              
              {/* Flame */}
              <AnimatePresence>
                {candleLit && (
                  <motion.div
                    className="flame -top-10 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0,
                      transition: { duration: 0.3 }
                    }}
                    animate={isBlowing ? {
                      scaleX: [1, 1.5, 0.5, 1.2, 0],
                      scaleY: [1, 0.8, 1.2, 0.6, 0],
                      x: [0, 10, -5, 15, 20],
                      opacity: [1, 0.8, 1, 0.5, 0],
                    } : {}}
                    transition={{ duration: 0.6 }}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instruction text */}
      <AnimatePresence mode="wait">
        {candleLit ? (
          <motion.p
            key="instruction"
            className="mt-8 text-lg text-muted-foreground text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1.5 }}
          >
            ✨ <span className="text-champagne">Click the cake</span> to blow out the candles! ✨
          </motion.p>
        ) : (
          <motion.div
            key="message"
            className="mt-8 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: 0.3
            }}
          >
            {showMessage && (
              <>
                <motion.h2 
                  className="text-4xl md:text-5xl font-display text-gradient text-glow mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Happy Birthday!
                </motion.h2>
                <motion.p 
                  className="text-2xl md:text-3xl font-display text-champagne"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {name} 💖
                </motion.p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
