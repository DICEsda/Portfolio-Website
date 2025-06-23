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
    <section id="about" ref={sectionRef} className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div 
            className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-light">About Me</h2>
            <p className="text-tertiary mb-4 leading-relaxed">
              Hello! I'm Yahya, a passionate software developer with a knack for creating dynamic and user-friendly web applications. My journey into the world of programming started with a simple curiosity for how things work, and it has since grown into a full-fledged passion for building elegant and efficient solutions.
            </p>
            <p className="text-tertiary leading-relaxed">
              I have experience working with a variety of technologies and I'm always eager to learn more. I thrive in collaborative environments and I'm dedicated to writing clean, maintainable code.
            </p>
          </div>
          <div 
            className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="bg-card p-8 rounded-lg shadow-lg">
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 