import { useState, useEffect, useRef } from 'react';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase,
  FaCode,
  FaEnvelope,
  FaBolt,
  FaComments,
  FaPalette,
  FaCogs,
  FaChevronLeft,
  FaChevronRight,
  FaAtom,
  FaServer,
  FaCloud,
  FaCreditCard,
  FaLayerGroup,
  FaSitemap
} from 'react-icons/fa';

interface Project {
  title: string
  description: string
  technologies: string[]
  image: string
}

interface TechIcon {
  name: string
  icon: JSX.Element
}

const Projects = () => {
  // Technology icons mapping with React Icons
  const techIcons: { [key: string]: JSX.Element } = {
    'React': <FaReact className="text-current" />,
    'TypeScript': <FaCode className="text-current" />,
    'Tailwind CSS': <FaPalette className="text-current" />,
    'EmailJS': <FaEnvelope className="text-current" />,
    'Vite': <FaBolt className="text-current" />,
    'Node.js': <FaNodeJs className="text-current" />,
    'MongoDB': <FaDatabase className="text-current" />,
    'Socket.io': <FaComments className="text-current" />,
    'Next.js': <FaCode className="text-current" />,
    'Stripe': <FaCreditCard className="text-current" />,
    'Firebase': <FaCloud className="text-current" />,
    'Material-UI': <FaLayerGroup className="text-current" />,
    'Redux': <FaSitemap className="text-current" />
  };

  const projects: Project[] = [
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website built with React and TypeScript. Features include smooth scroll navigation, dark/light mode toggle, animated sections, and a functional contact form with EmailJS integration. The design emphasizes clean aesthetics with custom color schemes and smooth transitions.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "EmailJS", "Vite"],
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project One",
      description: "A full-stack web application built with React and Node.js. Features include user authentication, real-time updates, and responsive design.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Two",
      description: "An e-commerce platform with features like product search, cart management, and secure payment processing.",
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Three",
      description: "A task management application with drag-and-drop functionality, team collaboration, and progress tracking.",
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      image: "https://via.placeholder.com/600x400"
    }
  ]

  const [currentProject, setCurrentProject] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextProjectIndex, setNextProjectIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Initial animation on component mount
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px 0px -50px 0px',
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

  const nextProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const nextIndex = (currentProject + 1) % projects.length;
      setNextProjectIndex(nextIndex);
      
      setTimeout(() => {
        setCurrentProject(nextIndex);
        setIsAnimating(false);
      }, 250);
    }
  };

  const prevProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const nextIndex = (currentProject - 1 + projects.length) % projects.length;
      setNextProjectIndex(nextIndex);
      
      setTimeout(() => {
        setCurrentProject(nextIndex);
        setIsAnimating(false);
      }, 250);
    }
  };

  const goToProject = (index: number) => {
    if (!isAnimating && index !== currentProject) {
      setIsAnimating(true);
      setNextProjectIndex(index);
      
      setTimeout(() => {
        setCurrentProject(index);
        setIsAnimating(false);
      }, 250);
    }
  };

  const currentProjectData = projects[currentProject];

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-1000 text-light ${
          initialLoad ? 'opacity-0 scale-75' : 
          inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
        }`}>
          Featured Projects
        </h2>
        
        <div className={`relative transition-all duration-1000 delay-300 ${
          initialLoad ? 'opacity-0 translate-y-10' : 
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Navigation Arrows */}
          <button
            onClick={prevProject}
            className="absolute left-2 md:-left-24 top-1/2 transform -translate-y-1/2 z-10 bg-primary/80 backdrop-blur-sm border border-tertiary/20 rounded-full p-2 md:p-3 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110"
            aria-label="Previous project"
          >
            <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={nextProject}
            className="absolute right-2 md:-right-24 top-1/2 transform -translate-y-1/2 z-10 bg-primary/80 backdrop-blur-sm border border-tertiary/20 rounded-full p-2 md:p-3 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110"
            aria-label="Next project"
          >
            <FaChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Project Content */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {currentProject === 0 ? (
              // Centered layout for portfolio project
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-semibold text-light mb-4">
                  {currentProjectData.title}
                </h3>
                <div className="bg-card p-6 rounded-lg mb-6 shadow-lg">
                  <p className="text-tertiary leading-relaxed">{currentProjectData.description}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {currentProjectData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm text-secondary bg-secondary/10 px-3 py-2 rounded-full flex items-center gap-2"
                    >
                      {techIcons[tech] && techIcons[tech]}
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="relative overflow-hidden rounded-lg shadow-lg max-w-2xl mx-auto">
                  <img
                    src={currentProjectData.image}
                    alt={currentProjectData.title}
                    className="w-full h-auto hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ) : (
              // Alternating layout for other projects
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="md:text-left">
                  <h3 className="text-2xl font-semibold text-light mb-4">
                    {currentProjectData.title}
                  </h3>
                  <div className="bg-card p-6 rounded-lg mb-6 shadow-lg">
                    <p className="text-tertiary leading-relaxed">{currentProjectData.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {currentProjectData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm text-secondary bg-secondary/10 px-3 py-2 rounded-full flex items-center gap-2"
                      >
                        {techIcons[tech] && techIcons[tech]}
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={currentProjectData.image}
                      alt={currentProjectData.title}
                      className="w-full h-auto hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentProject 
                    ? 'bg-secondary scale-125' 
                    : 'bg-tertiary/30 hover:bg-tertiary/50'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          {/* Project Counter */}
          <div className="text-center mt-4">
            <span className="text-tertiary text-sm">
              {currentProject + 1} / {projects.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects 