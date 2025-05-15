/**
 * Utility function to get the correct site URL based on the environment
 * This handles the difference between development and production environments
 */
export function getSiteUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In development, use window.location.origin
    // In production, this will be the actual deployed URL
    return window.location.origin;
  }
  
  // For server-side rendering, try to use environment variables
  // Vercel automatically sets VERCEL_URL in production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to a custom domain if set in environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Final fallback for development
  return 'http://localhost:3000';
}
