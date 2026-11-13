import { existsSync } from 'node:fs';
import { site } from '../data/site';
import { href } from './utils';

/** URL of the résumé PDF, or null when public/<resumeFile> does not exist. */
export function resumeUrl(): string | null {
  if (!site.resumeFile) return null;
  return existsSync(new URL(`../../public/${site.resumeFile}`, import.meta.url)) || existsSync(`public/${site.resumeFile}`)
    ? href(`/${site.resumeFile}`)
    : null;
}
