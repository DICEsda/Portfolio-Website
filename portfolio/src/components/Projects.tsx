import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { usePageActive } from '../hooks/usePageActive';
import { 
  FaReact, 
  FaNodeJs, 
  FaCode,
  FaEnvelope,
  FaBolt,
  FaDatabase,
  FaComments,
  FaPalette,
  FaCloud,
  FaCreditCard,
  FaLayerGroup,
  FaSitemap,
  FaGithub
} from 'react-icons/fa';
const ShowcaseModal = lazy(() => import('./ShowcaseModal'));

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
  sections?: Array<{
    title: string;
    description?: string;
    technologies: string[];
    sourceCode?: string;
  }>;
}

// Technology icons mapping with React Icons (hoisted to avoid re-creation)
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
  'Redux': <FaSitemap className="text-current" />,
  '.NET MAUI': <FaLayerGroup className="text-current" />,
  'C#': <FaCode className="text-current" />,
  '.NET Core 9': <FaLayerGroup className="text-current" />,
  'Entity Framework': <FaDatabase className="text-current" />,
  'SQLite': <FaDatabase className="text-current" />,
  'OpenAI API': <FaBolt className="text-current" />,
  'Google OAuth': <FaCloud className="text-current" />,
  'JWT': <FaCode className="text-current" />,
  'Framer Motion': <FaBolt className="text-current" />,
  'Recharts': <FaLayerGroup className="text-current" />,
  'React Native': <FaReact className="text-current" />,
  'Expo': <FaReact className="text-current" />,
  'JSON Server': <FaDatabase className="text-current" />,
  'Home Assistant': <FaCloud className="text-current" />,
  'YAML': <FaCode className="text-current" />,
  'IoT': <FaCloud className="text-current" />
};

// Languages for special green styling
const languageSet = new Set<string>([
  'TypeScript', 'JavaScript', 'C#', 'C', 'C++', 'Java', 'Kotlin', 'Swift', 'Dart', 'Go', 'Rust', 'Python', 'PHP', 'YAML', 'SQL'
]);

// Semester Project 3 PDF (existing)
const sp3Pdf = new URL('../../Project-Showcase/semester-projekt3/Semesterprojekt_3 endelig.pdf', import.meta.url).href;
// Fallback cover image: reuse hero image from src assets
const fallbackCover = new URL('../assets/hero-image.png', import.meta.url).href;

// Projects data hoisted to avoid recomputing
const projects: Project[] = [
    {
      title: "PersonalTracker: AI-Powered Life Analytics Platform",
      tagline: "Full-Stack Web Application | React + .NET Core + AI Integration",
      description: "A comprehensive personal analytics platform that transforms daily habits into actionable insights through AI-powered data analysis. Built as a sophisticated full-stack web application demonstrating expertise in modern software development practices, AI integration, and user experience design across fitness, mental health, finances, and personal reflection.",
      features: [
        "🤖 AI-Powered Insights Engine with OpenAI GPT-3.5 Turbo integration",
        "🔐 Advanced Authentication System with Google OAuth 2.0 + JWT",
        "📊 Real-Time Analytics Dashboard with live calculations",
        "💰 Financial Widget with net worth calculation and breakdown",
        "🏃 Comprehensive Data Tracking (fitness, mood, finances, journal)",
        "📱 Professional UI/UX with dark/light themes and smooth animations",
        "🔄 RESTful API with 25+ endpoints and Entity Framework",
        "📈 Pattern Recognition and Predictive Analytics"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", ".NET Core 9", "C#", "Entity Framework", "SQLite", "OpenAI API", "Google OAuth", "JWT", "Framer Motion", "Recharts"],
      coverImage: "",
      gallery: [],
      type: "AI-Powered Full-Stack Application",
      date: "2025",
      role: "Full Stack Developer + AI Integration Specialist",
      challenges: "Implementing reliable AI service with intelligent fallback mechanisms, designing complex data relationships supporting multiple data types, building performant calculation engine for live financial metrics, seamless Google OAuth integration with secure token management, and ensuring consistent cross-platform UI experience.",
      projectNature: "Personal Project (Portfolio-Ready)",
      tags: ["AI Integration", "Full Stack", "React", ".NET Core", "OpenAI", "OAuth"],
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker",
      sections: [
        {
          title: "Frontend (React + TypeScript)",
          description: "Modern React application with TypeScript, featuring reusable UI components with animations, API integration layer, Tailwind CSS with dark/light themes, mobile-first responsive design, and WCAG AA compliant accessibility.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Recharts"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker/PersonalTrackerReact"
        },
        {
          title: "Backend (.NET Core 9)",
          description: "RESTful API with 25+ endpoints, Entity Framework models with complex relationships, Google OAuth + JWT authentication, business logic & AI integration services, and comprehensive error handling with logging.",
          technologies: [".NET Core 9", "C#", "Entity Framework", "SQLite", "Google API", "JWT", "OpenAI API"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker/PersonalTrackerBackend"
        },
        {
          title: "AI Insights Engine",
          description: "OpenAI GPT-3.5 Turbo integration for generating personalized insights, pattern recognition in mood/fitness/spending, predictive analytics with weekly summaries, and rule-based fallback system for reliability.",
          technologies: ["OpenAI API", "GPT-3.5 Turbo", "C#", "Pattern Recognition"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker/PersonalTrackerBackend/Services"
        },
        {
          title: "Mobile App (React Native)",
          description: "Cross-platform mobile application with Expo, featuring tabbed navigation for finances, knowledge, meditation, prayer, and training with themed UI and EPUB reading capabilities.",
          technologies: ["React Native", "Expo", "TypeScript"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker/PersonalTrackerNative"
        }
      ]
    },
    {
      title: "Frontend Development Exam: Exam Management System",
      tagline: "Cross-platform academic exam administration solution",
      description: "A comprehensive exam management system built for the Frontend Development exam, featuring both React web application and .NET MAUI cross-platform mobile app. The system enables creating exams, managing students, conducting timed assessments, and tracking performance with bilingual support (Danish/English).",
      features: [
        "📝 Complete exam creation and management workflow",
        "👥 Student registration and assignment to exams", 
        "⏱️ Real-time exam timer with question randomization",
        "📊 Grade recording and performance analytics",
        "🌍 Bilingual interface (Danish/English)",
        "📱 Cross-platform mobile app with native performance",
        "🔄 REST API with JSON Server for data persistence",
        "📈 Exam history and average grade calculations"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", ".NET MAUI", "C#", "Framer Motion", "JSON Server"],
      coverImage: "",
      gallery: [],
      type: "Academic Cross-Platform Application",
      date: "2025",
      role: "Frontend Developer",
      challenges: "Implementing real-time exam functionality with accurate timers, ensuring data consistency between web and mobile platforms, creating intuitive UX for exam administration, and maintaining performance during timed assessments with multiple concurrent users.",
      projectNature: "University Exam Project",
      tags: ["Academic", "Cross-Platform", "React", ".NET MAUI", "Bilingual"],
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Frontend%20Examen",
      sections: [
        {
          title: "Web Application (React)",
          description: "Modern React application with TypeScript and Tailwind CSS, featuring exam creation forms, student management, real-time exam interface with timer, and comprehensive analytics dashboard.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "JSON Server"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Frontend%20Examen/Exam-React"
        },
        {
          title: "Mobile App (.NET MAUI)",
          description: "Cross-platform mobile application supporting iOS, Android, and Windows, with native performance for exam administration on mobile devices and offline capability for remote exam scenarios.",
          technologies: [".NET MAUI", "C#", "XAML"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Frontend%20Examen/ExamMaui"
        }
      ]
    },
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
      gallery: [],
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
      description: "I built this portfolio to show how I design and ship front‑end work. It’s React + TypeScript with Tailwind, smooth section navigation, light/dark theme, and playful but performant animations. The contact form runs on EmailJS, and the app is tuned for quick loads with Vite and lazy chunks. It’s a small project, but it reflects how I think about UX, accessibility, and clean, readable code.",
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
      title: "Semester Project 4 — Finance Tracker",
      tagline: "Cross-platform finance management with PDF generation and bilingual UI",
      description: "A comprehensive finance tracking solution delivered as both a .NET MAUI mobile app and a React web app. It features secure authentication, budget/category management, transaction history, analytics, and PDF report generation in both Danish and English. Built with a clean architecture and focus on performance, accessibility, and developer experience.",
      features: [
        "User authentication and role-based access",
        "Budgets, categories, and transaction management",
        "Analytics dashboards and insights",
        "PDF report generation (DK/EN)",
        "Responsive web UI and native mobile",
        "Robust testing strategy and CI-ready structure"
      ],
      technologies: [
        "React",
        ".NET MAUI",
        "C#",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "MongoDB"
      ],
  coverImage: fallbackCover,
  gallery: [sp3Pdf],
      type: "Cross-Platform App + Web",
      date: "Spring 2025",
      role: "Full Stack Developer",
      challenges: "Designing a shared domain model across mobile and web, ensuring PDF generation parity across platforms, implementing bilingual UX without duplication, and maintaining performance while supporting analytics.",
      projectNature: "University Project",
      tags: [".NET MAUI", "React", "TypeScript", "PDF", "i18n"]
    },
    {
      title: "Semester Project 3 — [Title]",
      tagline: "Academic project with strong documentation and delivery",
      description: "Semester project with a focus on practical implementation and thorough documentation. Delivered with a complete final report and polished outcomes.",
      features: [
        "Well-documented architecture and process",
        "Clear scope and deliverables",
        "Demonstrable outcomes",
        "Focus on maintainability"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS"],
  coverImage: fallbackCover,
  gallery: [sp3Pdf],
      type: "Academic Project",
      date: "2024/2025",
      role: "Developer",
      challenges: "Balancing scope with quality while maintaining strong documentation and consistent delivery.",
      projectNature: "University Project",
      tags: ["Academia", "Documentation", "Frontend"]
    }
  ].sort((a, b) => {
    if (a.title === "Portfolio Website") return -1;
    if (b.title === "Portfolio Website") return 1;
    if (a.title === "Home Assistant Automations") return 1;
    if (b.title === "Home Assistant Automations") return -1;
    return 0;
  });


function Projects() {

  const [currentProject, setCurrentProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
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
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(1);
    const nextIndex = (currentProject + 1) % projects.length;
    setCurrentProject(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(-1);
    const nextIndex = (currentProject - 1 + projects.length) % projects.length;
    setCurrentProject(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToProject = (index: number) => {
    if (isAnimating || index === currentProject) return;
    setIsAnimating(true);
    setSlideDirection(index > currentProject ? 1 : -1);
    setCurrentProject(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentProjectData = projects[currentProject];
  // Group technologies for display: languages first
  const techLanguages = currentProjectData.technologies.filter((t) => languageSet.has(t));
  const techOthers = currentProjectData.technologies.filter((t) => !languageSet.has(t));

  return (
    <>
      <section 
        id="projects" 
        ref={sectionRef} 
        className="h-screen flex items-center justify-center overflow-x-hidden pt-16"
  >
  <div className="container mx-auto px-2 xs:px-3 sm:px-4 max-w-7xl">
          <m.h2 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center transition-all duration-1000 text-light scroll-animate ${
              initialLoad ? 'opacity-0 scale-75' : 
              inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={usePageActive('projects') ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Featured Projects
          </m.h2>
        
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={usePageActive('projects') ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`relative transition-all duration-1000 delay-300 ${
            initialLoad ? 'opacity-0 translate-y-10' : 
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          >
            {/* Navigation Arrows - positioned within safe viewport bounds */}
            <button
              onClick={prevProject}
              className="absolute left-2 md:-left-16 top-1/2 transform -translate-y-1/2 z-10 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110 p-2"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextProject}
              className="absolute right-2 md:-right-16 top-1/2 transform -translate-y-1/2 z-10 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110 p-2"
              aria-label="Next project"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Project Content */}
            <div className="project-content relative">
              {/* Loader overlay for carousel transitions and image loading */}
              <AnimatePresence>
                {isAnimating && (
                  <m.div
                    key="carousel-loader"
                    className="absolute inset-0 z-20 flex items-center justify-center bg-primary/55 backdrop-blur-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Loading project"
                  >
                    <div className="flex items-end gap-2">
                      {[0, 1, 2].map((i) => (
                        <m.span
                          key={i}
                          className="block rounded-full"
                          style={{ width: 8, height: 8, backgroundColor: 'var(--color-secondary)' }}
                          animate={{ y: [0, -8, 0], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 0.9, ease: [0.4, 0.0, 0.2, 1.0], repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={currentProject}
                  custom={slideDirection}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Unified centered card layout for all projects */}
                  <m.div className="max-w-4xl mx-auto text-center px-3 xs:px-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}>
                    <h3 className="text-fluid-xl xs:text-fluid-2xl font-semibold text-light mb-4 scroll-animate">
                      {currentProjectData.title}
                    </h3>
                    <m.div className="bg-card p-4 xs:p-6 rounded-lg mb-4 xs:mb-5 shadow-lg scroll-animate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
                      <p className="text-fluid-base text-tertiary leading-relaxed">{currentProjectData.description}</p>
                    </m.div>
                    <div className="flex flex-wrap justify-center gap-2 xs:gap-2.5 sm:gap-3 mb-4 xs:mb-5 scroll-animate">
                      {[...techLanguages, ...techOthers].map((tech) => {
                        const isLang = languageSet.has(tech);
                        const colorClass = isLang
                          ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-secondary bg-secondary/10 border-secondary/20';
                        return (
                          <span
                            key={tech}
                            className={`text-[0.8rem] xs:text-sm px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${colorClass}`}
                          >
                            {techIcons[tech] && <span className="w-4 h-4">{techIcons[tech]}</span>}
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                    {/* To‑do note moved to Navbar */}
                    <div className="max-w-2xl mx-auto flex items-stretch gap-3">
                      <button
                        onClick={() => setSelectedProject(currentProjectData)}
                        className="flex-[2] py-2.5 xs:py-3 px-4 xs:px-6 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg text-fluid-sm xs:text-fluid-base font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] touch-manipulation"
                      >
                        <span>View Project Showcase</span>
                        <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {currentProjectData.sourceCode && (
                        <a
                          href={currentProjectData.sourceCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-[1] py-2 xs:py-2.5 px-4 xs:px-6 bg-card border border-tertiary/25 text-secondary rounded-lg hover:bg-secondary/10 hover:border-secondary/40 transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 text-[0.9rem] hover:scale-[1.01]"
                        >
                          <FaGithub className="w-4 h-4" />
                          <span>View on GitHub</span>
                        </a>
                      )}
                    </div>
                  </m.div>
                </m.div>
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
          </m.div>
        </div>
  </section>
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={null}>
            <ShowcaseModal
              project={selectedProject as Project}
              onClose={() => setSelectedProject(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}

export default Projects;
