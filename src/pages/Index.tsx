import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import BirthdayCake from '@/components/BirthdayCake';
import FloatingButton from '@/components/FloatingButton';
import CinematicIntro from '@/components/CinematicIntro';
import { PartyPopper } from 'lucide-react';

// Customize this name for the birthday person!
const BIRTHDAY_NAME = "Devei Hemalatha";

export default function Index() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [candleBlown, setCandleBlown] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleCandleBlow = useCallback(() => {
    setCandleBlown(true);
  }, []);

  const handleStartCelebration = useCallback(() => {
    navigate('/celebrate');
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Cinematic Intro */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* 3D Background Scene */}
      <Scene3D />

      {/* Sparkle Cursor Trail */}
      <SparkleTrail />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -30 : 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-4xl">🎉</span>
            <h1 className="text-4xl md:text-6xl font-display text-gradient text-glow">
              Happy Birthday
            </h1>
            <span className="text-4xl">🎉</span>
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl text-champagne font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: showIntro ? 0 : 1 }}
            transition={{ delay: 0.8 }}
          >
            A Special Celebration for {BIRTHDAY_NAME} madam
          </motion.p>
        </motion.div>

        {/* Birthday Cake */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showIntro ? 0 : 1 }}
          transition={{ delay: 1 }}
        >
          <BirthdayCake onBlow={handleCandleBlow} name={BIRTHDAY_NAME} />
        </motion.div>

        {/* Celebration Button - Only shows after candle is blown */}
        <AnimatePresence>
          {candleBlown && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FloatingButton
                icon={<PartyPopper className="w-6 h-6 text-secondary" />}
                onClick={handleStartCelebration}
                delay={0}
              >
                Start Celebration!
              </FloatingButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-4 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showIntro ? 0 : 0.6 }}
          transition={{ delay: 2.5 }}
        >
          <p className="text-sm text-muted-foreground">
            Made with 💖 just for you
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
