"use client";

import { useEffect } from "react";

function ThemeProvider() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore errors (e.g., when localStorage is not available)
    }
  }, []);
  
  return null;
}

export default ThemeProvider; 