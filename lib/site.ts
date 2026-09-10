/**
 * Canonical origin of the deployed site.
 *
 * Metadata that has to be absolute -- Open Graph images, canonical links, the
 * sitemap -- is resolved against this. The production domain is the default on
 * purpose: falling back to localhost meant every share of the deployed site
 * advertised an og:image nobody outside this machine could load.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://danielrodriguezportfolio.vercel.app");

export const GITHUB_URL = "https://github.com/drodriguezj12";
export const LINKEDIN_URL = "https://www.linkedin.com/in/daniel-rodriguez-b795a8406/";
