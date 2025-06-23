import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '-50px 0px -50px 0px', // Add some margin for better trigger timing
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setStatus('sending');
    setStatusMessage('Sending...');

    emailjs
      .sendForm('service_zcxdb79', 'template_f1ovonq', form.current, {
        publicKey: 'K-s_xFAcbcC3jPeW2',
      })
      .then(
        () => {
          setStatus('success');
          setStatusMessage('Message sent successfully!');
          form.current?.reset();
        },
        (error) => {
          setStatus('error');
          setStatusMessage('Failed to send message. Please try again.');
          console.log('FAILED...', error.text);
        },
      );
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/DicesDa',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/Yahya-ali-72267916b/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=100077495904298',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.0745 4.3888 23.093 10.125 23.9545V15.468H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6578 4.6875C15.9703 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.3397 7.875 13.875 8.80125 13.875 9.75V12H17.2031L16.6711 15.468H13.875V23.9545C19.6112 23.093 24 18.0745 24 12C24 5.37258 18.6274 0 12 0Z" />
        </svg>
      ),
    }
  ]

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-center transition-all duration-700 text-light ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Get In Touch
        </h2>
        <div className="max-w-xl mx-auto">
          <p className={`text-center mb-6 text-tertiary leading-relaxed transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            I'm currently looking for new opportunities. Whether you have a question
            or just want to say hello. I'll try my best to get back to you!
          </p>
          <div className={`bg-card p-6 rounded-lg shadow-lg transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`transition-all duration-700 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="name" className="block text-light mb-1 font-medium text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                    required
                  />
                </div>
                <div className={`transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="email" className="block text-light mb-1 font-medium text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`transition-all duration-700 delay-600 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="company" className="block text-light mb-1 font-medium text-sm">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                  />
                </div>
                <div className={`transition-all duration-700 delay-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="phone" className="block text-light mb-1 font-medium text-sm">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                  />
                </div>
              </div>
              <div className={`transition-all duration-700 delay-800 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <label htmlFor="message" className="block text-light mb-1 font-medium text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors resize-none text-sm"
                  required
                ></textarea>
              </div>
              <div className={`flex flex-col items-center transition-all duration-700 delay-900 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <button
                  type="submit"
                  className="inline-block bg-transparent border-2 border-secondary text-secondary px-6 py-2 rounded-lg hover:bg-secondary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && (
                  <p className="text-green-500 mt-2 text-xs">
                    Message sent successfully!
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-500 mt-2 text-xs">
                    {statusMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
          <div className={`mt-8 flex justify-center space-x-6 transition-all duration-700 delay-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {socialLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary hover:text-secondary transition-colors p-2 hover:scale-110"
                aria-label={link.name}
                style={{ transitionDelay: `${1100 + index * 100}ms` }}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact 