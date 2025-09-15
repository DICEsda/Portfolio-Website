import { getCLS, getFID, getLCP } from 'web-vitals';

export function reportWebVitals(onPerfEntry: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);  // Cumulative Layout Shift
    getFID(onPerfEntry);  // First Input Delay
    getLCP(onPerfEntry);  // Largest Contentful Paint
  }
}
