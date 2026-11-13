import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Evidence status for any quantitative or factual claim.
 *  verified  – supporting artefact is linked or attached
 *  reported  – stated on the résumé; supporting artefact not yet attached
 *  estimated – calculated from partial data, method described
 *  simulated – produced from synthetic or public demo data
 *  target    – a goal, not yet achieved
 *  draft     – value still missing
 */
export const evidenceStatus = z.enum(['verified', 'reported', 'estimated', 'simulated', 'target', 'draft']);

const metric = z.object({
  name: z.string(),
  value: z.string().optional(),
  unit: z.string().optional(),
  baseline: z.string().optional(),
  final: z.string().optional(),
  period: z.string().optional(),
  population: z.string().optional(),
  method: z.string().optional(),
  source: z.string().optional(),
  status: evidenceStatus,
  needs: z.array(z.string()).default([]),
});

/** A block of case-study content. `needs` renders as a visible draft field. */
const section = z
  .object({
    text: z.string().optional(),
    points: z.array(z.string()).default([]),
    needs: z.array(z.string()).default([]),
  })
  .default({ points: [], needs: [] });

const chart = z.object({
  title: z.string(),
  description: z.string().optional(),
  xLabel: z.string(),
  yLabel: z.string(),
  unit: z.string(),
  status: evidenceStatus,
  source: z.string(),
  data: z.array(z.object({ label: z.string(), value: z.number(), note: z.string().optional() })),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experience' }),
  schema: z.object({
    employer: z.string(),
    employerNote: z.string().optional(),
    role: z.string(),
    account: z.string().optional(),
    start: z.string().regex(/^\d{4}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
    location: z.string(),
    industry: z.string(),
    industryNeedsConfirmation: z.boolean().default(false),
    track: z.enum(['analytics', 'operations']),
    domains: z.array(z.string()),
    summary: z.string(),
    context: section,
    responsibilities: z.array(z.string()),
    contribution: section,
    problems: section,
    tools: z.array(z.string()),
    methods: z.array(z.string()).default([]),
    achievements: z.array(metric).default([]),
    highlight: z.string().optional(),
    skills: z.array(z.string()).default([]),
    lessons: section,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    kind: z.enum(['professional', 'independent', 'concept']),
    status: z.enum(['completed', 'in-progress', 'proposed']),
    employer: z.string().optional(), // id of a file in content/experience
    period: z.string().optional(),
    domains: z.array(z.string()),
    projectType: z.string(),
    technologies: z.array(z.string()),
    preview: z.enum(['pipeline', 'dashboard', 'experiment', 'segments', 'reconciliation', 'agent', 'forecast', 'recommender']),
    usesSyntheticData: z.boolean().default(false),
    card: z.object({ problem: z.string(), solution: z.string(), result: z.string(), resultStatus: evidenceStatus }),
    summary: z.object({ problem: z.string(), solution: z.string(), outcome: z.string() }),
    context: section,
    contribution: section,
    data: section,
    architecture: z.object({
      caption: z.string().optional(),
      stages: z.array(z.object({ label: z.string(), detail: z.string().optional() })),
      needs: z.array(z.string()).default([]),
    }),
    implementation: section,
    details: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    validation: section,
    results: section,
    metrics: z.array(metric).default([]),
    charts: z.array(chart).default([]),
    limitations: section,
    nextSteps: z.array(z.string()).default([]),
    evidence: z
      .array(z.object({ label: z.string(), type: z.string(), url: z.url().optional(), note: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { experience, projects };
