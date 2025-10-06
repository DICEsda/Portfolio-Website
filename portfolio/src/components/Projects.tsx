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
  need?: string;
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
  tags?: string[];
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
  'Google API': <FaCloud className="text-current" />,
  'Google Home': <FaCloud className="text-current" />,
  'JWT': <FaCode className="text-current" />,
  'Framer Motion': <FaBolt className="text-current" />,
  'Recharts': <FaLayerGroup className="text-current" />,
  'React Native': <FaReact className="text-current" />,
  'Expo': <FaReact className="text-current" />,
  'JSON Server': <FaDatabase className="text-current" />,
  'Home Assistant': <FaCloud className="text-current" />,
  'YAML': <FaCode className="text-current" />,
  'IoT': <FaCloud className="text-current" />,
  'LangChain': <FaBolt className="text-current" />,
  'FastAPI': <FaBolt className="text-current" />,
  'Vector DB': <FaDatabase className="text-current" />,
  'Python': <FaCode className="text-current" />,
  'Home Assistant API': <FaCloud className="text-current" />,
  'Dashboard': <FaLayerGroup className="text-current" />
};

// Languages for special green styling
const languageSet = new Set<string>([
  'TypeScript', 'JavaScript', 'C#', 'C', 'C++', 'Java', 'Kotlin', 'Swift', 'Dart', 'Go', 'Rust', 'Python', 'PHP', 'YAML', 'SQL'
]);

// Fallback cover image: reuse hero image from src assets
const fallbackCover = new URL('../assets/hero-image.png', import.meta.url).href;
// Dual-Axis Solar project PDF
const dualAxisPdf = new URL('../../Project-Showcase/Dual-AxisSolarTrackingSystem/Semesterprojekt_3 endelig.pdf', import.meta.url).href;
// FinanceTracker report PDF
const financeTrackerPdf = new URL('../../Project-Showcase/FinanceTracker/Semesterprojekt.pdf', import.meta.url).href;

// Projects data hoisted to avoid recomputing
const projects: Project[] = [
    {
      title: "PersonalTracker: AI-Powered Life Analytics Platform",
      tagline: "Full-Stack Web Application | React + .NET Core + AI Integration",
      need: "I wanted a single place to track health, mood, and finances and turn it into simple insights that help daily decisions.",
      description: "A comprehensive personal analytics platform that transforms daily habits into actionable insights through AI-powered data analysis. Built as a sophisticated full-stack web application demonstrating expertise in modern software development practices, AI integration, and user experience design across fitness, mental health, finances, and personal reflection.",
      features: [
        "AI-powered insights engine with OpenAI GPT-3.5 Turbo",
        "Advanced authentication with Google OAuth 2.0 + JWT",
        "Real-time analytics dashboard with live calculations",
        "Financial widget with net worth calculation and breakdown",
        "Comprehensive data tracking (fitness, mood, finances, journal)",
        "Professional UI/UX with dark/light themes and smooth animations",
        "RESTful API with 25+ endpoints and Entity Framework",
        "Pattern recognition and predictive analytics"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", ".NET Core 9", "C#", "Entity Framework", "SQLite", "OpenAI API", "Google OAuth", "JWT", "Framer Motion", "Recharts"],
      coverImage: "",
      gallery: [],
      type: "AI-Powered Full-Stack Application",
      date: "2025",
      role: "Full Stack Developer + AI Integration Specialist",
  challenges: "Making the AI flows reliable with sensible fallbacks, modeling complex data across multiple types, and keeping the live financial calculations fast. I also couldn’t add my own card/account details due to GDPR rules, so that part is mocked. Overall, the goal was a smooth, consistent UX across web and mobile without overengineering.",
      projectNature: "Personal Project (Portfolio-Ready)",
      
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
        "Complete exam creation and management workflow",
        "Student registration and assignment to exams", 
        "Real-time exam timer with question randomization",
        "Grade recording and performance analytics",
        "Bilingual interface (Danish/English)",
        "Cross-platform mobile app with native performance",
        "REST API with JSON Server for data persistence",
        "Exam history and average grade calculations"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", ".NET MAUI", "C#", "Framer Motion", "JSON Server"],
      coverImage: "",
      gallery: [],
      type: "Academic Cross-Platform Application",
      date: "2025",
      role: "Frontend Developer",
      challenges: "Implementing real-time exam functionality with accurate timers, ensuring data consistency between web and mobile platforms, creating intuitive UX for exam administration, and maintaining performance during timed assessments with multiple concurrent users.",
      projectNature: "University Exam Project",
      
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
      title: "Home Assistant: AI Control + Automations & Scenes",
      tagline: "Natural‑language control + deterministic YAML routines",
      need: "Instead of managing dozens of point automations and YAML, I wanted to just say what I want and have the system translate intent into Home Assistant actions.",
      description: "Conversational control for Home Assistant powered by LangChain + OpenAI, executed via a secure FastAPI tool layer with confirmations and allow‑lists.",
      features: [
        "Natural‑language commands for lights, scenes, and routines",
        "Intent parsing + condition handling (entities, areas, times)",
        "Execution via Home Assistant REST/WebSocket API",
        "Safety rails: confirmations for risky actions, scoped tools",
        "Custom dashboard card/panel for voice + text prompts"
      ],
      technologies: [
        "LangChain",
        "OpenAI API",
        "Python",
        "FastAPI",
        "Home Assistant API",
        "Dashboard"
      ],
      coverImage: "",
      gallery: [],
      type: "IoT/Smart Home",
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/HomeAssistant-automations-main/AI%20integration",
      date: "2025",
      role: "Automation Engineer + AI Orchestration",
      challenges: "Grounding LLM responses to real devices/entities, handling ambiguity and multi‑step conditions, securing access, and ensuring graceful fallback to deterministic YAML when AI is unsure. AI assistant is being rolled out incrementally (ongoing).",
      projectNature: "Personal Project",
      sections: [
        {
          title: "AI Layer (grouped)",
          description: "• Orchestration (LangChain) — parse commands, extract entities/conditions, route tools.\n• LLM intent + confirmations (OpenAI).\n• Secure execution via FastAPI tool server with allow‑listed actions and user confirmations.\n• Error handling + safe fallbacks to deterministic flows.",
          technologies: ["LangChain", "OpenAI API", "FastAPI", "Python", "Home Assistant API"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/HomeAssistant-automations-main/AI%20integration"
        },
        {
          title: "Dashboard Integration",
          description: "Assist/Conversation card + custom panel for voice/text prompts with confirmations and results.",
          technologies: ["Home Assistant", "Dashboard"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/HomeAssistant-automations-main/AI%20integration"
        },
        {
          title: "Automations",
          description: "• Morning/Evening routines\n• HallwayMotionNight.yaml (night navigation)\n• AwayMode.yaml (energy + security)\n• PowerAlert.yaml (consumption thresholds)\n• SomeoneAtDoorAut.yaml (doorbell notifications)",
          technologies: ["Home Assistant", "YAML"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/HomeAssistant-automations-main"
        },
        {
          title: "Scenes",
          description: "• Good Morning / Goodnight\n• Movie / Relax\n• Energy Saver (Scenes‑EnergySaver.yaml)\n• Bedtime + Deep Sleep (Scenes‑Bedtime.yaml)",
          technologies: ["Home Assistant", "YAML", "WLED"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/HomeAssistant-automations-main"
        }
      ]
    },
    {
      title: "Portfolio Website",
      tagline: "A modern, responsive portfolio showcase",
  need: "I needed a place to present my projects and skills professionally and make it easy for recruiters to contact me.",
  description: "This portfolio showcases my work and front‑end craft: React + TypeScript, Tailwind, smooth section navigation, theme toggle, and performance-focused animations. The contact form uses EmailJS and the app is optimized with Vite and lazy chunks. It reflects my focus on UX, accessibility, and clean code.",
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
  liveDemo: "https://DICEsda.github.io/Portfolio-Website/",
  sourceCode: "https://github.com/DICEsda/Portfolio-Website",
  date: "Ongoing",
      role: "Frontend Developer",
  challenges: "Implementing smooth animations while maintaining performance, ensuring accessibility, and adapting layout across different resolutions (especially mobile)—still refining responsive behavior.",
      projectNature: "Personal Project",
      
    },
    {
      title: "IOT-TileNodeCoordinator",
      tagline: "Battery-powered smart tile lighting: ESP32-C3 nodes + ESP32-S3 coordinator (ESP-NOW + MQTT)",
      need: "Build a low-latency, presence-driven lighting system with battery nodes that still meets tight power and reliability budgets.",
  description: "Software-only system for many ESP32-C3 light nodes controlled by an ESP32-S3 coordinator. Nodes drive lights with PWM and sample temperature over SPI; the coordinator processes mmWave presence, decides lighting, and bridges telemetry/config over MQTT, with Google Home integration via Google APIs for smart home control. Secure push-button pairing with local approval, encrypted ESP-NOW with acks/retries, and OTA with rollback.",
      features: [
        "Presence-based lighting with ≤150 ms P95 end-to-end latency",
        "Push-button pairing with coordinator-side approval",
        "Encrypted ESP-NOW control with acks, retries, and TTL bridging",
  "MQTT (TLS) integration for telemetry, config, and calibration",
  "Google Home integration via Google APIs for smart home control",
        "Temperature derating and safety clamping on nodes",
        "Low-power nodes with scheduled RX windows and jittered telemetry",
        "Signed dual-slot OTA with rollback",
        "Persistent registry and mapping with NVS"
      ],
      technologies: [
        "C",
        "C++",
        "ESP32",
        "ESP-NOW",
  "MQTT",
  "TLS",
  "Google API",
  "Google Home",
        "PWM",
        "SPI",
        "OTA",
        "NVS",
        "PlatformIO",
        "FreeRTOS"
      ],
      coverImage: "",
      gallery: [],
      type: "IoT/Embedded System",
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/IOT-TileNodeCoordinator",
      date: "Ongoing (2025)",
      role: "Embedded/IoT Developer",
      challenges: "Meeting sub-150 ms latency while keeping nodes in low power, ensuring reliable delivery across clockless RX windows, securing pairing/keys, and making OTA robust with rollback.",
      projectNature: "Personal Project",
      sections: [
        {
          title: "Coordinator (ESP32-S3)",
          description: "Parses mmWave frames into presence events, runs decision logic to map zones to lights, serves as ESP-NOW server with ack/retry and TTL-based repeats to traverse node RX windows, bridges telemetry/config via MQTT over TLS, integrates with Google Home via Google APIs, and manages push-button pairing with local approval and persistent registry (NVS).",
          technologies: ["ESP32-S3", "ESP-NOW", "MQTT", "TLS", "Google API", "Google Home", "NVS", "FreeRTOS"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/IOT-TileNodeCoordinator/coordinator"
        },
        {
          title: "Node (ESP32-C3)",
          description: "Drives light via PWM with fades, reads temperature over SPI with alerts, uses ESP-NOW client with encrypted unicast + acks/retries, and implements low-power operation with scheduled RX windows. Includes OTA client with dual-slot update and rollback.",
          technologies: ["ESP32-C3", "PWM", "SPI", "ESP-NOW", "Light Sleep", "OTA"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/IOT-TileNodeCoordinator/node"
        },
        {
          title: "Shared Library",
          description: "Common message schemas and utilities including ESP-NOW message types, config manager, and serialization helpers shared by coordinator and nodes.",
          technologies: ["C++", "Shared Lib"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/IOT-TileNodeCoordinator/shared"
        },
        {
          title: "Docs & Contracts",
          description: "Product Requirement Document (v0.3) and MQTT API covering topics/payloads, pairing sequence, presence processing, and thermal management diagrams.",
          technologies: ["Docs", "MQTT", "Protocols"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/IOT-TileNodeCoordinator/docs"
        }
      ]
    },
    {
      title: "FinanceTracker — Cross‑Platform Personal Finance Suite",
      tagline: "React web + .NET MAUI mobile + .NET API with CI and docs",
      description: "A full personal finance management platform delivered across web and mobile with a typed frontend, native MAUI app, and a documented .NET API. Focused on clean architecture, testing, and developer experience.",
      features: [
        "Authentication and role‑based access",
        "Budgets, categories, transactions, and paychecks",
        "Analytics dashboards and insights",
        "Native mobile app with localization",
        "Documented API (Swagger) and Docker support",
        "Unit tests and CI workflow"
      ],
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        ".NET MAUI",
        "C#",
        ".NET",
        "Swagger",
        "Docker",
        "Vitest"
      ],
      coverImage: fallbackCover,
      gallery: [financeTrackerPdf],
      type: "Cross‑Platform App + Web",
      date: "2025",
      role: "Full Stack Developer",
      challenges: "Coordinating a shared domain across API, web, and MAUI clients; keeping data models consistent; and maintaining DX with tests, CI, and clear API documentation.",
      projectNature: "University Project",
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/FinanceTracker",
      sections: [
        {
          title: "Web App (React + TypeScript)",
          description: "Typed React application with Tailwind, Vite, ESLint, and Vitest test setup. Provides dashboards, category/budget views, and clean UI patterns.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Vitest"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/FinanceTracker/FinanceTrackerWebApp"
        },
        {
          title: "Backend (.NET API)",
          description: ".NET API with controllers for accounts, jobs, paychecks, supplements, and workshifts; Swagger docs; Dockerfiles and CI workflow.",
          technologies: [".NET", "C#", "Swagger", "Docker"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/FinanceTracker/FinanceTrackerBackend"
        },
        {
          title: "Mobile App (.NET MAUI)",
          description: "Cross‑platform MAUI app with XAML views, localization support, and API integration for on‑the‑go finance tracking.",
          technologies: [".NET MAUI", "C#"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/FinanceTracker/FinanceTrackerMaui/FinanceTrackerAPP"
        }
      ]
    },
    {
      title: "Dual‑Axis Solar Tracking System",
      tagline: "Embedded control system for optimal solar alignment",
      description: "A university project implementing a dual‑axis tracking mechanism that keeps a solar panel aligned with the sun using light sensors and a feedback control loop. The system increases energy capture through continuous azimuth and elevation adjustment.",
      features: [
        "Dual‑axis mechanical design (azimuth + elevation)",
        "LDR sensor array for sun position detection",
        "Closed‑loop control with tunable gains",
        "Power output monitoring and logging",
        "Calibration and safety limits for motors",
        "Comprehensive report and measurements"
      ],
      technologies: [
        "C",
        "C++",
        "IoT",
        "Sensors",
        "PWM",
        "Motor Control"
      ],
      coverImage: fallbackCover,
      gallery: [dualAxisPdf],
      type: "Embedded/Mechatronics",
      date: "2024/2025",
      role: "Embedded Systems Engineer",
      challenges: "Tuning the control loop for stable tracking in variable light, minimizing oscillations in partial shade, and ensuring mechanical precision without overshoot.",
      projectNature: "University Project",
      sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Dual-AxisSolarTrackingSystem",
      sections: [
        {
          title: "ESP32 & Peripherals",
          description: "ESP32 reads a quad LDR array and HTU21D temperature/humidity sensor, serves a local dashboard via AsyncWebServer, renders to TFT (TFT_eSPI), and publishes tracking direction over UART1 (GPIO 26/27) to the Raspberry Pi.",
          technologies: ["ESP32", "ADC", "HTU21D", "AsyncWebServer", "TFT_eSPI", "UART"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Dual-AxisSolarTrackingSystem/Esp32"
        },
        {
          title: "Raspberry Pi & Servo/Stepper",
          description: "Raspberry Pi runs a custom platform GPIO driver exposing /dev/plat_drv* nodes for a servo and stepper. A userspace controller reads the ESP32 UART feed and commands the servo angle and stepper steps accordingly.",
          technologies: ["Raspberry Pi", "Linux Kernel", "GPIO", "PWM", "Stepper", "Servo"],
          sourceCode: "https://github.com/DICEsda/Portfolio-Website/tree/main/portfolio/Project-Showcase/Dual-AxisSolarTrackingSystem/Linux"
        }
      ]
    }
  ].sort((a, b) => {
    const featured = "FinanceTracker — Cross‑Platform Personal Finance Suite";
    if (a.title === featured) return -1;
    if (b.title === featured) return 1;
    // Push Portfolio Website below featured items
    if (a.title === "Portfolio Website") return 1;
    if (b.title === "Portfolio Website") return -1;
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
  
  // Derive a simple Personal/School tag from the project nature
  const getTagForNature = (nature: string) => {
    const n = (nature || '').toLowerCase();
    const isSchool = n.includes('university') || n.includes('exam') || n.includes('school') || n.includes('academic');
    return isSchool
      ? { label: 'School', className: 'ml-2 inline-flex items-center text-[0.7rem] xs:text-xs px-2 py-0.5 rounded-full border text-secondary bg-secondary/10 border-secondary/20 align-middle' }
      : { label: 'Personal', className: 'ml-2 inline-flex items-center text-[0.7rem] xs:text-xs px-2 py-0.5 rounded-full border text-emerald-600 bg-emerald-500/10 border-emerald-500/20 align-middle' };
  };
  const projectTag = getTagForNature(currentProjectData.projectNature);

  return (
    <>
      <section 
        ref={sectionRef} 
        className="h-screen flex items-center justify-center overflow-x-hidden pt-16"
  >
  <div className="container mx-auto px-2 xs:px-3 sm:px-4 max-w-7xl">
    <div className="transform origin-top scale-[1.05]">
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
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110 p-2"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextProject}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-tertiary hover:text-secondary transition-all duration-300 hover:scale-110 p-2"
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
                      <span className={projectTag.className}>{projectTag.label}</span>
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
                          className="flex-[1] py-2 xs:py-2.5 px-4 xs:px-6 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg font-medium flex items-center justify-center gap-2 text-[0.9rem] hover:scale-[1.01]"
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
