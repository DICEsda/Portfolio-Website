import { m, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

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
      >
        {/* Centered Content Card */}
        <m.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] sm:max-h-[85vh] p-4 sm:p-6 lg:p-8 relative overflow-y-auto border border-gray-200 scrollbar-nice mx-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
            <m.button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition"
              whileHover={{ scale: 1.2, rotate: 90 }}
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </m.button>

            <m.h2
              className="text-3xl font-heading font-bold mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {project.title}
            </m.h2>
            <p className="text-blue-600 mb-4">{project.tagline}</p>
            <p className="text-gray-700 mb-6">{project.description}</p>
            
            <div className="space-y-6">
              {project.sections && project.sections.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Project Sections</h3>
                  <div className="space-y-3">
                    {project.sections.map((sec, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{sec.title}</h4>
                          {sec.sourceCode && (
                            <a href={sec.sourceCode} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Source</a>
                          )}
                        </div>
                        {sec.description && (
                          <p className="text-gray-700 text-sm mb-2">{sec.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {sec.technologies.map((t, ti) => (
                            <span key={ti} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {project.features.map((f, i) => (
                    <li key={i} className="text-gray-700">{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Project Type</h3>
                  <p className="text-gray-700">{project.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date Completed</h3>
                  <p className="text-gray-700">{project.date}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Role</h3>
                  <p className="text-gray-700">{project.role}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Project Nature</h3>
                  <p className="text-gray-700">{project.projectNature}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Live Demo
                  </a>
                )}
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Source Code
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Challenges</h3>
                <p className="text-gray-700">{project.challenges}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </m.div>
      </AnimatePresence>
    );

    if (typeof document !== 'undefined' && document.body) {
      return createPortal(modal, document.body);
    }
    return modal;
  }
