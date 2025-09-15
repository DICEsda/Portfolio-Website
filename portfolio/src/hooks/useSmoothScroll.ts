import { useCallback, useEffect } from 'react';

interface ScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
}

export const useSmoothScroll = () => {
  // Easing functions
  const easing = {
    easeInOutCubic: (t: number): number => 
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    
    easeOutExpo: (t: number): number => 
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      
    easeInOutQuint: (t: number): number =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
  };

  // Handle intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((elementId: string, options: ScrollOptions = {}) => {
    try {
      const {
        duration = 1000,
        offset = 80, // Header height
        easing: easingFn = easing.easeOutExpo
      } = options;

      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with id '${elementId}' not found`);
        return;
      }

      const start = window.pageYOffset;
      const end = Math.max(0, element.getBoundingClientRect().top + start - offset);
      const startTime = performance.now();

      // Smooth scroll animation
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easingFn(progress);
        const currentPosition = start + (end - start) * easedProgress;
        
        window.scrollTo(0, currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  }, []);

  return scrollToSection;
};
