import { useReducedMotion } from 'framer-motion';
import { forwardRef, useEffect, useRef } from 'react';
import { marqueeImages } from '../data/portfolio';

const firstRow = marqueeImages.slice(0, 11);
const secondRow = marqueeImages.slice(11);

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = reduceMotion ? 0 : (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      if (rowOneRef.current) rowOneRef.current.style.transform = `translateX(${offset - 200}px)`;
      if (rowTwoRef.current) rowTwoRef.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    if (reduceMotion) return;

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} aria-hidden="true" className="overflow-hidden bg-ink pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <MarqueeRow ref={rowOneRef} images={firstRow} />
        <MarqueeRow ref={rowTwoRef} images={secondRow} />
      </div>
    </section>
  );
}

// Each row is tripled and centred, so the scroll offset never reveals an edge.
const MarqueeRow = forwardRef<HTMLDivElement, { images: string[] }>(function MarqueeRow({ images }, ref) {
  const tiles = [...images, ...images, ...images];

  return (
    <div className="flex justify-center">
      <div ref={ref} className="flex w-max shrink-0 gap-3" style={{ willChange: 'transform' }}>
        {tiles.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            width={420}
            height={270}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
});
