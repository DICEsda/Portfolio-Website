const About = () => {
  const skills = [
    'JavaScript (ES6+)',
    'TypeScript',
    'React',
    'Node.js',
    'Tailwind CSS',
    'Git',
    'Next.js',
    'Python',
  ]

  return (
    <section id="about" className="h-full flex items-center justify-center py-20">
      <div className="container-custom">
        <h2 className="heading-primary text-3xl ml-2 md:text-4xl mb-8">
          About Me
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-tertiary mb-4 ml-2">
              Hello! I'm a passionate software developer with a strong foundation in web development.
              My journey in tech began with a curiosity about how things work on the internet,
              which led me to dive deep into programming and software development.
            </p>
            <p className="text-tertiary mb-4 ml-2">
              I enjoy creating software that solves real-world problems and provides
              exceptional user experiences. My approach combines technical expertise
              with creative problem-solving to deliver efficient and scalable solutions.
            </p>
            <p className="text-tertiary ml-2 mb-6">
              When I'm not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing my knowledge through
              technical writing and mentoring.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Skills & Technologies</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center space-x-2 text-tertiary"
                >
                  <span className="text-secondary">▹</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 