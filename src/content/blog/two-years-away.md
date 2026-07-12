---
title: "Fixing an Old Astro Site After Two Years Away"
description: "Rebuilding my development environment, fixing GitHub Pages, and getting back into builder mode."
pubDate: "May 6, 2026"
heroImage: "/astro.jpg"
---

## Fixing an old Astro site after two years away

I built a new PC and realized I had not touched my personal website since 2024.

The site was built with Astro and hosted on GitHub Pages with a custom domain. It worked, then life happened: work, kids, side projects, distractions. The site stayed online, but the workflow went cold.

When I tried to run it again, the rebuild started simple enough:

- install Git
- install Node and npm
- clone the repo
- run the Astro dev server

Within an hour I was debugging old deployment settings, Astro routing, GitHub Actions, GitHub Pages, and custom domain issues I had completely forgotten about.

The problems were not exotic:

- missing Git and Node installs
- Astro frontmatter validation errors
- old `/docs` publishing settings conflicting with Astro's `/dist` output
- broken custom-domain routing
- CNAME placement
- GitHub Actions workflow leftovers
- configuration debris from my old Mac setup

At one point the site deployed successfully and still returned a 404 on both GitHub Pages and the custom domain. The final fix was a mix of moving fully to GitHub Actions, updating the Astro config, putting the `CNAME` file in `public`, and rebuilding the deployment workflow cleanly.

Once it was live again, I realized I had rebuilt more than the website.

I had rebuilt the habit of shipping.

This site will probably hold a messy mix of analytics dashboards, automation, investing systems, Raspberry Pi projects, AI workflows, local research, trading ideas, data visualization, scripting, and infrastructure.

That is fine. Not every project needs to become a startup or a polished product. Some things just need to be built, written down, and improved.

For now, the site is back online and the workflow works again.
