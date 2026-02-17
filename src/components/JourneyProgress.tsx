import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Cake, PartyPopper, MessageCircle, Gift, Images, Brain, BookOpen, Sparkles } from 'lucide-react';

const journeySteps = [
  { path: '/', icon: Cake, label: 'Cake' },
  { path: '/celebrate', icon: PartyPopper, label: 'Celebrate' },
  { path: '/message', icon: MessageCircle, label: 'Message' },
  { path: '/gifts', icon: Gift, label: 'Gifts' },
  { path: '/memories', icon: Images, label: 'Memories' },
  { path: '/quiz', icon: Brain, label: 'Quiz' },
  { path: '/guestbook', icon: BookOpen, label: 'Guestbook' },
  { path: '/surprise', icon: Sparkles, label: 'Surprise' },
];

export default function JourneyProgress() {
  const location = useLocation();
  const currentIndex = journeySteps.findIndex(step => step.path === location.pathname);
  
  // Don't show on 404 or unknown routes
  if (currentIndex === -1) return null;

  const progress = ((currentIndex + 1) / journeySteps.length) * 100;

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
    >
      <div className="glass-card px-4 py-2 flex items-center gap-3">
        {/* Step indicator */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-primary">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground">
            {journeySteps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-24 h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Current step icon */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
        >
          {(() => {
            const CurrentIcon = journeySteps[currentIndex].icon;
            return <CurrentIcon className="w-4 h-4 text-primary-foreground" />;
          })()}
        </motion.div>

        {/* Step name (hidden on mobile) */}
        <motion.span
          key={`label-${currentIndex}`}
          className="text-sm font-medium text-foreground hidden sm:block min-w-[70px]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {journeySteps[currentIndex].label}
        </motion.span>
      </div>

      {/* Dots indicator for all steps */}
      <div className="flex justify-center gap-1.5 mt-2">
        {journeySteps.map((step, index) => (
          <motion.div
            key={step.path}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index <= currentIndex 
                ? 'bg-primary' 
                : 'bg-muted-foreground/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ 
              scale: index === currentIndex ? 1.3 : 1,
            }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
