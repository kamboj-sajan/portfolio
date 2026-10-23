import FadeIn from '../components/FadeIn';
import { skills } from '../data/portfolio';

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-ink sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Skills
      </FadeIn>

      <ul className="mx-auto max-w-5xl">
        {skills.map((skill, index) => (
          <FadeIn
            as="li"
            key={skill.name}
            delay={index * 0.1}
            className="flex items-start gap-5 border-b py-8 last:border-b-0 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
            style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
          >
            <span
              className="shrink-0 font-black leading-none text-ink"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 pt-1 sm:gap-3 md:pt-3">
              <h3 className="font-medium uppercase text-ink" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {skill.name}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed text-ink opacity-60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {skill.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
