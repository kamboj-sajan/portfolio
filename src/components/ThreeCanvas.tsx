import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { SceneHandle } from '../three/types';

export type SceneCreator = (canvas: HTMLCanvasElement, reducedMotion: boolean) => Promise<SceneHandle>;

interface ThreeCanvasProps {
  create: SceneCreator;
  className?: string;
}

// Mounts a lazily loaded Three.js scene and pauses it whenever it is offscreen or the tab is hidden.
export default function ThreeCanvas({ create, className = '' }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A fresh canvas per mount, so a dev-mode remount never shares a WebGL context with a disposed renderer.
    const canvas = document.createElement('canvas');
    canvas.className = 'block h-full w-full opacity-0 transition-opacity duration-1000';
    container.appendChild(canvas);

    let scene: SceneHandle | null = null;
    let cancelled = false;
    let onScreen = false;
    let resizeObserver: ResizeObserver | undefined;
    let intersectionObserver: IntersectionObserver | undefined;

    const sync = () => scene?.setActive(onScreen && document.visibilityState === 'visible');

    create(canvas, reducedMotion)
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        scene = created;
        resizeObserver = new ResizeObserver(([entry]) => created.resize(entry.contentRect.width, entry.contentRect.height));
        resizeObserver.observe(container);
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
          },
          { rootMargin: '200px 0px' },
        );
        intersectionObserver.observe(container);
        document.addEventListener('visibilitychange', sync);
        canvas.classList.replace('opacity-0', 'opacity-100');
      })
      .catch(() => {
        // No WebGL, or the chunk failed to load: the page is complete without the scene.
        canvas.remove();
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      scene?.dispose();
      canvas.remove();
    };
  }, [create, reducedMotion]);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
}
