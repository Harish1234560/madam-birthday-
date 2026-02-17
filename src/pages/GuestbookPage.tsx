import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import FloatingButton from '@/components/FloatingButton';
import Guestbook from '@/components/Guestbook';
import { BookHeart, PenLine, Sparkles, ChevronRight } from 'lucide-react';

const BIRTHDAY_NAME = "Devei Hemalatha";

export default function GuestbookPage() {
  const navigate = useNavigate();
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleOpenGuestbook = useCallback(() => {
    setShowGuestbook(true);
  }, []);

  const handleCloseGuestbook = useCallback(() => {
    setShowGuestbook(false);
    setSigned(true);
  }, []);

  const handleContinue = useCallback(() => {
    navigate('/surprise');
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />

      {/* Floating pages/notes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-foreground/5 rounded-lg"
            style={{
              width: `${40 + Math.random() * 40}px`,
              height: `${50 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: `${-30 + Math.random() * 60}deg`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [`${-10 + i}deg`, `${10 + i}deg`, `${-10 + i}deg`],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="mb-8 relative inline-block"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BookHeart className="w-24 h-24 text-pink-400" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <PenLine className="w-8 h-8 text-secondary" />
            </motion.div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
            Sign the Guestbook
          </h1>

          <p className="text-xl text-champagne mb-12 max-w-lg mx-auto">
            Leave your birthday wishes for {BIRTHDAY_NAME}! 
            Your message will be saved forever.
          </p>

          <AnimatePresence mode="wait">
            {!signed ? (
              <motion.div key="sign" exit={{ opacity: 0, scale: 0.8 }}>
                <FloatingButton
                  icon={<BookHeart className="w-6 h-6 text-pink-400" />}
                  onClick={handleOpenGuestbook}
                  delay={0}
                >
                  Open Guestbook
                </FloatingButton>
              </motion.div>
            ) : (
              <motion.div
                key="signed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 mx-auto text-secondary" />
                </motion.div>
                <p className="text-lg text-secondary">
                  📖 Thank you for signing! One more surprise awaits...
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <FloatingButton
                    icon={<BookHeart className="w-6 h-6 text-pink-400" />}
                    onClick={handleOpenGuestbook}
                    delay={0}
                  >
                    View Messages
                  </FloatingButton>
                  <button
                    onClick={handleContinue}
                    className="neon-button flex items-center gap-2"
                  >
                    Final Surprise
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Guestbook
          isOpen={showGuestbook}
          onClose={handleCloseGuestbook}
          birthdayName={BIRTHDAY_NAME}
        />
      </main>
    </div>
  );
}
