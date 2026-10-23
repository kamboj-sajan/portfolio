import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import { navLinks, profile } from '../data/portfolio';

export default function HeroSection() {
  return (
    <section id="top" className="relative flex h-screen h-svh flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        aria-label="Primary"
        className="relative z-20 flex justify-between px-6 pt-6 md:px-10 md:pt-8"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="-my-2 py-2 text-sm font-medium uppercase tracking-wider text-mist transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw]"
        >
          {profile.greeting}
          <span className="sr-only"> Kamboj, software engineer</span>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-mist sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          {profile.tagline}
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] max-w-[62vh] -translate-x-1/2 -translate-y-1/2 select-none sm:w-[360px] sm:landscape:bottom-0 sm:landscape:top-auto sm:landscape:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={profile.portrait}
              alt=""
              width={1040}
              height={1126}
              draggable={false}
              className="block h-auto w-full"
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
