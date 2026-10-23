import FadeIn from '../components/FadeIn';
import PillLink from '../components/PillLink';
import { achievements } from '../data/portfolio';

export default function AchievementsSection() {
  return (
    <section className="relative z-20 -mt-10 rounded-t-[40px] bg-white px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-28 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-36 md:pt-32">
      <FadeIn
        as="h2"
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-ink sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Achievements
      </FadeIn>

      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <FadeIn
              as="li"
              key={achievement.title}
              delay={(index % 3) * 0.1}
              className="flex flex-col gap-5 rounded-[32px] border p-7 sm:p-8"
              style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-mist">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium uppercase leading-tight text-ink" style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.5rem)' }}>
                  {achievement.title}
                </h3>
                <p className="font-light leading-relaxed text-ink/60">{achievement.detail}</p>
              </div>
              {achievement.links && (
                <div className="mt-auto flex flex-wrap gap-2">
                  {achievement.links.map((link) => (
                    <PillLink key={link.href} href={link.href} label={link.label} tone="light" />
                  ))}
                </div>
              )}
            </FadeIn>
          );
        })}
      </ul>
    </section>
  );
}
