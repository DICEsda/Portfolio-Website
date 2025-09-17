import { m, AnimatePresence } from "framer-motion";

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

interface ShowcaseModalProps {
  project: Project;
  onClose: () => void;
}

export default function ShowcaseModal({ project, onClose }: ShowcaseModalProps) {
  return (
    <AnimatePresence mode="wait">
      <m.div
        key="modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="flex gap-6 max-w-[90vw] h-[85vh] items-start">
          {/* Left side: Info Card */}
          <m.div
            className="bg-white rounded-2xl shadow-2xl w-[600px] p-8 relative overflow-y-auto h-full border border-gray-200 scrollbar-nice"
            initial={{ scale: 0.95, x: -40, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0.95, x: -40, opacity: 0 }}
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

          {/* Right side: Floating Images */}
          <m.div
            className="w-[500px] space-y-4 h-full overflow-y-auto scrollbar-nice"
            initial={{ scale: 0.95, x: 40, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0.95, x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <m.div
              className="relative rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </m.div>
            
            {project.gallery && project.gallery.length > 0 && (
              <m.div 
                className="grid grid-cols-2 gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.gallery.map((item, i) => {
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(item);
                  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(item);
                  const fileName = item.split("/").pop() || `asset-${i + 1}`;

                  return (
                    <m.div
                      key={i}
                      className="relative rounded-lg overflow-hidden shadow-md group"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isImage ? (
                        <img
                          src={item}
                          alt={`${project.title} asset ${i + 1}`}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                      ) : isVideo ? (
                        <video
                          controls
                          preload="metadata"
                          src={item}
                          className="w-full h-32 object-cover bg-black"
                        />
                      ) : (
                        <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full h-32 bg-gray-100 text-gray-700 text-center px-3"
                          title={fileName}
                        >
                          <span className="text-sm truncate">{fileName}</span>
                        </a>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">
                          {isVideo ? "Click to play" : isImage ? "Click to enlarge" : "Open file"}
                        </span>
                      </div>
                    </m.div>
                  );
                })}
              </m.div>
            )}
          </m.div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
