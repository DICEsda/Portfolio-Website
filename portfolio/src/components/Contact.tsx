import { useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { usePageActive } from '../hooks/usePageActive';
// Dynamically import EmailJS when needed to keep it out of the initial bundle

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [botField, setBotField] = useState('');
  const isActive = usePageActive('contact');
  const [copied, setCopied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cascading motion variants for form contents
  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 }
  } as const;

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.sendForm('service_zcxdb79', 'template_f1ovonq', form.current, {
        publicKey: 'K-s_xFAcbcC3jPeW2',
      });
      setStatus('success');
      setStatusMessage('Message sent successfully!');
      form.current?.reset();
    } catch (error: any) {
      setStatus('error');
      setStatusMessage('Failed to send message. Please try again.');
      console.log('FAILED...', error?.text || error);
    }
  };

  

  return (
  <section id="contact" className="h-screen flex items-center justify-center py-0">
  <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl flex flex-col items-center">
        <m.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center text-light mt-2 sm:mt-3 md:mt-4 relative top-[7px]"
        >
          Get In Touch
        </m.h2>
        <div className="mx-auto w-full">
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
            className="text-center mb-6 text-tertiary leading-relaxed"
          >
            Open to opportunities and collaborations. Have a question or just want to say hi?
            I’ll get back to you as soon as I can.
          </m.p>
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="bg-card p-3 sm:p-4 md:p-5 rounded-lg shadow-lg"
            >
              <form ref={form} onSubmit={sendEmail} className="space-y-4 sm:space-y-5">
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
              <m.div variants={containerVariants} initial="hidden" animate={isActive ? 'show' : 'hidden'}>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <m.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-light mb-2 font-medium text-sm">
                    Name
                  </label>
                  <m.input
                    type="text"
                    id="name"
                    name="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-error"
                    className={`w-full px-3 py-2.5 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm ${errors.name ? 'border-red-500' : 'border-tertiary'}`}
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.35)', scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                    required
                  />
                  <AnimatePresence>{errors.name && (
                    <m.p id="name-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite"
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >{errors.name}</m.p>
                  )}</AnimatePresence>
                </m.div>
                <m.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-light mb-2 font-medium text-sm">
                    Email
                  </label>
                  <m.input
                    type="email"
                    id="email"
                    name="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="email-error"
                    className={`w-full px-3 py-2.5 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm ${errors.email ? 'border-red-500' : 'border-tertiary'}`}
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.35)', scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                    required
                  />
                  <AnimatePresence>{errors.email && (
                    <m.p id="email-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite"
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >{errors.email}</m.p>
                  )}</AnimatePresence>
                </m.div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <m.div variants={itemVariants}>
                  <label htmlFor="company" className="block text-light mb-2 font-medium text-sm">
                    Company (Optional)
                  </label>
                  <m.input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2.5 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.25)', scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                  />
                </m.div>
                <m.div variants={itemVariants}>
                  <label htmlFor="phone" className="block text-light mb-2 font-medium text-sm">
                    Phone Number (Optional)
                  </label>
                  <m.input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2.5 bg-primary/50 border border-tertiary rounded-lg focus:outline-none focus:border-secondary text-light transition-colors text-sm"
                    whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.25)', scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                  />
                </m.div>
              </div>
              <m.div variants={itemVariants}>
                <label htmlFor="message" className="block text-light mb-2 font-medium text-sm">
                  Message
                </label>
                <m.textarea
                  id="message"
                  name="message"
                  rows={3}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby="message-error"
                  className={`w-full px-3 py-2.5 bg-primary/50 border rounded-lg focus:outline-none focus:border-secondary text-light transition-colors resize-none text-sm ${errors.message ? 'border-red-500' : 'border-tertiary'}`}
                  whileFocus={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.35)', scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  required
                />
                <AnimatePresence>{errors.message && (
                  <m.p id="message-error" className="mt-1 text-xs text-red-500" role="alert" aria-live="polite"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >{errors.message}</m.p>
                )}</AnimatePresence>
              </m.div>
              <m.div variants={itemVariants} className="flex flex-col items-center">
                <m.button
                  type="submit"
                  className="inline-block bg-secondary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </m.button>
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
              </m.div>
                <m.div variants={itemVariants} className="pt-4 border-t border-tertiary/15">
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-light">Contact Details</h3>
                      <span className="text-secondary">•</span>
                      <span className="text-[11px] sm:text-xs text-gray-400/30 relative top-[1px] sm:top-[1px] md:top-0">click to copy!</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <m.div variants={itemVariants} className="flex items-center gap-2 bg-primary/40 rounded-md p-2.5 sm:p-3">
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
                          <m.span
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
                          </m.span>
                        )}
                      </AnimatePresence>
                    </m.div>
                    <m.div variants={itemVariants} className="flex items-center gap-2 bg-primary/40 rounded-md p-2.5 sm:p-3 justify-end">
                      <AnimatePresence>
                        {copied === 'email' && (
                          <m.span
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
                          </m.span>
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
                    </m.div>
                  </div>
                </m.div>
              </m.div>
              </form>
            </m.div>
          </div>
          {/* BottomPill handles credit/icons globally */}
        </div>
      </div>
    </section>
  )
}

export default Contact 