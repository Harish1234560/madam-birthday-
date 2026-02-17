import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'celebration';

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: HapticPattern = 'medium') => {
    // Check if vibration API is supported
    if (!('vibrate' in navigator)) {
      return false;
    }

    try {
      switch (pattern) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        case 'success':
          // Double tap pattern
          navigator.vibrate([30, 50, 30]);
          break;
        case 'celebration':
          // Fun celebration pattern - multiple short bursts
          navigator.vibrate([50, 30, 50, 30, 100, 50, 50, 30, 50]);
          break;
        default:
          navigator.vibrate(25);
      }
      return true;
    } catch (e) {
      console.warn('Vibration failed:', e);
      return false;
    }
  }, []);

  const celebrationBurst = useCallback(() => {
    // Initial strong burst
    vibrate('celebration');
    
    // Subsequent lighter vibrations during confetti
    const intervals = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
    intervals.forEach((delay) => {
      setTimeout(() => {
        vibrate('light');
      }, delay);
    });
  }, [vibrate]);

  return { vibrate, celebrationBurst };
}

export default useHapticFeedback;
