import { MotionConfig } from 'framer-motion';
import { ContactFormProvider } from './components/ContactForm';
import AboutSection from './sections/AboutSection';
import AchievementsSection from './sections/AchievementsSection';
import ContactSection from './sections/ContactSection';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ContactFormProvider>
        <main className="bg-ink font-kanit" style={{ overflowX: 'clip' }}>
          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <AchievementsSection />
          <ContactSection />
        </main>
      </ContactFormProvider>
    </MotionConfig>
  );
}
