import { useCallback, useEffect } from 'react';

interface ScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
}

export const useSmoothScroll = () => {

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

  const scrollToSection = useCallback((elementId: string, _options: ScrollOptions = {}) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with id '${elementId}' not found`);
        return;
      }

      const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
      (element as HTMLElement).style.scrollMarginTop = `${navHeight}px`;

      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  }, []);

  return scrollToSection;
};
