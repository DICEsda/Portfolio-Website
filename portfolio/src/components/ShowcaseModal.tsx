import { m, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";

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

interface ShowcaseModalProps {
  project: Project;
  onClose: () => void;
}

export default function ShowcaseModal({ project, onClose }: ShowcaseModalProps) {
  const { theme } = useTheme();

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Lock background scroll
    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    const prevOverscroll = html.style.getPropertyValue('overscroll-behavior');
    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    html.style.setProperty('overscroll-behavior', 'contain');

    // Disable fullPage.js scrolling if available
    const fp: any = (window as any).fullpage_api;
    try {
      fp?.setAllowScrolling?.(false);
      fp?.setKeyboardScrolling?.(false);
    } catch {}

    return () => {
      // Restore scroll settings
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
      if (prevOverscroll) {
        html.style.setProperty('overscroll-behavior', prevOverscroll);
      } else {
        html.style.removeProperty('overscroll-behavior');
      }
      try {
        fp?.setAllowScrolling?.(true);
        fp?.setKeyboardScrolling?.(true);
      } catch {}
    };
  }, []);

  const modal = (
    <AnimatePresence mode="wait">
      <m.div
        key="modal"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur p-4 pt-20 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
  onWheelCapture={(e) => e.stopPropagation()}
  onTouchMoveCapture={(e) => e.stopPropagation()}
  >
        <div className="flex max-w-[90vw] h-[85vh] items-start relative">
          {/* Close button - positioned within the modal container */}
          <button
            className="absolute -top-2 -right-2 z-50 w-10 h-10 flex items-center justify-center text-white hover:text-secondary transition-colors duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Info Card spans full width */}
          <m.div
            className={`${theme === 'dark' ? 'bg-card text-light' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl w-[90vw] max-w-[1100px] p-8 relative overflow-y-auto h-full ${theme === 'dark' ? 'border border-tertiary/20' : 'border border-gray-200'} scrollbar-nice`}
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <m.h2
              className={`text-3xl font-heading font-bold mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {project.title}
            </m.h2>
            <p className="text-secondary mb-4">{project.tagline}</p>
            <p className={`mb-6 ${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.description}</p>
            
            <div className="space-y-6">
              {project.sections && project.sections.length > 0 && (
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Project Sections</h3>
                  <div className="space-y-3">
                    {project.sections.map((sec, i) => (
                      <div key={i} className={`rounded-lg p-3 ${theme === 'dark' ? 'border border-tertiary/20 bg-primary/50' : 'border border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>{sec.title}</h4>
                          {sec.sourceCode && (
                            <a href={sec.sourceCode} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm hover:underline">Source</a>
                          )}
                        </div>
                        {sec.description && (
                          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{sec.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {sec.technologies.map((t, ti) => (
                            <span key={ti} className={`px-2 py-0.5 rounded-full text-xs ${theme === 'dark' ? 'bg-secondary/20 text-secondary' : 'bg-blue-50 text-blue-600'}`}>{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Key Features</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {project.features.map((f, i) => (
                    <li key={i} className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-secondary/20 text-secondary' : 'bg-blue-50 text-blue-600'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Project Type</h3>
                  <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.type}</p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Date Completed</h3>
                  <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.date}</p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Role</h3>
                  <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.role}</p>
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Project Nature</h3>
                  <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.projectNature}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition"
                  >
                    Live Demo
                  </a>
                )}
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg transition ${theme === 'dark' ? 'border border-tertiary/30 text-tertiary hover:bg-tertiary/10' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Source Code
                  </a>
                )}
              </div>

              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Challenges</h3>
                <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.challenges}</p>
              </div>

              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-primary/80 text-tertiary' : 'bg-gray-50 text-gray-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </m.div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modal, document.body);
  }
  return modal;
}
