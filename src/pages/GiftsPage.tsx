import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import FloatingButton from '@/components/FloatingButton';
import { Gift, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const gifts = [
  { 
    id: 1, 
    emoji: '📚😂', 
    message: 'Unlimited chalk, zero homework, and students who actually listen (miracles happen!) 😄', 
    color: 'from-primary to-accent' 
  },
  { 
    id: 2, 
    emoji: '☕😌', 
    message: 'Extra tea breaks, peaceful classrooms, and absolutely no “Ma’am one doubt” after the bell 🔔🤣', 
    color: 'from-secondary to-primary' 
  },
  { 
    id: 3, 
    emoji: '🏆😎', 
    message: 'A legendary year of being the coolest teacher while we pretend to be attentive 😇😂', 
    color: 'from-accent to-secondary' 
  },
];


export default function GiftsPage() {
  const navigate = useNavigate();
  const [showGifts, setShowGifts] = useState(false);
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);
  const [allOpened, setAllOpened] = useState(false);

  const handleShowGifts = useCallback(() => {
    setShowGifts(true);
  }, []);

  const handleOpenGift = useCallback((giftId: number) => {
    if (openedGifts.includes(giftId)) return;

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f28585', '#d4a373', '#e07a5f'],
    });

    const newOpened = [...openedGifts, giftId];
    setOpenedGifts(newOpened);

    if (newOpened.length === gifts.length) {
      setAllOpened(true);
      setTimeout(() => {
        navigate('/memories');
      }, 2000);
    }
  }, [openedGifts, navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />

      {/* Animated stars background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Star className="text-secondary/40" size={12 + Math.random() * 12} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {!showGifts ? (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                className="relative mb-8"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-32 h-32 mx-auto text-accent" />
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-secondary" />
                </motion.div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
                Your Gifts Await!
              </h1>

              <p className="text-xl text-champagne mb-12">
                Open each gift to discover your special surprises
              </p>

              <FloatingButton
                icon={<Gift className="w-6 h-6 text-accent" />}
                onClick={handleShowGifts}
                delay={0}
              >
                Show My Gifts
              </FloatingButton>
            </motion.div>
          ) : (
            <motion.div
              key="gifts"
              className="w-full max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.h2
                className="text-4xl font-display text-gradient text-center mb-12"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Tap each gift to open!
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {gifts.map((gift, index) => (
                  <motion.div
                    key={gift.id}
                    className="relative cursor-pointer"
                    initial={{ opacity: 0, y: 50, rotateY: 180 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.2 }}
                    onClick={() => handleOpenGift(gift.id)}
                  >
                    <AnimatePresence mode="wait">
                      {!openedGifts.includes(gift.id) ? (
                        <motion.div
                          key="closed"
                          className={`glass-card p-8 text-center bg-gradient-to-br ${gift.color} bg-opacity-20`}
                          whileHover={{ scale: 1.05, rotate: [-2, 2, -2, 0] }}
                          whileTap={{ scale: 0.95 }}
                          exit={{ rotateY: 90, opacity: 0 }}
                        >
                          <motion.span
                            className="text-7xl block mb-4"
                            animate={{ 
                              y: [0, -5, 0],
                              rotate: [-3, 3, -3],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {gift.emoji}
                          </motion.span>
                          <p className="text-lg text-foreground">Tap to open!</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="opened"
                          className="glass-card p-8 text-center border-2 border-secondary/50"
                          initial={{ rotateY: -90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                        >
                          <motion.span
                            className="text-5xl block mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                          >
                            ✨
                          </motion.span>
                          <motion.p
                            className="text-lg text-champagne font-display"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            {gift.message}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {allOpened && (
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-2xl text-secondary font-display">
                    🎉 All gifts opened! Let's see some memories... 🎉
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
