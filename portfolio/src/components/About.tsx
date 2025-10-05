import { FaCheck } from 'react-icons/fa';
import { m } from 'framer-motion';
import { usePageActive } from '../hooks/usePageActive';

const About = () => {
  const skills = [
    'React / Angular + Tailwind',
    'Node.js',
    '.net Ecosystem',
    'Git',
    'Next.js',
    'Vitest',
    'NUnit',
    'LangChain',
    'CrewAI',
    'n8n',
  ]

  const favorites = [
    'Angular / React + TypeScript with Tailwind for clean UI',
    'Esp32 Mastery for IOT Projects',
    'App Development with React Native and .NET MAUI',
    'Strong experience with the .NET ecosystem',
    'Databases including SQL Server, and MongoDB',
    'Raspberry Pi Automations, and general Linux tinkering',
    'Continuous integration and deployment (CI/CD) using GitHub Actions',
    'AI/LLM integrations using LangChain, CrewAI, and n8n',
    'Building general scalable and maintainable software architectures with a focus on clean design and long-term flexibility',

  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.02,
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.07,
        when: 'beforeChildren'
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  }

  const languages = [
    'JS/TS',
    'C#',
    'Python',
    'C++',
  ]

  return (
  <section className="h-screen flex items-center justify-center py-0" aria-label="About section">
    {/* Scaled down globally by 15% (0.85) using Tailwind arbitrary scale utility for broad browser support */}
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl transform origin-center scale-[0.85]">
        <m.div
          className="text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={usePageActive('about') ? 'show' : 'hidden'}
        >
          <m.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-light">
            About Me
          </m.h2>
          <m.p variants={itemVariants} className="text-tertiary mt-3 max-w-3xl mx-auto leading-relaxed">
            I specialize in building scalable, maintainable software architectures with a focus on clean design and long-term flexibility. I enjoy turning complex ideas into reliable, user-friendly experiences that stand the test of time.
          </m.p>
        </m.div>

        <m.div
          className="grid md:grid-cols-3 gap-6 md:gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate={usePageActive('about') ? 'show' : 'hidden'}
        >
          <m.div
            variants={itemVariants}
            className="bg-card md:col-span-2 p-5 md:p-6 rounded-lg shadow-xl border border-secondary/20"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-light mb-5">What I Like Working With</h3>
            <m.ul className="grid grid-cols-1 gap-3 text-tertiary" variants={containerVariants} initial="hidden" animate={usePageActive('about') ? 'show' : 'hidden'}>
              {favorites.map((item) => (
                <m.li key={item} className="flex items-start gap-3" variants={itemVariants}>
                  <FaCheck className="mt-0.5 text-secondary shrink-0" />
                  <span className="text-base leading-relaxed">{item}</span>
                </m.li>
              ))}
            </m.ul>
          </m.div>

          <m.div variants={itemVariants} className="md:col-span-1">
            <div className="bg-card p-5 md:p-6 rounded-lg shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold text-light mb-5">Main Languages</h3>
              <m.ul className="grid grid-cols-2 gap-3 text-tertiary" variants={containerVariants} initial="hidden" animate={usePageActive('about') ? 'show' : 'hidden'}>
                {languages.map((lang) => (
                  <m.li key={lang} className="flex items-center" variants={itemVariants}>
                    <span className="text-secondary mr-3">▹</span>
                    <span className="text-sm">{lang}</span>
                  </m.li>
                ))}
              </m.ul>
              <hr className="my-4 border-tertiary/15" />
              <h3 className="text-lg md:text-xl font-semibold text-light mb-4">Core Technologies and Frameworks</h3>
              <m.ul className="grid grid-cols-2 gap-3 text-tertiary" variants={containerVariants} initial="hidden" animate={usePageActive('about') ? 'show' : 'hidden'}>
                {skills.map((skill) => (
                  <m.li key={skill} className="flex items-center" variants={itemVariants}>
                    <span className="text-secondary mr-3">▹</span>
                    <span className="text-sm">{skill}</span>
                  </m.li>
                ))}
              </m.ul>
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}

export default About 