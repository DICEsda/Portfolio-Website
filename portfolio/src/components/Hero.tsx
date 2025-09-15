import heroImage from '../assets/hero-image.png';

const Hero = () => {
  return (
  <section id="home" className="min-h-screen flex items-center justify-center pt-24 md:pt-28 pb-20 scroll-snap-align-start">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 md:pl-20 lg:pl-24 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <p className="text-secondary mb-4 scroll-animate">Hello! I'm</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-3 text-light leading-tight scroll-animate">
              Yahya Ali
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-tertiary mb-6 leading-tight scroll-animate">
              An Aspiring Software Developer
            </h2>
            <p className="text-tertiary text-lg md:text-xl mb-8 max-w-2xl leading-relaxed scroll-animate">
              I'm a passionate Computer Science student seeking internship opportunities in software development.
              With a strong foundation in modern technologies and a drive for learning, I'm eager to contribute to innovative projects
              and gain real-world experience.
            </p>
            <div className="flex gap-4">
              <a
                href="#projects"
                className="inline-block border-2 border-secondary text-secondary px-8 py-3 rounded-lg hover:bg-secondary/10 transition-all duration-300 font-medium"
              >
                View Projects
              </a>
              <a
                href={`${import.meta.env.BASE_URL}CV - Yahya Ali.pdf`}
                download="CV - Yahya Ali.pdf"
                className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src={heroImage} 
              alt="Yahya Ali" 
              className="w-full max-w-sm rounded-lg shadow-2xl animate-fade-in will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero