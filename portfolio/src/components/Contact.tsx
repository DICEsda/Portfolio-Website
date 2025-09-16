import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [botField, setBotField] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Simple inline validation
    const data = new FormData(form.current);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Please enter your name.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email.';
    if (!message) newErrors.message = 'Please write a short message.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus('error');
      setStatusMessage('Please fix the errors and try again.');
      return;
    }

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
  <section id="contact" ref={sectionRef} className="h-screen flex items-center justify-center py-0 scroll-snap-align-start">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl flex flex-col items-center">
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-center transition-all duration-700 text-light ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Get In Touch
        </h2>
        <div className="mx-auto w-full">
          <p className={`text-center mb-6 text-tertiary leading-relaxed transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            I'm currently looking for new opportunities. Whether you have a question
            or just want to say hello. I'll try my best to get back to you!
          </p>
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <div className={`bg-card p-3 sm:p-4 md:p-5 rounded-lg shadow-lg transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <form ref={form} onSubmit={sendEmail} className="space-y-3 sm:space-y-4">
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
              <div className="grid md:grid-cols-2 gap-2 sm:gap-3">
                <div className={`transition-all duration-700 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="name" className="block text-light mb-1 font-medium text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-error"
                    className={`w-full px-3 py-2 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm ${errors.name ? 'border-red-500' : 'border-tertiary'}`}
                    required
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite">{errors.name}</p>
                  )}
                </div>
                <div className={`transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <label htmlFor="email" className="block text-light mb-1 font-medium text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="email-error"
                    className={`w-full px-3 py-2 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm ${errors.email ? 'border-red-500' : 'border-tertiary'}`}
                    required
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 sm:gap-3">
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
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby="message-error"
                  className={`w-full px-3 py-2 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors resize-none text-sm ${errors.message ? 'border-red-500' : 'border-tertiary'}`}
                  required
                ></textarea>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite">{errors.message}</p>
                )}
              </div>
              <div className={`flex flex-col items-center transition-all duration-700 delay-900 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <button
                  type="submit"
                  className="inline-block bg-secondary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
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
                <div className="pt-3 border-t border-tertiary/15">
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-light">Contact Details</h3>
                      <span className="text-secondary">•</span>
                      <span className="text-[11px] sm:text-xs text-gray-400/30 relative top-[1px] sm:top-[1px] md:top-0">click to copy!</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 bg-primary/40 rounded-md p-2 sm:p-2.5">
                      <svg className="w-4.5 h-4.5 text-secondary shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C10.07 22 2 13.93 2 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z" />
                      </svg>
                      <button
                        type="button"
                        onClick={async (e) => { e.preventDefault(); await navigator.clipboard.writeText('+4552560027'); setCopied('phone'); setTimeout(()=>setCopied(null), 1200); }}
                        onKeyDown={async (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); await navigator.clipboard.writeText('+4552560027'); setCopied('phone'); setTimeout(()=>setCopied(null), 1200); } }}
                        className="text-left bg-transparent p-0 m-0 hover:text-secondary cursor-pointer whitespace-nowrap"
                        aria-label="Copy phone number"
                      >
                        +45 52560027
                      </button>
                      <AnimatePresence>
                        {copied === 'phone' && (
                          <motion.span
                            key="copied-phone"
                            initial={{ opacity: 0, x: 8, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 8, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="ml-2 inline-flex items-center gap-1 text-[11px] text-secondary font-semibold bg-secondary/10 rounded-full px-2 py-0.5"
                            role="status"
                            aria-live="polite"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/40 rounded-md p-2 sm:p-2.5 justify-end">
                      <AnimatePresence>
                        {copied === 'email' && (
                          <motion.span
                            key="copied-email"
                            initial={{ opacity: 0, x: -8, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold bg-secondary/10 rounded-full px-2 py-0.5"
                            role="status"
                            aria-live="polite"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <button
                        type="button"
                        onClick={async (e) => { e.preventDefault(); await navigator.clipboard.writeText('Yahya24680@gmail.com'); setCopied('email'); setTimeout(()=>setCopied(null), 1200); }}
                        onKeyDown={async (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); await navigator.clipboard.writeText('Yahya24680@gmail.com'); setCopied('email'); setTimeout(()=>setCopied(null), 1200); } }}
                        className="text-right bg-transparent p-0 m-0 hover:text-secondary cursor-pointer whitespace-nowrap"
                        aria-label="Copy email address"
                      >
                        Yahya24680@gmail.com
                      </button>
                      <svg className="w-4.5 h-4.5 text-secondary shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75zm2.28-.75L12 11.127 19.47 6h-14.94z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Social links moved to Footer on this section for a unified experience */}
        </div>
      </div>
    </section>
  )
}

export default Contact 