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
  FaChevronLeft,
  FaChevronRight,
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
  'C#': <FaCode className="text-current" />
};

// Asset URLs (bundled by Vite)
const sp4Cover = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 10 - Registrer bruger klasse diagram.png', import.meta.url).href;
const sp4VidMauiPdf = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 07 - PDF-Generering-MAUI_US9.mp4', import.meta.url).href;
const sp4VidBilingual = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 08 - Dansk-engelsk-MAUI.mp4', import.meta.url).href;
const sp4VidWebPdf = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 09 - PDF-Generering-DanskogEnglsk-Webapp.mp4', import.meta.url).href;
const sp4DocProcess = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 01 - Procesbeskrivelse.pdf', import.meta.url).href;
const sp4DocTech = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 04 - Teknisk analyse.docx', import.meta.url).href;
const sp4DocFrontend = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 05 - Frontend Web.docx', import.meta.url).href;
const sp4DocTests = new URL('../../Project-Showcase/semester-project4/Bilag (2)/Bilag/Bilag 06 - Tests.docx', import.meta.url).href;
const sp3Pdf = new URL('../../Project-Showcase/Semesterprojekt 3/Semesterprojekt_3 endelig.pdf', import.meta.url).href;
const sp3Cover = sp4Cover; // reuse a safe image as cover; can be changed later
// Personal Tracker assets
const ptCover = new URL('../../Project-Showcase/PersonalTracker-main/PersonalTrackerNative/assets/images/icon.png', import.meta.url).href;
const ptReadme = new URL('../../Project-Showcase/PersonalTracker-main/README.md', import.meta.url).href;
const ptPrd = new URL('../../Project-Showcase/PersonalTracker-main/ProductRequirementDocument.md', import.meta.url).href;

// Projects data hoisted to avoid recomputing
const projects: Project[] = [
    {
      title: "Personal Tracker — Suite",
      tagline: "Native + Web app with .NET and Node backends",
      description: "A multi-platform personal tracker consisting of a React web app, an Expo/React Native app, a .NET 9 backend with SQLite and Google Calendar integration, and a Node/Express food microservice. The suite tracks finances, training, prayer, knowledge, and integrates calendar events.",
      features: [
        "Modular native and web frontends",
        ".NET 9 backend with EF Core + SQLite",
        "Google Calendar API integration",
        "Node/Express food service",
        "Dashboard metrics and graphs"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Expo", "React Native", ".NET 9", "C#", "SQLite", "Express", "Node.js"],
      coverImage: ptCover,
      gallery: [ptPrd, ptReadme],
      type: "Multi-platform App",
      date: "2025",
      role: "Full Stack Developer",
      challenges: "Coordinating multiple frontends with separate backends, maintaining shared domain concepts, handling OAuth and Google Calendar API flows, and ensuring consistent UX across platforms.",
      projectNature: "Personal Project",
      tags: ["Full Stack", "React", "Expo", ".NET", "Node"],
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker-main",
      sections: [
        {
          title: "Native App (Expo)",
          description: "Tabs for finances, knowledge, meditation, prayer, and training with themed UI and EPUB reading.",
          technologies: ["Expo", "React Native", "TypeScript"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker-main/PersonalTrackerNative"
        },
        {
          title: "Web App (React)",
          description: "Dashboard grid, metric cards, graph modal, and Google Calendar integration.",
          technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker-main/PersonalTrackerReact"
        },
        {
          title: ".NET Backend",
          description: "ASP.NET Core 9 with EF Core, SQLite, and Google Calendar service.",
          technologies: [".NET 9", "C#", "EF Core", "SQLite", "Google API"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker-main/PersonalTrackerBackend"
        },
        {
          title: "Node Food Service",
          description: "Express microservice with basic routes and static pages.",
          technologies: ["Node.js", "Express"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/PersonalTracker-main/food-backend"
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
      coverImage: sp4Cover,
      gallery: [
        sp4VidMauiPdf,
        sp4VidBilingual,
        sp4VidWebPdf,
        sp4DocProcess,
        sp4DocTech,
        sp4DocFrontend,
        sp4DocTests
      ],
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
      coverImage: sp3Cover,
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
    setImgLoading(Boolean(projects[nextIndex].coverImage));
    setCurrentProject(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(-1);
    const nextIndex = (currentProject - 1 + projects.length) % projects.length;
    setImgLoading(Boolean(projects[nextIndex].coverImage));
    setCurrentProject(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToProject = (index: number) => {
    if (isAnimating || index === currentProject) return;
    setIsAnimating(true);
    setSlideDirection(index > currentProject ? 1 : -1);
    setImgLoading(Boolean(projects[index].coverImage));
    setCurrentProject(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentProjectData = projects[currentProject];
  const [imgLoading, setImgLoading] = useState<boolean>(true);

  return (
    <>
      <section 
        id="projects" 
        ref={sectionRef} 
        className="h-screen flex items-center justify-center overflow-x-hidden"
  >
  <div className="container mx-auto px-3 xs:px-4 sm:px-5 max-w-6xl">
          <m.h2 
            className={`text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center transition-all duration-1000 text-light scroll-animate ${
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
            <div className="project-content relative">
              {/* Loader overlay for carousel transitions and image loading */}
              <AnimatePresence>
                {(isAnimating || (imgLoading && Boolean(currentProjectData.coverImage))) && (
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
                  transition={{ type: "spring", stiffness: 60, damping: 15, opacity: { duration: 0.2 } }}
                >
              {currentProject === 0 ? (
                // Centered layout for portfolio project
                <m.div className="max-w-4xl mx-auto text-center px-4 xs:px-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}>
                  <h3 className="text-fluid-xl xs:text-fluid-2xl font-semibold text-light mb-4 scroll-animate">
                    {currentProjectData.title}
                  </h3>
                  <m.div className="bg-card p-4 xs:p-6 rounded-lg mb-6 shadow-lg scroll-animate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
                    <p className="text-fluid-base text-tertiary leading-relaxed">{currentProjectData.description}</p>
                  </m.div>
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
                  <m.div className="space-y-4 xs:space-y-6 max-w-2xl mx-auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.28 }}>
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      {currentProjectData.type === "IoT/Smart Home" && (
                        <div className="absolute top-3 xs:top-4 left-3 xs:left-4 px-2 xs:px-3 py-1 xs:py-1.5 bg-primary/90 backdrop-blur-sm text-secondary rounded-lg text-fluid-sm font-medium border border-secondary/20 z-10">
                          Home Assistant Project
                        </div>
                      )}
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-card">
                        {currentProjectData.coverImage && (
                          <>
                            {imgLoading && (
                              <div className="w-full h-full animate-pulse bg-tertiary/10" />
                            )}
                            <img
                              src={currentProjectData.coverImage}
                              alt={currentProjectData.title}
                              className={`w-full h-full object-cover transition-transform duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100 hover:scale-105'}`}
                              loading="lazy"
                              onLoad={() => setImgLoading(false)}
                            />
                          </>
                        )}
                      </div>
                      {/* Source link moved below action buttons for consistency */}
                    </div>
                    <button
                      onClick={() => setSelectedProject(currentProjectData)}
                      className="w-full py-2.5 xs:py-3 px-4 xs:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg text-fluid-base xs:text-fluid-lg font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transform touch-manipulation"
                    >
                      <span>View Project Showcase</span>
                      <FaChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                    </button>
                    {currentProjectData.sourceCode && (
                      <a
                        href={currentProjectData.sourceCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 xs:py-2.5 px-4 xs:px-6 bg-card border border-tertiary/25 text-secondary rounded-lg hover:bg-secondary/10 hover:border-secondary/40 transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 text-fluid-sm hover:scale-[1.02] transform"
                      >
                        <FaGithub className="w-4 h-4" />
                        <span>View on GitHub</span>
                      </a>
                    )}
                  </m.div>
                </m.div>
              ) : (
                // Alternating layout for other projects
                <m.div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <m.div className="md:text-left order-2 md:order-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                    <h3 className="text-fluid-xl xs:text-fluid-2xl font-semibold text-light mb-4">
                      {currentProjectData.title}
                    </h3>
                    <m.div className="bg-card p-4 xs:p-6 rounded-lg mb-4 xs:mb-6 shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <p className="text-fluid-base text-tertiary leading-relaxed">{currentProjectData.description}</p>
                    </m.div>
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
                  </m.div>
                  <m.div className="order-1 md:order-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                    <m.div className="relative overflow-hidden rounded-lg shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-card">
                        {currentProjectData.coverImage && (
                          <>
                            {imgLoading && (
                              <div className="w-full h-full animate-pulse bg-tertiary/10" />
                            )}
                            <img
                              src={currentProjectData.coverImage}
                              alt={currentProjectData.title}
                              className={`w-full h-full object-cover transition-transform duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100 hover:scale-105'}`}
                              loading="lazy"
                              onLoad={() => setImgLoading(false)}
                            />
                          </>
                        )}
                      </div>
                      <m.div className="flex flex-col gap-2 xs:gap-3 mt-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
                        <m.button
                          onClick={() => setSelectedProject(currentProjectData)}
                          className="w-full py-2.5 xs:py-3 px-4 xs:px-6 bg-blue-600 text-white rounded-lg shadow-lg text-fluid-base xs:text-fluid-lg font-semibold flex items-center justify-center gap-2 touch-manipulation"
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "#2563eb"
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10
                          }}
                        >
                          <span>View Project Showcase</span>
                          <m.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <FaChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                          </m.div>
                        </m.button>
                        {currentProjectData.sourceCode && (
                          <a
                            href={currentProjectData.sourceCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 xs:py-2.5 px-4 xs:px-6 bg-card border border-tertiary/25 text-secondary rounded-lg hover:bg-secondary/10 hover:border-secondary/40 transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 text-fluid-sm hover:scale-[1.02] transform"
                          >
                            <FaGithub className="w-4 h-4" />
                            <span>View on GitHub</span>
                          </a>
                        )}
                      </m.div>
                    </m.div>
                  </m.div>
                </m.div>
              )}
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
