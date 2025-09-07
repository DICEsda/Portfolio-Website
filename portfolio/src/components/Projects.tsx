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
      coverImage: "https://via.placeholder.com/600x400",
      gallery: ["https://via.placeholder.com/600x400", "https://via.placeholder.com/600x400"],
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
      title: "Project One",
      tagline: "Full-stack real-time web application",
      description: "A full-stack web application built with React and Node.js. Features include user authentication, real-time updates, and responsive design.",
      features: [
        "User authentication",
        "Real-time updates",
        "Responsive design",
        "Database integration"
      ],
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      coverImage: "https://via.placeholder.com/600x400",
      gallery: ["https://via.placeholder.com/600x400"],
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
      title: "Project Two",
      tagline: "Modern e-commerce platform",
      description: "An e-commerce platform with features like product search, cart management, and secure payment processing.",
      features: [
        "Product search",
        "Cart management",
        "Secure payments",
        "Order tracking"
      ],
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      coverImage: "https://via.placeholder.com/600x400",
      gallery: ["https://via.placeholder.com/600x400"],
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
      title: "Project Three",
      tagline: "Collaborative task management app",
      description: "A task management application with drag-and-drop functionality, team collaboration, and progress tracking.",
      features: [
        "Drag-and-drop interface",
        "Team collaboration",
        "Progress tracking",
        "Real-time updates"
      ],
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      coverImage: "https://via.placeholder.com/600x400",
      gallery: ["https://via.placeholder.com/600x400"],
      type: "Web Application",
      liveDemo: "https://project-three-demo.com",
      sourceCode: "https://github.com/yourusername/project-three",
      date: "June 2025",
      role: "Frontend Developer",
      challenges: "Implementing smooth drag-and-drop functionality, managing complex state with Redux, and ensuring real-time updates work reliably.",
      projectNature: "Team Project",
      tags: ["Productivity", "Collaboration", "React"]
    }
  ];

  const [currentProject, setCurrentProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
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

  return (
    <>
      <motion.section 
        id="projects" 
        ref={sectionRef} 
        className="min-h-screen flex items-center justify-center py-20 scroll-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 
            className={`text-3xl md:text-4xl font-bold mb-12 text-center transition-all duration-1000 text-light scroll-animate ${
              initialLoad ? 'opacity-0 scale-75' : 
              inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
        
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
                  <h3 className="text-2xl font-semibold text-light mb-4 scroll-animate">
                    {currentProjectData.title}
                  </h3>
                  <div className="bg-card p-6 rounded-lg mb-6 shadow-lg scroll-animate">
                    <p className="text-tertiary leading-relaxed">{currentProjectData.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mb-6 scroll-animate">
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
                    <div className="relative">
                      <img
                        src={currentProjectData.coverImage}
                        alt={currentProjectData.title}
                        className="w-full h-auto hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setSelectedProject(currentProjectData)}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
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
                      <div className="relative">
                        <img
                          src={currentProjectData.coverImage}
                          alt={currentProjectData.title}
                          className="w-full h-auto hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => setSelectedProject(currentProjectData)}
                          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                          View Details
                        </button>
                      </div>
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
      </motion.section>
      <AnimatePresence>
        {selectedProject && (
          <ShowcaseModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Projects;
