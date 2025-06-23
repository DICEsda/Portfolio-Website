import heroImage from '../assets/hero-image.png';

const Hero = () => {
  return (
    <section id="home" className="h-full flex items-center justify-center py-20">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <p className="text-secondary dark:text-dark-secondary mb-4">Hi, my name is</p>
            <h1 className="heading-primary text-5xl md:text-7xl md:animate-none mb-3 text-light dark:text-dark-light">
              Jahye Ali.
            </h1>
            <h2 className="heading-primary text-4xl md:text-6xl text-tertiary dark:text-dark-tertiary">
              I build things, and create solutions!
            </h2>
            <p className="text-tertiary dark:text-dark-tertiary text-lg md:text-xl mt-6 max-w-2xl">
              I'm a software developer specializing in building exceptional digital experiences.
              Currently, I'm focused on building accessible, human-centered products.
            </p>
            <div className="mt-8">
              <a
                href="#projects"
                className="inline-block border-2 border-secondary dark:border-dark-secondary text-secondary dark:text-dark-secondary px-8 py-3 rounded hover:bg-secondary/10 dark:hover:bg-dark-secondary/10 transition-colors"
              >
                View My Work
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src={heroImage} 
              alt="Hero" 
              className="w-full max-w-sm rounded-lg shadow-2xl animate-fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero