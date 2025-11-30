import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setSEO, resetSEO } from '../utils/seo';
import type { SEOData } from '../utils/seo';

/**
 * Hook for managing SEO meta tags on a page
 */
export function useSEO(data?: SEOData) {
  const location = useLocation();

  useEffect(() => {
    if (data) {
      setSEO({
        ...data,
        url: data.url || location.pathname,
      });
    } else {
      resetSEO();
    }

    // Cleanup: reset on unmount
    return () => {
      resetSEO();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, JSON.stringify(data)]);
}

