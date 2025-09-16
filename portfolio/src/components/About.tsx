import { useState, useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';

const About = () => {
  const skills = [
    'JavaScript (ES6+)',
    'TypeScript',
    'React',
    'Node.js',
    'Tailwind CSS',
    'Git',
    'Next.js',
    'Python',
  ]

  const favorites = [
    'Angular / React + TypeScript with Tailwind for clean UI',
    'Esp32 Mastery for IOT Projects',
    'App Development with React Native and .NET MAUI',
    'Strong experience with the .NET ecosystem',
    'Raspberry Pi Automations, and general Linux tinkering',
    'Built scalable and maintainable software architectures with a focus on clean design and long-term flexibility',
  ]

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
  <section id="about" ref={sectionRef} className="h-screen flex items-center justify-center py-0 scroll-snap-align-start">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl transform -translate-y-10 md:-translate-y-16">
        <div className={`text-center mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-light">About Me</h2>
          <p className="text-tertiary mt-3 max-w-3xl mx-auto leading-relaxed">
          I enjoy designing scalable, well-structured solutions and turning complex ideas into reliable, user-friendly experiences!          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10 items-stretch">
          <div className={`bg-card md:col-span-2 p-6 md:p-8 rounded-lg shadow-xl border border-secondary/20 transition-all duration-700 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <h3 className="text-2xl md:text-3xl font-semibold text-light mb-6">What I Like Working With</h3>
            <ul className="grid grid-cols-1 gap-3 text-tertiary">
              {favorites.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FaCheck className="mt-0.5 text-secondary shrink-0" />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`bg-card p-5 md:p-6 rounded-lg shadow-lg transition-all duration-700 delay-100 will-change-transform md:col-span-1 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <h3 className="text-lg md:text-xl font-semibold text-light mb-5">Core Technologies</h3>
            <ul className="grid grid-cols-2 gap-3 text-tertiary">
              {skills.map((skill) => (
                <li key={skill} className="flex items-center">
                  <span className="text-secondary mr-3">▹</span>
                  <span className="text-sm">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 