/**
 * Profile, links and homepage settings.
 * Everything a visitor sees about you that is not an employer or a project
 * lives in this file.
 */
export const site = {
  name: 'Karthikraj Subramanian',
  shortName: 'Karthikraj',
  headline: 'Data and AI professional',
  valueProposition:
    'I make data agree with its sources, then turn it into analysis teams can act on.',
  intro:
    'Three-plus years in data analyst and engineering roles across enterprise reporting, ecommerce marketing and customer analytics, followed by hands-on inventory control in Ontario warehouses. Python and SQL first, with Power BI, Excel and cloud data platforms.',
  location: 'Ontario, Canada',
  availability: 'Open to data, analytics engineering and machine learning roles in Canada.',

  /** Leave a value empty ('') to hide the link everywhere. */
  email: 'karthicksubramani97@gmail.com',
  linkedin: 'https://www.linkedin.com/in/karthik-raj',
  github: 'https://github.com/KARTHIKRAJ10',

  /** File name inside /public. The download button only appears if the file exists. */
  resumeFile: 'resume.pdf',

  /**
   * true  – show "Draft" fields listing the facts still needed (use while editing)
   * false – hide draft fields and unfilled metrics (use for a public launch if any remain)
   */
  showDrafts: true,

  /** Project ids (file names in src/content/projects without .yaml), in display order. */
  featuredProjects: [
    'ecommerce-kpi-dashboards',
    'enterprise-data-integration',
    'analyx-analytics-agent',
    'retail-demand-forecasting',
  ],

  description:
    'Portfolio of Karthikraj Subramanian: analytics engineering, marketing analytics, machine learning and operational analytics case studies, with evidence status shown for every result.',
} as const;

export const navigation = [
  { label: 'Experience', path: '/experience/' },
  { label: 'Projects', path: '/projects/' },
  { label: 'About', path: '/about/' },
  { label: 'Résumé', path: '/resume/' },
  { label: 'Contact', path: '/contact/' },
] as const;

/** Skills as grouped on the résumé. Each tag links to the project gallery filtered by `tech`, when `tech` is set. */
export const capabilities: { domain: string; note: string; skills: { label: string; tech?: string }[] }[] = [
  {
    domain: 'Programming and data',
    note: 'Extraction, transformation and validation workflows.',
    skills: [
      { label: 'Python', tech: 'Python' },
      { label: 'SQL', tech: 'SQL' },
      { label: 'Data extraction and transformation' },
      { label: 'Workflow automation' },
      { label: 'Data validation' },
    ],
  },
  {
    domain: 'Quantitative analysis',
    note: 'Explaining what changed and whether it matters.',
    skills: [
      { label: 'Time-series analysis' },
      { label: 'Anomaly detection' },
      { label: 'A/B testing', tech: 'A/B testing' },
      { label: 'Segmentation', tech: 'Segmentation' },
      { label: 'Performance analysis' },
    ],
  },
  {
    domain: 'Reporting and reconciliation',
    note: 'Dashboards people trust because the totals tie out.',
    skills: [
      { label: 'Power BI', tech: 'Power BI' },
      { label: 'DAX' },
      { label: 'Power Query' },
      { label: 'Looker Studio', tech: 'Looker Studio' },
      { label: 'Excel', tech: 'Excel' },
      { label: 'Variance investigation' },
    ],
  },
  {
    domain: 'Platforms and collaboration',
    note: 'Where the work runs and how it is tracked.',
    skills: [
      { label: 'Azure Databricks' },
      { label: 'BigQuery' },
      { label: 'Git' },
      { label: 'JIRA', tech: 'JIRA' },
      { label: 'Confluence' },
      { label: 'Requirements documentation' },
    ],
  },
  {
    domain: 'Machine learning and LLM applications',
    note: 'Independent portfolio work, labelled as such on each case study.',
    skills: [
      { label: 'LightGBM', tech: 'LightGBM' },
      { label: 'Retrieval-augmented generation', tech: 'RAG' },
      { label: 'Embeddings and clustering', tech: 'Embeddings' },
      { label: 'FastAPI', tech: 'FastAPI' },
      { label: 'Claude API', tech: 'Claude API' },
    ],
  },
];

export const education = [
  {
    credential: 'Graduate Certificate, Information Technology Business Analysis',
    school: 'Conestoga College',
    place: 'Ontario',
    dates: 'Jan 2023 to Jan 2024',
    start: '2023-01',
    end: '2024-01',
  },
  { credential: 'Bachelor of Engineering', school: 'Anna University', place: 'India', dates: 'Jan 2014 to Jan 2018', start: '2014-01', end: '2018-01' },
];
