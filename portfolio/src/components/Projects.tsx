import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaCode,
  FaEnvelope,
  FaBolt,
  FaDatabase,
  FaComments,
  FaPalette,
  FaChevronLeft,
  FaChevronRight,
  FaCloud,
  FaCreditCard,
  FaLayerGroup,
  FaSitemap
} from 'react-icons/fa';
import ShowcaseModal from './ShowcaseModal';

interface Project {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  coverImage: string;
  gallery?: string[];
  type: string;
  liveDemo?: string;
  sourceCode?: string;
  date: string;
  role: string;
  challenges: string;
  projectNature: string;
  tags: string[];
}



function Projects() {
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
      title: "Home Assistant Automations",
      tagline: "Smart Home Automation Suite",
      description: "A comprehensive collection of Home Assistant automations that transform a regular house into an intelligent living space. Features various automation scripts for different scenarios, from security notifications to daily routines.",
      features: [
        "Smart doorbell notification system with visual alerts",
        "Automated morning and night routines",
        "Power consumption monitoring and alerts",
        "Smart scene management for different times of day",
        "Automated security features"
      ],
      technologies: ["Home Assistant", "YAML", "IoT", "WLED", "Automation"],
      coverImage: "",
      type: "IoT/Smart Home",
      sourceCode: "https://github.com/DICEsda/HomeAssistant-automations",
      date: "2025",
      role: "Smart Home Developer",
      challenges: "Creating reliable and efficient automations that work seamlessly together, handling multiple device states, and ensuring fail-safe operation for critical functions.",
      projectNature: "Personal Project",
      tags: ["IoT", "Home Automation", "YAML", "Smart Home"]
    },
    {
      title: "Portfolio Website",
      tagline: "A modern, responsive portfolio showcase",
      description: "A modern, responsive portfolio website built with React and TypeScript. Features include smooth scroll navigation, dark/light mode toggle, animated sections, and a functional contact form with EmailJS integration. The design emphasizes clean aesthetics with custom color schemes and smooth transitions.",
      features: [
        "Smooth scroll navigation",
        "Dark/light mode toggle",
        "Animated sections",
        "Functional contact form",
        "Custom color schemes"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "EmailJS", "Vite"],
      coverImage: "",
      gallery: [],
      type: "Web Application",
      liveDemo: "https://your-portfolio-url.com",
      sourceCode: "https://github.com/yourusername/portfolio",
      date: "September 2025",
      role: "Frontend Developer",
      challenges: "Implementing smooth animations while maintaining performance, creating a responsive design that works across all devices, and ensuring accessibility standards are met.",
      projectNature: "Personal Project",
      tags: ["Portfolio", "Frontend", "React"]
    },
    {
      title: "Real-Time Chat App",
      tagline: "Full-stack real-time web application",
      description: "A full-stack web application built with React and Node.js. Features include user authentication, real-time updates, and responsive design.",
      features: [
        "User authentication",
        "Real-time updates",
        "Responsive design",
        "Database integration"
      ],
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      coverImage: "",
      gallery: [],
      type: "Full Stack Application",
      liveDemo: "https://project-one-demo.com",
      sourceCode: "https://github.com/yourusername/project-one",
      date: "August 2025",
      role: "Full Stack Developer",
      challenges: "Implementing real-time functionality, managing state across the application, and optimizing database queries for performance.",
      projectNature: "Personal Project",
      tags: ["Full Stack", "Real-time", "Web App"]
    },
    {
      title: "E-Shop Platform",
      tagline: "Modern e-commerce platform",
      description: "An e-commerce platform with features like product search, cart management, and secure payment processing.",
      features: [
        "Product search",
        "Cart management",
        "Secure payments",
        "Order tracking"
      ],
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      coverImage: "",
      gallery: [],
      type: "E-commerce Platform",
      liveDemo: "https://project-two-demo.com",
      sourceCode: "https://github.com/yourusername/project-two",
      date: "July 2025",
      role: "Frontend Developer",
      challenges: "Implementing secure payment processing, optimizing the checkout flow, and ensuring a smooth user experience across different devices.",
      projectNature: "Client Project",
      tags: ["E-commerce", "Next.js", "Payments"]
    },
    {
      title: "TaskFlow Manager",
      tagline: "Collaborative task management app",
      description: "A task management application with drag-and-drop functionality, team collaboration, and progress tracking.",
      features: [
        "Drag-and-drop interface",
        "Team collaboration",
        "Progress tracking",
        "Real-time updates"
      ],
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      coverImage: "",
      gallery: [],
      type: "Web Application",
      liveDemo: "https://project-three-demo.com",
      sourceCode: "https://github.com/yourusername/project-three",
      date: "June 2025",
      role: "Frontend Developer",
      challenges: "Implementing smooth drag-and-drop functionality, managing complex state with Redux, and ensuring real-time updates work reliably.",
      projectNature: "Team Project",
      tags: ["Productivity", "Collaboration", "React"]
    }
  ].sort((a, b) => {
    if (a.title === "Portfolio Website") return -1;
    if (b.title === "Portfolio Website") return 1;
    if (a.title === "Home Assistant Automations") return 1;
    if (b.title === "Home Assistant Automations") return -1;
    return 0;
  });

  const [currentProject, setCurrentProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
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
  setDirection(1);
      const nextIndex = (currentProject + 1) % projects.length;
      
      setTimeout(() => {
        setCurrentProject(nextIndex);
        setIsAnimating(false);
      }, 250);
    }
  };

  const prevProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
  setDirection(-1);
      const nextIndex = (currentProject - 1 + projects.length) % projects.length;
      
      setTimeout(() => {
        setCurrentProject(nextIndex);
        setIsAnimating(false);
      }, 250);
    }
  };

  const goToProject = (index: number) => {
    if (!isAnimating && index !== currentProject) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentProject(index);
        setIsAnimating(false);
      }, 250);
    }
  };

  const currentProjectData = projects[currentProject];

  // Slide variants for project content based on navigation direction
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40, scale: 0.98 })
  };


  return (
    <>
      <motion.div 
        id="projects" 
        ref={sectionRef} 
  className="min-h-screen flex items-center justify-center py-0 scroll-container overflow-x-hidden scroll-snap-align-start"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 1
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 md:pl-20 lg:pl-24 max-w-5xl transform -translate-y-10 md:-translate-y-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-light">
            Featured Projects
          </h2>
        
          <div className={`relative transition-all duration-1000 delay-300 ${
            initialLoad ? 'opacity-0 translate-y-10' : 
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Navigation Arrows */}
            <motion.button
              onClick={prevProject}
              className="absolute left-2 md:-left-24 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 text-tertiary hover:text-secondary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              aria-label="Previous project"
              whileTap={{}}
            >
              <motion.span 
                animate={{ x: isAnimating ? -3 : 0 }} 
                whileTap={{ rotate: -15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </motion.span>
            </motion.button>
            
            <motion.button
              onClick={nextProject}
              className="absolute right-2 md:-right-24 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 text-tertiary hover:text-secondary transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              aria-label="Next project"
              whileTap={{}}
            >
              <motion.span 
                animate={{ x: isAnimating ? 3 : 0 }} 
                whileTap={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <FaChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </motion.span>
            </motion.button>

            {/* Project Content */}
            <div className="project-content">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProject}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
              {currentProject === 0 ? (
                // Centered layout for portfolio project
                <div className="max-w-4xl mx-auto text-center px-4 xs:px-6">
                  <h3 className="text-fluid-xl xs:text-fluid-2xl font-semibold text-light mb-4 scroll-animate">
                    {currentProjectData.title}
                  </h3>
                  <div className="bg-card p-4 xs:p-6 rounded-lg mb-6 shadow-lg scroll-animate">
                    <p className="text-fluid-base text-tertiary leading-relaxed">{currentProjectData.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mb-6 scroll-animate">
                    {currentProjectData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-fluid-sm text-secondary bg-secondary/10 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full flex items-center gap-1.5 xs:gap-2"
                      >
                        {techIcons[tech] && techIcons[tech]}
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4 xs:space-y-6 max-w-2xl mx-auto">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      {currentProjectData.type === "IoT/Smart Home" && (
                        <div className="absolute top-3 xs:top-4 left-3 xs:left-4 px-2 xs:px-3 py-1 xs:py-1.5 bg-primary/90 backdrop-blur-sm text-secondary rounded-lg text-fluid-sm font-medium border border-secondary/20 z-10">
                          Home Assistant Project
                        </div>
                      )}
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-card rounded-lg">
                        {currentProjectData.coverImage && (
                          <img
                            src={currentProjectData.coverImage}
                            alt={currentProjectData.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                      </div>
                      {currentProjectData.sourceCode && (
                        <a
                          href={currentProjectData.sourceCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 xs:bottom-4 right-3 xs:right-4 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg transition-all duration-300 shadow-lg font-medium flex items-center gap-1.5 xs:gap-2 text-fluid-sm z-10 bg-primary/80 backdrop-blur text-light hover:text-secondary"
                        >
                          <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                          View Source
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProject(currentProjectData)}
                      className="w-full py-2.5 xs:py-3 px-4 xs:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg text-fluid-base xs:text-fluid-lg font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transform touch-manipulation"
                    >
                      <span>View Project Showcase</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Alternating layout for other projects
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                  <div className="md:text-left order-2 md:order-1">
                    <h3 className="text-fluid-xl xs:text-fluid-2xl font-semibold text-light mb-4">
                      {currentProjectData.title}
                    </h3>
                    <div className="bg-card p-4 xs:p-6 rounded-lg mb-4 xs:mb-6 shadow-lg">
                      <p className="text-fluid-base text-tertiary leading-relaxed">{currentProjectData.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6">
                      {currentProjectData.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-fluid-sm text-secondary bg-secondary/10 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full flex items-center gap-1.5 xs:gap-2"
                        >
                          {techIcons[tech] && techIcons[tech]}
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="rounded-lg">
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-card rounded-lg">
                        {currentProjectData.coverImage && (
                          <img
                            src={currentProjectData.coverImage}
                            alt={currentProjectData.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-2 xs:gap-3">
                        <motion.button
                          onClick={() => setSelectedProject(currentProjectData)}
                          className="w-full py-2.5 xs:py-3 px-4 xs:px-6 bg-blue-600 text-white rounded-lg shadow-lg text-fluid-base xs:text-fluid-lg font-semibold flex items-center justify-center gap-2 touch-manipulation transform transition-transform duration-200 hover:scale-[1.02]"
                          whileHover={{}}
                          whileTap={{}}
                        >
                          <span>View Project Showcase</span>
                        </motion.button>
            {currentProjectData.sourceCode && (
                          <a
                            href={currentProjectData.sourceCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 xs:py-2.5 px-4 xs:px-6 rounded-lg transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 text-fluid-sm hover:scale-[1.02] transform bg-primary/80 backdrop-blur text-light hover:text-secondary"
                          >
                            <FaCode className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                            <span>View Source</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </motion.div>
              </AnimatePresence>
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
                      : 'bg-gray-400 hover:bg-gray-600'
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
      </motion.div>
      <AnimatePresence>
        {selectedProject && (
          <ShowcaseModal
            project={selectedProject as Project}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Projects;
