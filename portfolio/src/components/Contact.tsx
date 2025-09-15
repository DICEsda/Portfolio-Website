import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [botField, setBotField] = useState('');
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

    // Honeypot: if filled, silently treat as success but do nothing
    if (botField.trim().length > 0) {
      setStatus('success');
      setStatusMessage('Message sent successfully!');
      form.current?.reset();
      return;
    }

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

  

  return (
  <section id="contact" ref={sectionRef} className="min-h-screen flex items-center justify-center py-0 scroll-snap-align-start">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 md:pl-20 lg:pl-24 max-w-2xl flex flex-col items-center transform -translate-y-10 md:-translate-y-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-center transition-all duration-700 text-light ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Get In Touch
        </h2>
        <div className="max-w-xl mx-auto w-full">
          <p className={`text-center mb-6 text-tertiary leading-relaxed transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            I'm currently looking for new opportunities. Whether you have a question
            or just want to say hello. I'll try my best to get back to you!
          </p>
          <div className={`bg-card p-6 rounded-lg shadow-lg transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              {/* Honeypot field (hidden from users) */}
              <div className="hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </div>
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
                  <div className="mt-3 text-green-500 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="animate-fade-in">Message sent successfully!</span>
                  </div>
                )}
                {status === 'error' && (
                  <p className="text-red-500 mt-2 text-xs">
                    {statusMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
          {/* Social links moved to Footer on this section for a unified experience */}
        </div>
      </div>
    </section>
  )
}

export default Contact 