import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment settings
 * -------------------
 * SITE_URL  – origin only, e.g. https://karthikraj10.github.io
 * BASE_PATH – "/" for a user site (username.github.io),
 *             "/repository-name" for a project site.
 *
 * The GitHub Actions workflow sets both automatically from the repository's
 * Pages settings, so you normally never edit this file. For a local test of a
 * project-site build:  BASE_PATH=/my-repo npm run build
 */
const site = process.env.SITE_URL || 'https://karthikraj10.github.io';
const rawBase = process.env.BASE_PATH || '/';
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
