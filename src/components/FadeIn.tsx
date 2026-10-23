import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type Tag = 'div' | 'section' | 'nav' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'ul' | 'li' | 'article';

// motion.create() must not run on every render, so each tag's component is created once.
const components = new Map<Tag, typeof motion.div>();

function motionFor(tag: Tag) {
  let component = components.get(tag);
  if (!component) {
    component = motion.create(tag) as unknown as typeof motion.div;
    components.set(tag, component);
  }
  return component;
}

interface FadeInProps {
  as?: Tag;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  id?: string;
  'aria-label'?: string;
}

export default function FadeIn({ as = 'div', children, delay = 0, duration = 0.7, x = 0, y = 30, ...rest }: FadeInProps) {
  const Component = motionFor(as);

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
