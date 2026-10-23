import { ArrowUp } from 'lucide-react';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import PillLink from '../components/PillLink';
import ThreeCanvas from '../components/ThreeCanvas';
import type { SceneCreator } from '../components/ThreeCanvas';
import { profile, socials } from '../data/portfolio';

const createGlobe: SceneCreator = async (canvas, reducedMotion) => {
  const { createGlobeScene } = await import('../three/globeScene');
  return createGlobeScene(canvas, { reducedMotion });
};

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-30 -mt-10 rounded-t-[40px] bg-ink px-5 pb-8 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <ThreeCanvas
        create={createGlobe}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
        <FadeIn className="inline-flex items-center gap-2.5 rounded-full border border-mist/20 px-4 py-2 text-[11px] font-light uppercase tracking-widest text-mist/80 sm:text-xs">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {profile.availability}
        </FadeIn>

        <FadeIn
          as="h2"
          delay={0.05}
          y={40}
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Let’s talk
        </FadeIn>

        <FadeIn
          as="p"
          delay={0.1}
          className="max-w-xl font-light leading-relaxed text-mist/80"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
        >
          Hiring for an SDE intern or full-time role, or have a project in mind? My inbox is always open.
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col items-center gap-4">
          <ContactButton href={`mailto:${profile.email}`} label="Email Me" />
          <a
            href={`mailto:${profile.email}`}
            className="py-2 text-sm font-light tracking-wide text-mist/80 underline-offset-4 transition-colors duration-200 hover:text-mist hover:underline sm:text-base"
          >
            {profile.email}
          </a>
        </FadeIn>

        <FadeIn as="ul" delay={0.2} aria-label="Profiles" className="flex flex-wrap justify-center gap-3">
          {socials.map((social) => (
            <li key={social.href}>
              <PillLink href={social.href} label={social.label} />
            </li>
          ))}
        </FadeIn>
      </div>

      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center gap-3 border-t border-mist/15 pt-8 text-center text-[11px] font-light uppercase tracking-widest text-mist/60 sm:mt-24 sm:text-xs md:flex-row md:justify-between md:text-left">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.education}</span>
        <a href="#top" className="inline-flex items-center gap-1.5 py-2 transition-colors duration-200 hover:text-mist">
          Back to top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
