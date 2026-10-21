# tangobuilds.com

The Tangobuilds website: a front page and one themed page per project, built with [Astro](https://astro.build) (Node.js) into plain static files and published on GitHub Pages.

## Run it locally

Needs Node.js 20 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve the built site
```

## Where things live

```
src/data/projects.ts          the projects: names, status, text, order
src/pages/index.astro         front page
src/pages/projects/*.astro    one themed page per project
src/components/               header, footer, cover art, previous/next links
src/lib/motion.ts             shared animations (scroll reveals, counters, tilt)
src/styles/global.css         studio colours, type and buttons
public/assets/                images and favicon
.github/workflows/deploy.yml  builds and publishes on every push to main
```

To add a project: add it to `src/data/projects.ts`, add a cover in `src/components/Cover.astro` and create `src/pages/projects/<slug>.astro`.

## Publishing

Every push to `main` runs the GitHub Actions workflow, which builds the site and deploys it to GitHub Pages. The Pages source must be set to **GitHub Actions** under Settings → Pages. The workflow reads the base path from the Pages settings, so the same build works on `tangobuilds.github.io/Tangobuilds.com` now and on `tangobuilds.com` once the custom domain is set.

All animations respect the visitor's "reduce motion" setting.
