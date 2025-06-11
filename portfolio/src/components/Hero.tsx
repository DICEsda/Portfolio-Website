const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center section-padding">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <p className="text-secondary mb-4">Hi, my name is</p>
          <h1 className="heading-primary text-5xl md:text-7xl">
            John Doe.
          </h1>
          <h2 className="heading-primary text-4xl md:text-6xl text-tertiary">
            I build things for the web.
          </h2>
          <p className="text-tertiary text-lg md:text-xl mt-6 max-w-2xl">
            I'm a software developer specializing in building exceptional digital experiences.
            Currently, I'm focused on building accessible, human-centered products.
          </p>
          <div className="mt-8">
            <a
              href="#projects"
              className="inline-block border-2 border-secondary text-secondary px-8 py-3 rounded hover:bg-secondary/10 transition-colors"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 