import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });

  if (reduceMotion) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  const words = text.split(' ');
  let cursor = 0;

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const wordStart = cursor;
          cursor += word.length + 1;
          return (
            <span key={wordIndex}>
              <span className="whitespace-nowrap">
                {word.split('').map((char, charIndex) => {
                  const start = (wordStart + charIndex) / text.length;
                  return (
                    <Char key={charIndex} progress={scrollYProgress} range={[start, start + 1 / text.length]}>
                      {char}
                    </Char>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 && ' '}
            </span>
          );
        })}
      </span>
    </p>
  );
}

interface CharProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

function Char({ children, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative">
      <span className="invisible">{children}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}
