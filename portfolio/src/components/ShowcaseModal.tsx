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
  tags?: string[];
  need?: string;
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
            className={`absolute top-3 right-3 z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${theme === 'dark' ? 'text-light hover:text-secondary' : 'text-gray-500 hover:text-secondary'}`}
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
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <p className="text-secondary">{project.tagline}</p>
              <span className={`${theme === 'dark' ? 'bg-secondary/15 text-secondary border-secondary/25' : 'bg-blue-50 text-blue-700 border-blue-200'} text-xs px-2.5 py-1 rounded-full border font-semibold`}
                title="Project nature">
                {project.projectNature}
              </span>
            </div>

            {project.need && (
              <div className={`${theme === 'dark' ? 'bg-primary/60 border-tertiary/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 mb-4`}>
                <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Project need</h3>
                <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.need}</p>
              </div>
            )}
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
                          <p className={`text-sm mb-2 whitespace-pre-line ${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{sec.description}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Key Features</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {project.features.map((f, i) => (
                      <li key={i} className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:flex md:items-center">
                  <div className={`rounded-lg p-4 max-w-md w-full mx-auto ${theme === 'dark' ? 'border border-tertiary/20 bg-primary/50' : 'border border-gray-200 bg-gray-50'}`}>
                    <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Project Details</h3>
                    <ul className="list-disc ml-6 space-y-1">
                      <li className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>
                        <span className={`${theme === 'dark' ? 'text-light' : 'text-gray-900'} font-medium`}>Project Type:</span> {project.type}
                      </li>
                      <li className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>
                        <span className={`${theme === 'dark' ? 'text-light' : 'text-gray-900'} font-medium`}>Date:</span> {project.date}
                      </li>
                      <li className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>
                        <span className={`${theme === 'dark' ? 'text-light' : 'text-gray-900'} font-medium`}>Role:</span> {project.role}
                      </li>
                      <li className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>
                        <span className={`${theme === 'dark' ? 'text-light' : 'text-gray-900'} font-medium`}>Project Nature:</span> {project.projectNature}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-light' : 'text-gray-900'}`}>Challenges</h3>
                <p className={`${theme === 'dark' ? 'text-tertiary' : 'text-gray-700'}`}>{project.challenges}</p>
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

              <div className="flex gap-4">
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition"
                  >
                    Source Code
                  </a>
                )}
              </div>

              {/* Tags removed by request */}
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
