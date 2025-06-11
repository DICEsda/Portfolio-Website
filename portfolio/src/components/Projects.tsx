interface Project {
  title: string
  description: string
  technologies: string[]
  github: string
  live: string
  image: string
}

const Projects = () => {
  const projects: Project[] = [
    {
      title: "Project One",
      description: "A full-stack web application built with React and Node.js. Features include user authentication, real-time updates, and responsive design.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      github: "https://github.com/username/project-one",
      live: "https://project-one.com",
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Two",
      description: "An e-commerce platform with features like product search, cart management, and secure payment processing.",
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      github: "https://github.com/username/project-two",
      live: "https://project-two.com",
      image: "https://via.placeholder.com/600x400"
    },
    {
      title: "Project Three",
      description: "A task management application with drag-and-drop functionality, team collaboration, and progress tracking.",
      technologies: ["React", "Firebase", "Material-UI", "Redux"],
      github: "https://github.com/username/project-three",
      live: "https://project-three.com",
      image: "https://via.placeholder.com/600x400"
    }
  ]

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <h2 className="heading-primary text-3xl md:text-4xl mb-12">
          Featured Projects
        </h2>
        <div className="space-y-24">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <h3 className="text-2xl font-semibold text-light mb-4">
                  {project.title}
                </h3>
                <div className="bg-primary/50 p-6 rounded-lg mb-4">
                  <p className="text-tertiary">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light hover:text-secondary transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-light hover:text-secondary transition-colors"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
              <div className={`${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects 