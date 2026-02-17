import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => onComplete(), 6500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(350, 80%, 65%, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="text-center z-10 px-4">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-6xl"
            >
              ✨
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <motion.p
                className="text-2xl md:text-3xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Today is not just a day...
              </motion.p>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-4"
            >
              <motion.p
                className="text-3xl md:text-4xl font-display text-gradient text-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                It's <span className="text-champagne">YOUR</span> day
              </motion.p>
              <motion.div
                className="text-6xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                🎂
              </motion.div>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <motion.div
                className="text-5xl md:text-7xl font-display text-gradient text-glow"
                animate={{
                  textShadow: [
                    '0 0 20px hsla(350, 80%, 65%, 0.5)',
                    '0 0 40px hsla(350, 80%, 65%, 0.8)',
                    '0 0 20px hsla(350, 80%, 65%, 0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Let's Celebrate!
              </motion.div>
              <motion.div
                className="flex justify-center gap-4 text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {['🎉', '🎊', '🎈', '🥳', '🎁'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-champagne/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
