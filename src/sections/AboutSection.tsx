import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import CountUp from '../components/CountUp';
import FadeIn from '../components/FadeIn';
import { about, stats } from '../data/portfolio';

const decor = [
  {
    src: '/images/decor/moon.webp',
    width: 420,
    height: 420,
    className: 'top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: '/images/decor/orb.webp',
    width: 360,
    height: 382,
    className: 'bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: '/images/decor/brick.webp',
    width: 420,
    height: 511,
    className: 'top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: '/images/decor/cursor.webp',
    width: 440,
    height: 432,
    className: 'bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      {decor.map((item) => (
        <FadeIn
          key={item.src}
          delay={item.delay}
          x={item.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute select-none ${item.className}`}
        >
          <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" className="h-auto w-full" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            delay={0}
            y={40}
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </FadeIn>
          <AnimatedText
            text={about}
            className="max-w-[560px] text-center font-medium leading-relaxed text-mist"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <dl className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 sm:gap-x-12">
            {stats.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.1} className="flex flex-col items-center gap-2 text-center">
                <dt className="order-2 max-w-[9rem] text-[11px] font-light uppercase leading-snug tracking-wider text-mist/70 sm:text-xs md:text-sm">
                  {stat.label}
                </dt>
                <dd className="order-1" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-black leading-none"
                    textClassName="hero-heading"
                  />
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>
        <FadeIn delay={0.2}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
