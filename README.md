# Karthikraj Subramanian: portfolio

A static, multipage portfolio built with [Astro](https://astro.build) and TypeScript, deployed to GitHub Pages by GitHub Actions. No backend, paid service or API key.

Every employer and every project has its own URL:

```
/                               Homepage
/experience/                    Experience directory (filter by domain)
/experience/<employer>/         One page per employer
/projects/                      Project gallery (search and five filters)
/projects/<project>/            One case study per project
/about/  /resume/  /contact/    Supporting pages
/404.html                       Not-found page
```

## Local development

Requires Node 22.23.4 or newer (Node 24 recommended; see `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # production build into dist/
npm run preview      # serve the production build
npm run verify       # type check + build + internal link check
npm run drafts       # list every fact still needed to finish the content
```

To test a project-site build locally (`username.github.io/repo-name/`):

```bash
BASE_PATH=/repo-name npm run build
BASE_PATH=/repo-name npm run check:links
BASE_PATH=/repo-name npm run preview
```

## Deploying to GitHub Pages

1. Create a repository on GitHub and push this folder to the `main` branch.
   - Name it `<username>.github.io` to serve from `https://<username>.github.io/`.
   - Any other name serves from `https://<username>.github.io/<repository-name>/`.
2. In the repository open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**. (Do not choose "Deploy from a branch".)
4. Push to `main`, or open the **Actions** tab, select **Deploy to GitHub Pages** and choose **Run workflow**.
5. When the run finishes, the site URL is shown on the workflow run and under **Settings → Pages**.

You do not need to edit any configuration for the base path. `.github/workflows/deploy.yml` reads the site origin and base path from the repository's Pages settings (`actions/configure-pages`) and passes them to the build as `SITE_URL` and `BASE_PATH`. The same code works for both URL shapes, and for a custom domain if you add one later.

The workflow also runs the link checker, so a broken internal link fails the deployment.

## Updating content

Content is separate from presentation. You should rarely need to touch a `.astro` file.

| What | Where |
| --- | --- |
| Name, headline, email, LinkedIn, GitHub, featured projects, skills, education | `src/data/site.ts` |
| Employers | `src/content/experience/<id>.yaml` |
| Projects and case studies | `src/content/projects/<id>.yaml` |
| Field definitions and validation | `src/content.config.ts` |
| Colours, type, spacing | `src/styles/global.css` (tokens at the top) |
| Site origin and base path | `astro.config.mjs` (set by the workflow) |

### Add an employer

Copy any file in `src/content/experience/`, rename it, and edit. The file name is the stable ID and the URL: `acme.yaml` becomes `/experience/acme/`. It appears automatically in the timeline, directory, résumé page and tenure chart.

### Add a project

Copy any file in `src/content/projects/`. The file name is the ID and the URL. Key fields:

- `kind`: `professional`, `independent` or `concept`. Concepts are labelled as proposed everywhere and excluded from counts of completed work.
- `status`: `completed`, `in-progress` or `proposed`.
- `employer`: the ID of an experience file. This creates the links in both directions.
- `technologies`: each value becomes a filter option and a tag linking to `/projects/?tech=<value>`.
- `preview`: which schematic illustration to use (`pipeline`, `dashboard`, `experiment`, `segments`, `reconciliation`, `agent`, `forecast`, `recommender`).
- `usesSyntheticData: true` adds a visible synthetic-data notice.
- `order`: position in the gallery and in previous/next navigation.

To feature a project on the homepage, add its ID to `featuredProjects` in `src/data/site.ts`.

### Metrics and evidence

Every metric has a `status`, shown next to the number:

| Status | Meaning |
| --- | --- |
| `verified` | A supporting artefact is linked |
| `reported` | Stated on the résumé; artefact not yet attached |
| `estimated` | Calculated from partial data; method given |
| `simulated` | From synthetic or public demo data |
| `target` | A goal for planned work |
| `draft` | Value not supplied yet |

A complete metric looks like this:

```yaml
metrics:
  - name: Report preparation time
    value: "2"
    unit: hours per cycle
    baseline: 6 hours
    final: 2 hours
    period: Jan to Mar 2023
    population: Weekly performance report
    method: Average of logged preparation time, 12 cycles before and after
    source: JIRA time logs
    status: verified
```

Only `verified` and `reported` achievements appear on the homepage.

### Draft fields

Any section can carry a `needs:` list. Each item renders as a dashed "Draft" box listing what is missing. Delete an item when you have supplied the fact.

- `npm run drafts` prints every open item, grouped by file.
- Set `showDrafts: false` in `src/data/site.ts` to hide all draft boxes and unfilled metrics, for example if you want to publish before everything is complete.

### Charts

Add measured values to a project's `charts` list and a chart with tooltips, labelled axes and a data table appears in its Results section:

```yaml
charts:
  - title: WAPE by validation window
    xLabel: WAPE
    yLabel: Validation window
    unit: "%"
    status: verified
    source: notebooks/validation.ipynb
    data:
      - { label: "Window 1", value: 31.2 }
      - { label: "Window 2", value: 29.8 }
```

Only enter values you measured. A single before-and-after pair belongs in a metric (`baseline` and `final`), not a chart.

### Résumé download

Put a PDF at `public/resume.pdf`. The "Download résumé" buttons appear automatically when the file exists; until then they link to the résumé page, which can be printed to PDF. Change the file name with `resumeFile` in `src/data/site.ts`.

### Evidence links

Add `url:` to an item in a project's `evidence` list to turn it into a link:

```yaml
evidence:
  - label: Code repository
    type: Repository
    url: https://github.com/KARTHIKRAJ10/analyx
```

### Social preview image

`public/og.png` (1200 × 630) is used for link previews. Replace the file to change it.

## Project structure

```
src/
  content.config.ts        Content schemas
  content/experience/      One YAML file per employer
  content/projects/        One YAML file per project
  data/site.ts             Profile, links, skills, homepage settings
  components/              Cards, timeline, chart, flow diagram, evidence tags
  layouts/BaseLayout.astro Head, SEO tags, header, footer
  pages/                   Routes
  scripts/filters.ts       Search and filter logic
  styles/global.css        Design tokens and base styles
  lib/                     Helpers (base-path links, dates)
scripts/                   Link checker and draft lister
.github/workflows/         GitHub Pages deployment
```

Internal links and assets must go through `href()` from `src/lib/utils.ts`, which adds the base path. The link checker fails the build if one does not.
