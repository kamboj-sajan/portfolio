import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  className,
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || reduceMotion) return;

    let active = false;

    // Writes the transform straight to the DOM so mouse movement never re-renders React.
    const handleMove = (event: MouseEvent) => {
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const dx = event.clientX - (left + width / 2);
      const dy = event.clientY - (top + height / 2);

      if (Math.abs(dx) < width / 2 + padding && Math.abs(dy) < height / 2 + padding) {
        active = true;
        inner.style.transition = activeTransition;
        inner.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = inactiveTransition;
        inner.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      inner.style.transform = 'translate3d(0, 0, 0)';
    };
  }, [padding, strength, activeTransition, inactiveTransition, reduceMotion]);

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={innerRef} style={{ transition: inactiveTransition, willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
