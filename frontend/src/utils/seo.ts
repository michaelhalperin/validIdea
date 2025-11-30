/**
 * SEO Utility for managing meta tags dynamically
 */

const SITE_URL = 'https://valid-idea.vercel.app';
const DEFAULT_TITLE = 'ValidIdea — AI-Powered Startup Idea Validator';
const DEFAULT_DESCRIPTION = 'Validate your startup ideas with AI-powered analysis. Get market insights, competitor research, feasibility checks, and MVP roadmaps instantly.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

/**
 * Update document title
 */
export function updateTitle(title: string): void {
  document.title = title;
  // Update og:title
  updateMetaTag('property', 'og:title', title);
  // Update twitter:title
  updateMetaTag('name', 'twitter:title', title);
}

/**
 * Update meta description
 */
export function updateDescription(description: string): void {
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('name', 'twitter:description', description);
}

/**
 * Update canonical URL
 */
export function updateCanonical(url: string): void {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

/**
 * Update Open Graph image
 */
export function updateImage(image: string): void {
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('name', 'twitter:image', image);
}

/**
 * Update Open Graph URL
 */
export function updateURL(url: string): void {
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('name', 'twitter:url', url);
}

/**
 * Update robots meta tag
 */
export function updateRobots(noindex: boolean): void {
  const content = noindex ? 'noindex, nofollow' : 'index, follow';
  updateMetaTag('name', 'robots', content);
}

/**
 * Generic meta tag updater
 */
function updateMetaTag(attribute: 'name' | 'property', key: string, value: string): void {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = value;
}

/**
 * Set comprehensive SEO data for a page
 */
export function setSEO(data: SEOData): void {
  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    type = 'website',
    noindex = false,
  } = data;

  // Update title
  updateTitle(title);

  // Update description
  updateDescription(description);

  // Update image
  updateImage(image);

  // Update URL
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  updateCanonical(fullUrl);
  updateURL(fullUrl);

  // Update og:type
  updateMetaTag('property', 'og:type', type);

  // Update robots
  updateRobots(noindex);
}

/**
 * Reset SEO to defaults
 */
export function resetSEO(): void {
  setSEO({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: SITE_URL,
  });
}

