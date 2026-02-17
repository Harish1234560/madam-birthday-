import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Scene3D from '@/components/Scene3D';
import SparkleTrail from '@/components/SparkleTrail';
import FloatingButton from '@/components/FloatingButton';
import MemoryGallery from '@/components/MemoryGallery';
import { Image, Camera, ChevronRight } from 'lucide-react';

export default function MemoriesPage() {
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [galleryViewed, setGalleryViewed] = useState(false);

  const handleOpenGallery = useCallback(() => {
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setShowGallery(false);
    setGalleryViewed(true);
  }, []);

  const handleContinue = useCallback(() => {
    navigate('/guestbook');
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />
      <SparkleTrail />

      {/* Polaroid-style floating photos background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-28 bg-foreground/10 rounded-sm"
            style={{
              left: `${10 + (i % 3) * 35}%`,
              top: `${15 + Math.floor(i / 3) * 50}%`,
              rotate: `${-15 + Math.random() * 30}deg`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [`${-15 + i * 5}deg`, `${-10 + i * 5}deg`, `${-15 + i * 5}deg`],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <div className="w-full h-20 bg-gradient-to-br from-primary/20 to-secondary/20 m-2" />
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="relative mb-8 inline-block"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="bg-foreground/90 p-4 pb-12 rounded-sm shadow-floating">
              <Camera className="w-24 h-24 text-background" />
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 bg-secondary p-2 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Image className="w-6 h-6 text-background" />
            </motion.div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display text-gradient text-glow mb-6">
            Memory Lane
          </h1>

          <p className="text-xl text-champagne mb-12 max-w-lg mx-auto">
            Browse through precious memories and add your own photos to celebrate!
          </p>

          <AnimatePresence mode="wait">
            {!galleryViewed ? (
              <motion.div key="open" exit={{ opacity: 0, scale: 0.8 }}>
                <FloatingButton
                  icon={<Image className="w-6 h-6 text-coral" />}
                  onClick={handleOpenGallery}
                  delay={0}
                >
                  Open Gallery
                </FloatingButton>
              </motion.div>
            ) : (
              <motion.div
                key="continue"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <p className="text-lg text-secondary mb-4">
                  📸 Beautiful memories! Ready to sign the guestbook?
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <FloatingButton
                    icon={<Image className="w-6 h-6 text-coral" />}
                    onClick={handleOpenGallery}
                    delay={0}
                  >
                    View Again
                  </FloatingButton>
                  <button
                    onClick={handleContinue}
                    className="neon-button flex items-center gap-2"
                  >
                    Continue to Guestbook
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <MemoryGallery isOpen={showGallery} onClose={handleCloseGallery} />
      </main>
    </div>
  );
}
