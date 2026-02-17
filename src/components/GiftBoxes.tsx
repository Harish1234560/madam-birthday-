import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface GiftBoxesProps {
  isOpen: boolean;
  onClose: () => void;
}

const gifts = [
  {
    id: 1,
    color: '#e57373',
    ribbon: '#fcd34d',
    content: {
      type: 'message',
      title: 'A Promise',
      text: "I promise to always be there for you, through thick and thin, through laughter and tears. You're stuck with me forever! 💕",
    },
  },
  {
    id: 2,
    color: '#f06292',
    ribbon: '#d4af37',
    content: {
      type: 'wish',
      title: 'Birthday Wish #1',
      text: "May this year bring you closer to all your dreams. May you find courage in challenges and joy in small moments. ✨",
    },
  },
  {
    id: 3,
    color: '#64b5f6',
    ribbon: '#f472b6',
    content: {
      type: 'fun',
      title: 'Fun Fact',
      text: "Did you know? You've made approximately 1,000,000+ people smile just by being you. That's a scientific fact (I made up). 😄",
    },
  },
  {
    id: 4,
    color: '#81c784',
    ribbon: '#e57373',
    content: {
      type: 'memory',
      title: 'Favorite Memory',
      text: "Remember when we laughed so hard we cried? That moment is stored in my heart's 'favorite memories' folder forever! 🥹",
    },
  },
];

function GiftBox({ 
  gift, 
  onOpen, 
  isOpened,
  delay 
}: { 
  gift: typeof gifts[0]; 
  onOpen: () => void;
  isOpened: boolean;
  delay: number;
}) {
  const handleClick = () => {
    if (!isOpened) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: [gift.color, gift.ribbon, '#d4af37']
      });
      onOpen();
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: isOpened ? 1 : 1.05 }}
      whileTap={{ scale: isOpened ? 1 : 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        className="gift-box"
        animate={!isOpened ? { rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ animationPlayState: isOpened ? 'paused' : 'running' }}
      >
        <svg width="120" height="130" viewBox="0 0 120 130">
          {/* Box body */}
          <rect 
            x="10" 
            y="40" 
            width="100" 
            height="80" 
            rx="4" 
            fill={gift.color}
          />
          <rect 
            x="10" 
            y="40" 
            width="100" 
            height="15" 
            rx="4" 
            fill={gift.color}
            opacity="0.7"
          />
          
          {/* Lid */}
          <motion.g
            animate={isOpened ? { 
              rotate: -45,
              y: -20,
              x: -10,
            } : {}}
            style={{ transformOrigin: '10px 40px' }}
          >
            <rect 
              x="5" 
              y="25" 
              width="110" 
              height="20" 
              rx="3" 
              fill={gift.color}
            />
            {/* Horizontal ribbon on lid */}
            <rect 
              x="50" 
              y="25" 
              width="20" 
              height="20" 
              fill={gift.ribbon}
            />
          </motion.g>
          
          {/* Vertical ribbon */}
          <rect 
            x="50" 
            y="40" 
            width="20" 
            height="80" 
            fill={gift.ribbon}
          />
          
          {/* Bow */}
          <motion.g
            animate={isOpened ? { opacity: 0, y: -30 } : {}}
          >
            <ellipse cx="45" cy="20" rx="15" ry="10" fill={gift.ribbon} />
            <ellipse cx="75" cy="20" rx="15" ry="10" fill={gift.ribbon} />
            <circle cx="60" cy="22" r="8" fill={gift.ribbon} />
            <ellipse cx="45" cy="20" rx="8" ry="5" fill={gift.color} opacity="0.3" />
            <ellipse cx="75" cy="20" rx="8" ry="5" fill={gift.color} opacity="0.3" />
          </motion.g>
        </svg>
      </motion.div>
      
      {/* Hover instruction */}
      {!isOpened && (
        <motion.p
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          Click to open!
        </motion.p>
      )}
    </motion.div>
  );
}

export default function GiftBoxes({ isOpen, onClose }: GiftBoxesProps) {
  const [openedGifts, setOpenedGifts] = useState<Set<number>>(new Set());
  const [selectedGift, setSelectedGift] = useState<typeof gifts[0] | null>(null);

  const handleOpenGift = (gift: typeof gifts[0]) => {
    if (!openedGifts.has(gift.id)) {
      setOpenedGifts(new Set([...openedGifts, gift.id]));
      setTimeout(() => setSelectedGift(gift), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-lg z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div
            className="fixed inset-4 md:inset-10 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display text-gradient flex items-center gap-3">
                <Gift className="w-8 h-8 text-primary" />
                Your Birthday Gifts
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors glass-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>
            
            {/* Gift progress */}
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Opened {openedGifts.size} of {gifts.length} gifts 🎁
              </p>
            </div>
            
            {/* Gift Grid */}
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {gifts.map((gift, index) => (
                  <GiftBox
                    key={gift.id}
                    gift={gift}
                    onOpen={() => handleOpenGift(gift)}
                    isOpened={openedGifts.has(gift.id)}
                    delay={index * 0.15}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Gift Content Modal */}
          <AnimatePresence>
            {selectedGift && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedGift(null)}
              >
                <motion.div
                  className="glass-card max-w-md w-full p-8 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: 2, duration: 0.3 }}
                  >
                    🎁
                  </motion.div>
                  <h3 className="text-2xl font-display text-gradient mb-4">
                    {selectedGift.content.title}
                  </h3>
                  <p className="text-foreground/90 text-lg leading-relaxed">
                    {selectedGift.content.text}
                  </p>
                  <motion.button
                    className="neon-button mt-6"
                    onClick={() => setSelectedGift(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close Gift 💝
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
