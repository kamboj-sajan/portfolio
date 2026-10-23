import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Github } from 'lucide-react';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import PillLink from '../components/PillLink';
import { moreProjects, projects } from '../data/portfolio';
import type { Project } from '../data/portfolio';

const imageRadius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

export default function ProjectsSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-28 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-36 md:pt-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-12 text-center font-black uppercase leading-none tracking-tight sm:mb-16 md:mb-20"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Projects
      </FadeIn>

      <div ref={stackRef} className="mx-auto max-w-6xl [--stack-top:6rem] md:[--stack-top:8rem]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      <MoreProjects />
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const [first, second, tall] = project.images;

  // The 28px step lives on each sticky wrapper's own `top` rather than as a relative offset on the card,
  // so a card taller than its wrapper never spills over the content after the stack.
  return (
    <div
      className="sticky flex min-h-[85vh] items-start justify-center"
      style={{ top: `calc(var(--stack-top) + ${index * 28}px)` }}
    >
      <motion.article
        className="relative w-full origin-top rounded-[40px] border-2 border-mist bg-ink p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale: reduceMotion ? 1 : scale }}
      >
        <div className="flex flex-col gap-5 px-2 pt-1 sm:px-3 md:flex-row md:items-start md:justify-between md:gap-8 md:px-4 md:pt-2">
          <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
            <span
              className="hero-heading shrink-0 font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2 md:pt-2">
              <p className="text-[11px] font-light uppercase tracking-widest text-mist/70 sm:text-xs md:text-sm">
                {project.category}
              </p>
              <h3
                className="font-medium uppercase leading-tight text-mist"
                style={{ fontSize: 'clamp(1.25rem, 2.6vw, 2.25rem)' }}
              >
                {project.name}
              </h3>
              <p className="line-clamp-3 max-w-xl text-sm font-light leading-relaxed text-mist/70 sm:line-clamp-none md:text-base">
                {project.description}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-mist/60 sm:text-xs">{project.stack.join(' · ')}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {project.live ? (
              <>
                <LiveProjectButton href={project.live} />
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-mist text-mist transition-colors duration-200 hover:bg-mist/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist sm:h-14 sm:w-14"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{project.name} source code on GitHub (opens in a new tab)</span>
                </a>
              </>
            ) : (
              <LiveProjectButton href={project.code} label="View Code" />
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-3 sm:mt-6 sm:gap-4 md:mt-8">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <img
              src={first.src}
              alt={first.alt}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover ${imageRadius}`}
              style={{ height: 'clamp(130px, min(16vw, 20vh), 230px)' }}
            />
            <img
              src={second.src}
              alt={second.alt}
              loading="lazy"
              decoding="async"
              className={`w-full object-cover ${imageRadius}`}
              style={{ height: 'clamp(160px, min(22vw, 28vh), 340px)' }}
            />
          </div>
          <div className="w-[60%]">
            <img
              src={tall.src}
              alt={tall.alt}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover ${imageRadius}`}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function MoreProjects() {
  return (
    <div className="mx-auto mt-16 max-w-6xl sm:mt-24">
      <FadeIn as="h3" className="mb-6 text-xs font-light uppercase tracking-widest text-mist/70 sm:mb-8 sm:text-sm">
        More on GitHub
      </FadeIn>
      <ul>
        {moreProjects.map((repo, index) => (
          <FadeIn
            as="li"
            key={repo.name}
            className="grid gap-x-8 gap-y-4 border-t border-mist/15 py-7 last:border-b sm:py-8 md:grid-cols-[4.5rem_1fr_auto] md:py-10"
          >
            <span className="font-black leading-none text-mist/30" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }} aria-hidden="true">
              {String(projects.length + index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h4 className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium uppercase leading-tight text-mist" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.75rem)' }}>
                {repo.name}
                {repo.status && (
                  <span className="rounded-full border border-mist/30 px-2.5 py-0.5 text-[10px] font-light tracking-widest text-mist/80 sm:text-[11px]">
                    {repo.status}
                  </span>
                )}
              </h4>
              <p className="mt-2 max-w-3xl font-light leading-relaxed text-mist/70" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)' }}>
                {repo.description}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-widest text-mist/60 sm:text-xs">{repo.stack.join(' · ')}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {repo.live && <PillLink href={repo.live} label="Live" />}
              <PillLink href={repo.code} label="Code" />
            </div>
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}
