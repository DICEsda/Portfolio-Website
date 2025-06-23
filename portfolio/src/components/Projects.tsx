import { useState, useEffect, useRef } from 'react';

interface Project {
  title: string
  description: string
  technologies: string[]
  github: string
  image: string
}

const Projects = () => {
  const projects: Project[] = [
    {
      title: "Project One",
      description: "A full-stack web application built with React and Node.js. Features include user authentication, real-time updates, and responsive design.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      github: "https://github.com/username/project-one",
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Two",
      description: "An e-commerce platform with features like product search, cart management, and secure payment processing.",
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      github: "https://github.com/username/project-two",
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Three",
      description: "A task management application with drag-and-drop functionality, team collaboration, and progress tracking.",
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      github: "https://github.com/username/project-three",
      image: "https://via.placeholder.com/600x400"
    }
  ]

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
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
    <section id="projects" ref={sectionRef} className="h-full flex items-center justify-center py-32">
      <div className="container-custom">
        <h2 className={`heading-primary mt-12 text-3xl md:text-4xl mb-5 ml-2 transition-all duration-700 text-light dark:text-dark-light ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Featured Projects
        </h2>
        <div className="space-y-20">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 200}ms` }}
            >
              <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''} ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-2xl font-semibold text-light dark:text-dark-light mb-4">
                  {project.title}
                </h3>
                <div className="bg-card dark:bg-dark-card p-6 rounded-lg mb-4 shadow-lg">
                  <p className="text-tertiary dark:text-dark-tertiary">{project.description}</p>
                </div>
                <div className={`flex flex-wrap gap-x-4 gap-y-2 mb-4 ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 text-sm text-secondary dark:text-dark-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={`flex gap-4 ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light hover:text-secondary transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects 