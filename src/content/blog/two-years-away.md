---
title: "Fixing an Old Astro Site After Two Years Away"
description: "Rebuilding my development environment, fixing GitHub Pages, and getting back into builder mode."
pubDate: "May 6, 2026"
heroImage: "/astro.jpg"
---

## Fixing an Old Astro Site After Two Years Away

I recently built a new PC and realized I had not touched my personal website since 2024.

The site was originally built with Astro and hosted through GitHub Pages with a custom domain. At the time, everything worked great. Then life, work, kids, projects, and a hundred other distractions happened, and the site slowly became dormant.

After setting up my new machine, I decided to get the full development environment running again from scratch.

I quickly realized how many moving pieces had quietly accumulated over the years.

The rebuild started simple enough:
- Install Git
- Install Node.js/npm
- Clone the repository
- Run the Astro development server

Within an hour I was deep into debugging old deployment configurations, Astro routing, GitHub Actions, GitHub Pages, and custom domain issues that I had completely forgotten about.

Some of the issues I ran into:
- Missing Git and Node installations
- Astro frontmatter validation errors
- Old `/docs` GitHub Pages deployments conflicting with Astro's newer `/dist` output
- Broken custom domain routing
- CNAME placement issues
- GitHub Actions deployment problems
- Old configuration leftovers from my original Mac setup

At one point, the site was successfully deploying but still returning a 404 on both the GitHub Pages URL and my custom domain. The final issue ended up being a mix of outdated deployment settings and an old GitHub Pages workflow still trying to publish from the wrong folder.

The fix ultimately came down to:
- Switching GitHub Pages fully over to GitHub Actions
- Updating the Astro config for the custom domain
- Moving the `CNAME` file into the `public` directory
- Rebuilding the deployment workflow from scratch

Once everything finally went live again, I realized the biggest thing I had actually rebuilt was not the website itself.

It was the workflow.

There is something satisfying about getting back into:
- building
- debugging
- writing
- shipping
- and making ideas public again

Over the last few years I have accumulated a strange mix of interests and projects:
- analytics dashboards
- automation
- investing systems
- Raspberry Pi projects
- AI workflows
- local research projects
- trading ideas
- data visualization
- scripting and infrastructure

This site will probably become a place to document more of that moving forward.

Not everything needs to become a startup or a polished product. Sometimes it is enough to simply build things, document the process, and keep the momentum alive.

For now, this post is mostly a checkpoint.

The site is back online.
The workflow is working again.
And builder mode is officially reactivated.