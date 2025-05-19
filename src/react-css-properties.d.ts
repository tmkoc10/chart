import 'react';

declare module 'react' {
  interface CSSProperties {
    '--circle-size'?: string;
    '--circumference'?: number | string;
    '--percent-to-px'?: string;
    '--gap-percent'?: string;
    '--offset-factor'?: string;
    '--transition-length'?: string;
    '--transition-step'?: string;
    '--delay'?: string;
    '--percent-to-deg'?: string;
    '--stroke-percent'?: number | string; // Added for circle elements
    '--offset-factor-secondary'?: string; // Added for circle elements
  }
} 