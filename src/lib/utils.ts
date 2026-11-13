import type { CollectionEntry } from 'astro:content';

/** Prefix an internal path with the configured base path. Always use this for links and assets. */
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function dateRange(start: string, end: string | null): string {
  return `${formatMonth(start)} to ${end ? formatMonth(end) : 'present'}`;
}

/** Month index since year 0, for timeline maths. */
export function monthIndex(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}

export function currentYm(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Inclusive month count, e.g. Nov 2022 to Apr 2023 = 6. */
export function monthsBetween(start: string, end: string | null): number {
  return monthIndex(end ?? currentYm()) - monthIndex(start) + 1;
}

export function duration(start: string, end: string | null): string {
  const total = monthsBetween(start, end);
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts = [];
  if (y) parts.push(`${y} yr`);
  if (m) parts.push(`${m} mo`);
  return parts.join(' ');
}

export function byStartDesc(a: CollectionEntry<'experience'>, b: CollectionEntry<'experience'>): number {
  return monthIndex(b.data.start) - monthIndex(a.data.start);
}

export function byOrder(a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>): number {
  return a.data.order - b.data.order;
}

export const statusLabel = {
  verified: 'Verified',
  reported: 'Stated on résumé',
  estimated: 'Estimated',
  simulated: 'Simulated data',
  target: 'Target, not achieved',
  draft: 'Draft, needs data',
} as const;

export const statusHelp = {
  verified: 'A supporting artefact is linked.',
  reported: 'Taken from the résumé. No supporting artefact is attached yet.',
  estimated: 'Calculated from partial data using the method shown.',
  simulated: 'Produced from synthetic or public demonstration data, not from professional work.',
  target: 'A goal for planned work.',
  draft: 'This value has not been supplied yet.',
} as const;

export const kindLabel = {
  professional: 'Professional work',
  independent: 'Independent project',
  concept: 'Proposed concept',
} as const;

export const completionLabel = {
  completed: 'Completed',
  'in-progress': 'In progress',
  proposed: 'Proposed',
} as const;

export function techHref(tech: string): string {
  return `${href('/projects/')}?tech=${encodeURIComponent(tech)}`;
}
