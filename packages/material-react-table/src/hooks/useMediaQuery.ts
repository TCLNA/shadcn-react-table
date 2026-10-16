import { useEffect, useState } from 'react';

/**
 * Custom hook for media query matching
 * Replaces MUI's useMediaQuery hook
 * 
 * @param query - CSS media query string (e.g., '(max-width: 720px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (SSR compatibility)
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Check if window is available (SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update state if the initial value was different
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }

    // Create event listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (using addEventListener for better browser support)
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, matches]);

  return matches;
}
