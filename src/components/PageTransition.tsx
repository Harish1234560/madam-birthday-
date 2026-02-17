import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    rotateY: -5,
  },
  in: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  out: {
    opacity: 0,
    scale: 1.05,
    rotateY: 5,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Slide variants for different page flows
const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
  }),
  in: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  out: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.9,
  }),
};

// Flip variants for dramatic effect
const flipVariants = {
  initial: {
    opacity: 0,
    rotateX: 90,
    transformPerspective: 1000,
  },
  in: {
    opacity: 1,
    rotateX: 0,
    transformPerspective: 1000,
  },
  out: {
    opacity: 0,
    rotateX: -90,
    transformPerspective: 1000,
  },
};

// Zoom and fade variants
const zoomVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(10px)',
  },
  in: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    scale: 1.5,
    filter: 'blur(10px)',
  },
};

// Route order for determining transition direction
const routeOrder = [
  '/',
  '/celebrate',
  '/message',
  '/gifts',
  '/memories',
  '/quiz',
  '/guestbook',
  '/surprise',
];

// Get animation variants based on route
const getVariantsForRoute = (pathname: string) => {
  if (pathname === '/celebrate') {
    return zoomVariants;
  }
  if (pathname === '/surprise') {
    return flipVariants;
  }
  return pageVariants;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  
  const currentIndex = routeOrder.indexOf(location.pathname);
  const direction = 1; // Always forward for this flow

  const variants = getVariantsForRoute(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
        className="min-h-screen"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Sparkle transition overlay
export function TransitionOverlay() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={`overlay-${location.pathname}`}
        className="fixed inset-0 pointer-events-none z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Sparkles during transition */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-secondary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.02,
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
