import heroImage from '../assets/hero-image.png';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <p className="text-secondary mb-4">Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-3 text-light leading-tight">
              Jahye Ali.
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-tertiary mb-6 leading-tight">
              I build things, and create solutions!
            </h2>
            <p className="text-tertiary text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              I'm a software developer specializing in building exceptional digital experiences.
              Currently, I'm focused on building accessible, human-centered products.
            </p>
            <div>
              <a
                href="#projects"
                className="inline-block border-2 border-secondary text-secondary px-8 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-300 font-medium"
              >
                View My Work
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src={heroImage} 
              alt="Jahye Ali" 
              className="w-full max-w-sm rounded-lg shadow-2xl animate-fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero