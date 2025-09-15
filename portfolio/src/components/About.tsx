import { useState, useEffect, useRef } from 'react';

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
    'TypeScript + React',
    'Clean UI with Tailwind',
    'Real-time UX (Socket.io)',
    'Automation & IoT tinkering',
    'Performance & accessibility',
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
  <section id="about" ref={sectionRef} className="min-h-screen flex items-center justify-center py-0 scroll-snap-align-start">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 md:pl-20 lg:pl-24 max-w-6xl transform -translate-y-10 md:-translate-y-16">
        <div className={`text-center mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-light">About Me</h2>
          <p className="text-tertiary mt-3 max-w-3xl mx-auto leading-relaxed">
            I love building clean, performant interfaces and practical solutions. I enjoy learning, collaborating, and turning ideas into reliable user experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
          <div className={`bg-card p-6 md:p-8 rounded-lg shadow-lg transition-all duration-700 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <h3 className="text-xl font-semibold text-light mb-6">Core Technologies</h3>
            <ul className="grid grid-cols-2 gap-4 text-tertiary">
              {skills.map((skill) => (
                <li key={skill} className="flex items-center">
                  <span className="text-secondary mr-3">▹</span>
                  <span className="text-sm">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`bg-card p-6 md:p-8 rounded-lg shadow-lg transition-all duration-700 delay-100 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <h3 className="text-xl font-semibold text-light mb-6">What I Like Working With</h3>
            <ul className="grid grid-cols-1 gap-3 text-tertiary">
              {favorites.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="text-secondary mr-3">▹</span>
                  <span className="text-sm">{item}</span>
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