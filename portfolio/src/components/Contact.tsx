import { useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { usePageActive } from '../hooks/usePageActive';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [botField, setBotField] = useState('');
  const isActive = usePageActive('contact');
  const [copied, setCopied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    // Form validation
    const data = new FormData(form.current);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Please enter your name.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!message) newErrors.message = 'Please write a message.';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus('error');
      setStatusMessage('Please fix the errors and try again.');
      return;
    }

    // Honeypot check
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
      await emailjs.sendForm('service_yxsbzwr', 'template_f1ovonq', form.current, {
        publicKey: 'K-s_xFAcbcC3jPeW2',
      });
      setStatus('success');
      setStatusMessage('Message sent successfully!');
      form.current?.reset();
      setErrors({});
    } catch (error: any) {
      setStatus('error');
      setStatusMessage('Failed to send message. Please try again.');
      console.log('FAILED...', error?.text || error);
    }
  };

  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // We no longer need to track isExtraWide since we've redesigned the layout
  // useEffect for other potential side effects can be added here if needed
  
  return (
    <section id="contact" className="h-screen flex items-center justify-center py-0">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 max-w-6xl h-full flex items-center justify-center">
        <m.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate={isActive ? 'show' : 'hidden'}
        >
          <div className="transform origin-top scale-[1.05]">
          {/* Header */}
          <m.div variants={itemVariants} className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-light mb-1.5">
              Get In Touch
            </h2>
            <p className="text-tertiary leading-relaxed text-sm">
              Open to opportunities and collaborations. Have a question or just want to say hi?
              I'll get back to you as soon as I can.
            </p>
          </m.div>
          
          {/* Layout: form centered horizontally; contact card floats to the right on large screens */}
          <div className="relative w-full">
            {/* Primary Card: Contact Form (centered horizontally) */}
            <m.div variants={itemVariants} className="mx-auto w-full max-w-[560px]">
              <div className="bg-card p-4 md:p-6 rounded-2xl shadow-lg">
                <h3 className="text-base lg:text-lg font-semibold text-light mb-4 hidden md:block">Message Form</h3>
              <form ref={form} onSubmit={sendEmail} className="space-y-3 md:space-y-4">
                {/* Honeypot field */}
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

                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-light text-xs font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`w-full px-3 py-2 bg-primary/50 border rounded-lg text-light placeholder:text-tertiary/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/40 transition-all duration-150 ${
                        errors.name ? 'border-red-500 focus:ring-red-400/30' : 'border-tertiary/30'
                      }`}
                      required
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <m.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          id="name-error"
                          role="alert"
                          className="mt-1 text-xs text-red-500"
                        >
                          {errors.name}
                        </m.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-light text-xs font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-primary/50 border rounded-lg text-light placeholder:text-tertiary/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/40 transition-all duration-150 ${
                        errors.email ? 'border-red-500 focus:ring-red-400/30' : 'border-tertiary/30'
                      }`}
                      required
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <m.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          id="email-error"
                          role="alert"
                          className="mt-1 text-xs text-red-500"
                        >
                          {errors.email}
                        </m.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Company and Phone Row */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="company" className="block text-light text-xs font-medium mb-1">
                      Company <span className="text-tertiary">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      autoComplete="organization"
                      className="w-full px-3 py-2 bg-primary/50 border border-tertiary/30 rounded-lg text-light placeholder:text-tertiary/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/40 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-light text-xs font-medium mb-1">
                      Phone <span className="text-tertiary">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      className="w-full px-3 py-2 bg-primary/50 border border-tertiary/30 rounded-lg text-light placeholder:text-tertiary/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/40 transition-all duration-150"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-light text-xs font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-3 py-2.5 bg-primary/50 border rounded-lg text-light placeholder:text-tertiary/60 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/40 transition-all duration-150 resize-none ${
                      errors.message ? 'border-red-500 focus:ring-red-400/30' : 'border-tertiary/30'
                    }`}
                    required
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <m.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        id="message-error"
                        role="alert"
                        className="mt-1 text-xs text-red-500"
                      >
                        {errors.message}
                      </m.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button and Status */}
                <div className="flex flex-col items-center space-y-2 pt-0.5">
                  <m.button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto bg-secondary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
                    whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </m.button>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {status === 'success' && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="status"
                        aria-live="polite"
                        className="flex items-center space-x-2 text-green-500"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Message sent successfully!</span>
                      </m.div>
                    )}
                    {status === 'error' && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="status"
                        aria-live="assertive"
                        className="flex items-center space-x-2 text-red-500"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{statusMessage}</span>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </m.div>

            {/* Secondary Card: Contact Information (pill style) */}
            <m.div variants={itemVariants} className="mt-6 w-full max-w-sm mx-auto lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-right-8 xl:-right-16 lg:w-72">
              <div className="relative overflow-hidden rounded-2xl px-5 py-5 md:px-6 md:py-6 bg-primary/50 backdrop-blur-xl backdrop-saturate-150 flex flex-col gap-4 shadow-xl">
                <h3 className="text-sm tracking-wide font-semibold text-tertiary/70 uppercase text-center">Contact</h3>
                <ul className="space-y-2.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+4552560027', 'phone')}
                      onKeyDown={(e) => e.key === 'Enter' && copyToClipboard('+4552560027', 'phone')}
                      className="group w-full flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-tertiary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 transition-colors"
                      aria-label="Copy phone number"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary/15 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-tertiary/60 leading-none mb-1">Phone</span>
                        <span className="font-medium text-light leading-tight">+45 52560027</span>
                      </div>
                      <AnimatePresence>
                        {copied === 'phone' && (
                          <m.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="ml-auto text-[10px] font-semibold tracking-wide text-secondary"
                          >
                            Copied
                          </m.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('Yahya24680@gmail.com', 'email')}
                      onKeyDown={(e) => e.key === 'Enter' && copyToClipboard('Yahya24680@gmail.com', 'email')}
                      className="group w-full flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-tertiary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 transition-colors"
                      aria-label="Copy email address"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary/15 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-tertiary/60 leading-none mb-1">Email</span>
                        <span className="font-medium text-light leading-tight break-all">Yahya24680@gmail.com</span>
                      </div>
                      <AnimatePresence>
                        {copied === 'email' && (
                          <m.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="ml-auto text-[10px] font-semibold tracking-wide text-secondary"
                          >
                            Copied
                          </m.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                  <li>
                    <div className="group w-full flex items-center gap-3 rounded-full px-3 py-2 text-sm text-tertiary">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary/15 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-tertiary/60 leading-none mb-1">Location</span>
                        <span className="font-medium text-light leading-tight">Denmark, Aarhus</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <p className="mt-1.5 pt-2 border-t border-white/10 text-[10px] text-center text-tertiary/50 tracking-wide select-none">Click to copy phone or email</p>
              </div>
            </m.div>
          </div>
          </div>
        </m.div>
      </div>

      {/* We've removed the side contact card since we now have the secondary card inline */}
    </section>
  );
};

export default Contact;
