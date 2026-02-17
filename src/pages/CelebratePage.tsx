import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import CelebrationMode from '@/components/CelebrationMode';
import FloatingButton from '@/components/FloatingButton';
import { PartyPopper, Sparkles } from 'lucide-react';

export default function CelebratePage() {
  const navigate = useNavigate();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationComplete, setCelebrationComplete] = useState(false);

  const triggerCelebration = useCallback(() => {
    setIsCelebrating(true);
  }, []);

  const handleCelebrationEnd = useCallback(() => {
    setIsCelebrating(false);
    setCelebrationComplete(true);
    // Navigate to message page after a short delay
    setTimeout(() => {
      navigate('/message');
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />
      <CelebrationMode isActive={isCelebrating} onEnd={handleCelebrationEnd} />

      {/* Radial gradient background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/20"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-20 h-20 mx-auto text-secondary" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
            Let's Celebrate!
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-champagne mb-12 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
             Another year older, another year more inspiring! 🌟🎂!
             Thank you for all the guidance, encouragement, and wonderful memories 🙏📚✨
             Your support and wisdom mean more than words can say 💐💖. Let’s make this year even more unforgettable 😎🥳  !Click the button and unlock the birthday surprise!
          </motion.p>

          {!celebrationComplete && !isCelebrating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FloatingButton
                icon={<PartyPopper className="w-8 h-8 text-secondary" />}
                onClick={triggerCelebration}
                delay={0}
              >
                <span className="text-lg font-semibold">Start Celebration!</span>
              </FloatingButton>
            </motion.div>
          )}

          {celebrationComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl text-secondary font-display"
            >
              🎉 Amazing! Moving to your special message... 🎉
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
