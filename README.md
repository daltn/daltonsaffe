# Dalton Saffe

Source for [daltonsaffe.com](https://daltonsaffe.com). It's a static site built with [Eleventy](https://www.11ty.dev/) and hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) as static files.

## Run locally

Needs Node 22.12 or newer (`nvm use` picks it up from `.nvmrc`).

```sh
npm install
npm start        # http://localhost:8080, reloads on save
npm run preview  # build, then serve it the way Cloudflare does (http://localhost:8787)
```

## Deploy

Pushing to `main` deploys automatically: Cloudflare runs `npm run build`, then `npx wrangler deploy`, which uploads `_site/` using the settings in `wrangler.jsonc`. Pull requests get their own preview URL.

To deploy by hand instead: `npx wrangler login` once, then `npm run deploy`.

## Add a blog post

Create `src/blog/posts/YYYY-MM-DD-some-slug.md`:

```md
---
title: some title
description: optional one-liner for link previews
cover: optional_cloudinary_id
draft: true   # optional: shows locally, hidden on the live site
---

Write in Markdown. Images, links and embeds (SoundCloud iframes etc.) all work.
```

The date comes from the filename. The URL is `/blog/some-slug/`. Posts also go into `/feed.xml`.

## Add a painting

Upload the image to Cloudinary, then add an entry to the top of `src/_data/paintings.yaml` (all fields are explained at the top of that file). It appears in the paintings section of `/art/` and gets its own page at `/art/paintings/<slug>/`:

```yaml
- title: Untitled (Blue)
  image: my_cloudinary_public_id
  year: 2026
  medium: oil on canvas
  size: 24 × 30 in
  status: available   # adds an "inquire" link; or "sold"
```

## Add photos

Add a series, or more photos to an existing one, in `src/_data/photos.yaml`. Each series appears in the photos section of `/art/` and gets its own page at `/art/photos/<slug>/`.

## Images

`image` fields take a Cloudinary public ID (the cloud name is set in `src/_data/site.json`) or a full image URL. Templates use `{% img id, "alt" %}`, which outputs a responsive `srcset` from Cloudinary's resize options.
