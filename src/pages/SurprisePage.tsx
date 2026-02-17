import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import FloatingButton from '@/components/FloatingButton';
import { Sparkles, Gift, Heart, Star, PartyPopper, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const BIRTHDAY_NAME = "Devei Hemalatha";

export default function SurprisePage() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const { vibrate, celebrationBurst } = useHapticFeedback();

  const handleReveal = useCallback(() => {
    setRevealed(true);
    
    // Trigger celebration haptic pattern
    celebrationBurst();
    
    // Epic confetti burst
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#f28585', '#d4a373', '#e07a5f', '#FFD700', '#FF69B4'];

    let frameCount = 0;
    const frame = () => {
      // Light haptic every 10 frames
      if (frameCount % 10 === 0) {
        vibrate('light');
      }
      frameCount++;

      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    setTimeout(() => {
      vibrate('success');
      setShowFinalMessage(true);
    }, 2000);
  }, [vibrate, celebrationBurst]);

  const handleStartOver = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />

      {/* Animated celebration background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-50px',
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, 360, 720],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear",
            }}
          >
            {i % 4 === 0 && <Star className="text-yellow-400/40" size={20} fill="currentColor" />}
            {i % 4 === 1 && <Heart className="text-primary/40" size={20} fill="currentColor" />}
            {i % 4 === 2 && <Sparkles className="text-secondary/40" size={20} />}
            {i % 4 === 3 && <Gift className="text-accent/40" size={20} />}
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="mystery"
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
            >
              <motion.div
                className="mb-8 relative"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow">
                    <span className="text-6xl">❓</span>
                  </div>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                        y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
                The Final Surprise!
              </h1>

              <p className="text-xl text-champagne mb-12 max-w-lg mx-auto">
                You've made it to the end of this magical journey. 
                Click to reveal your final surprise!
              </p>

              <FloatingButton
                icon={<PartyPopper className="w-6 h-6 text-secondary" />}
                onClick={handleReveal}
                delay={0}
              >
                Reveal Surprise!
              </FloatingButton>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              className="text-center max-w-3xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <span className="text-8xl">🎂</span>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-display text-gradient text-glow mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Happy Birthday, {BIRTHDAY_NAME}!
              </motion.h1>

              <AnimatePresence>
                {showFinalMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="glass-card p-8 md:p-12">
                      <motion.p
                        className="text-xl md:text-2xl text-champagne leading-relaxed font-display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                       “May this year bring you endless joy 🌈, beautiful moments 🌼, and all the happiness 💖 your heart can hold. You are truly loved 🤍, deeply respected 🙏, and sincerely celebrated 🎉 today and always ✨.”
                      </motion.p>
                      <motion.div
                        className="mt-6 flex justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {['💖', '🌟', '🎉', '✨', '🎁'].map((emoji, i) => (
                          <motion.span
                            key={i}
                            className="text-3xl"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <button
                        onClick={handleStartOver}
                        className="neon-button flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Experience Again
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
