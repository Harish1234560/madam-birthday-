import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

export default function MessageModal({ isOpen, onClose, name }: MessageModalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullMessage = `My Dearest ${name},

On this special day, I want you to know just how incredibly lucky I am to have you in my life. 🌟

From the moment we became friends, my world has been filled with more laughter, joy, and unforgettable memories than I ever thought possible. 

You're not just my best friend – you're my confidant, my partner in crime, and the person who truly understands me like no one else does.

Remember all those late-night conversations? The adventures we've had? The times we laughed until we cried? Every single moment with you has been a gift. 💝

Today, I wish you:
✨ Endless happiness that fills your heart
✨ Dreams that come true beyond your imagination
✨ Love that surrounds you always
✨ Adventures that take your breath away
✨ Success in everything you pursue

You deserve the entire universe and more. Never forget how amazing, beautiful, and loved you are.

Here's to another year of being absolutely incredible!

With all my love and the biggest hug,
Your Best Friend Forever 💖

P.S. This is just the beginning of your birthday surprises! 🎁`;

  useEffect(() => {
    if (isOpen && currentIndex < fullMessage.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullMessage.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex, fullMessage]);

  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[80vh] z-50"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="glass-card h-full overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <h2 className="text-2xl font-display text-gradient">
                  💌 A Special Message For You
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </motion.button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-lg">
                    {displayedText}
                    <span className="animate-pulse text-primary">|</span>
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-border/30 text-center">
                <motion.div
                  className="inline-flex gap-2 text-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  💖✨🎂✨💖
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
