import { useEffect, useCallback } from 'react';

export default function SparkleTrail() {
  const createSparkle = useCallback((x: number, y: number) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    // Random size and color variation
    const size = Math.random() * 6 + 4;
    const hue = Math.random() > 0.5 ? 350 : 38; // Rose gold or champagne
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 60%) 0%, transparent 70%)`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const throttleMs = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;
      
      // Create 1-2 sparkles per movement
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;
          createSparkle(e.clientX + offsetX, e.clientY + offsetY);
        }, i * 30);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createSparkle]);

  return null;
}
