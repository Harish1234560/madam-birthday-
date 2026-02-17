import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import FloatingButton from '@/components/FloatingButton';
import { MessageSquareHeart, Heart, ChevronRight } from 'lucide-react';

const BIRTHDAY_NAME = "Devei Hemalatha";

const messages = [
  "🎂 Happy Birthday, dear Madam! Your guidance 🙏 and patience 🌸 have shaped our lives in ways words can’t express. Wishing you a year filled with health 💖, happiness 😊, and peace ✨.",

  "📚 On your special day 🌟, thank you for inspiring us 💫 to dream big 🚀, work hard ✍️, and believe in ourselves 💪. You are not just a teacher 🎓, but a true guide 🌼 and role model 🌈.",

  "🍎 A teacher like you 💝 is truly a blessing 🙏. Your lessons 📖 go beyond books and stay in our hearts ❤️ forever. May your birthday 🎉 be as wonderful ✨ and meaningful 🌺 as the knowledge you share 📘.",

  "💐 Happy Birthday to my most favorite teacher 💛! Your wisdom 🧠, care 🤍, and encouragement 🌟 make learning beautiful 📚. Wishing you endless smiles 😊, good health 🌿, and success 🌟 always 🙏."
];


export default function MessagePage() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messageComplete, setMessageComplete] = useState(false);

  const handleOpenMessage = useCallback(() => {
    setShowMessage(true);
  }, []);

  const handleNextMessage = useCallback(() => {
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      setMessageComplete(true);
      setTimeout(() => {
        navigate('/gifts');
      }, 1500);
    }
  }, [currentMessageIndex, navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />

      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          >
            <Heart
              className="text-primary/30"
              size={20 + Math.random() * 30}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {!showMessage ? (
            <motion.div
              key="button"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageSquareHeart className="w-24 h-24 mx-auto text-primary mb-8" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
                A Special Message
              </h1>

              <p className="text-xl text-champagne mb-12">
                Someone has heartfelt words for you, {BIRTHDAY_NAME}!
              </p>

              <FloatingButton
                icon={<Heart className="w-6 h-6 text-primary" fill="currentColor" />}
                onClick={handleOpenMessage}
                delay={0}
              >
                Open Message
              </FloatingButton>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              className="max-w-2xl w-full"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <div className="glass-card p-8 md:p-12 relative">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-secondary/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-secondary/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-secondary/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-secondary/50" />

                <motion.div
                  className="text-sm text-secondary mb-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Message {currentMessageIndex + 1} of {messages.length}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessageIndex}
                    className="text-2xl md:text-3xl text-foreground font-display text-center leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    "{messages[currentMessageIndex]}"
                  </motion.p>
                </AnimatePresence>

                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {!messageComplete ? (
                    <button
                      onClick={handleNextMessage}
                      className="neon-button flex items-center gap-2"
                    >
                      {currentMessageIndex < messages.length - 1 ? 'Next Message' : 'Continue'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl text-secondary"
                    >
                      🎁 Time for gifts! 🎁
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
