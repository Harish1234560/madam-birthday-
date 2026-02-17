import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingButtonProps {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  delay?: number;
  className?: string;
}

export default function FloatingButton({ 
  children, 
  icon, 
  onClick, 
  delay = 0,
  className = "" 
}: FloatingButtonProps) {
  return (
    <motion.button
      className={`floating-action flex items-center gap-3 min-w-[140px] ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        delay: delay,
        duration: 0.6
      }}
      whileHover={{ 
        scale: 1.08,
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-foreground">{children}</span>
    </motion.button>
  );
}
