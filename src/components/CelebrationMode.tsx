import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface CelebrationModeProps {
  isActive: boolean;
  onEnd: () => void;
}

export default function CelebrationMode({ isActive, onEnd }: CelebrationModeProps) {
  const { vibrate, celebrationBurst } = useHapticFeedback();

  const triggerFireworks = useCallback(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#e57373', '#f06292', '#d4af37', '#ff7f50', '#64b5f6', '#ba68c8'];

    // Trigger haptic celebration burst
    celebrationBurst();

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onEnd();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Light haptic on each confetti burst
      vibrate('light');

      // Fireworks from different positions
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        },
        colors,
        shapes: ['star', 'circle'],
        scalar: randomInRange(0.9, 1.5),
      });

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        },
        colors,
        shapes: ['star', 'circle'],
        scalar: randomInRange(0.9, 1.5),
      });
    }, 250);

    // Initial big burst with strong haptic
    vibrate('heavy');
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.5 },
      colors,
      shapes: ['star', 'circle'],
      scalar: 1.5,
    });

    return () => clearInterval(interval);
  }, [onEnd, vibrate, celebrationBurst]);

  useEffect(() => {
    if (isActive) {
      const cleanup = triggerFireworks();
      return cleanup;
    }
  }, [isActive, triggerFireworks]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Emoji rain effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              animation: `particle-rise ${5 + Math.random() * 3}s linear infinite`,
            }}
          >
            {['🎉', '🎊', '🎈', '🥳', '✨', '💖', '🎂', '🍰'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>
    </div>
  );
}
