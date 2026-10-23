import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
  textClassName?: string;
}

export default function CountUp({ value, suffix = '', className = '', textClassName = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  const shown = reduceMotion ? value : current;

  // The invisible final value reserves the width so the label doesn't shift while counting.
  // textClassName styles the visible digits; a background-clip gradient must sit on the element that paints them.
  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="invisible">
        {value}
        {suffix}
      </span>
      <span className={`absolute inset-0 text-center ${textClassName}`} aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
