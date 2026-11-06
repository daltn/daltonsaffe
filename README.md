# Dalton Saffe

Source for [daltonsaffe.com](https://daltonsaffe.com). It's a static site built with [Eleventy](https://www.11ty.dev/) and deployed on Netlify.

## Run locally

```sh
npm install
npm start        # http://localhost:8080, reloads on save
```

## Add a journal post

Create `src/journal/posts/YYYY-MM-DD-some-slug.md`:

```md
---
title: some title
description: optional one-liner for link previews
cover: optional_cloudinary_id
draft: true   # optional: shows locally, hidden on the live site
---

Write in Markdown. Images, links and embeds (SoundCloud iframes etc.) all work.
```

The date comes from the filename. The URL is `/journal/some-slug/`. Posts also go into `/feed.xml`.

## Add a painting

Upload the image to Cloudinary, then add an entry to the top of `src/_data/paintings.yaml` (all fields are explained at the top of that file):

```yaml
- title: Untitled (Blue)
  image: my_cloudinary_public_id
  year: 2026
  medium: oil on canvas
  size: 24 × 30 in
  status: available   # adds an "inquire" link; or "sold"
  featured: true      # shows on the home page
```

## Add photos

Add a series, or more photos to an existing one, in `src/_data/photos.yaml`.

## Images

`image` fields take a Cloudinary public ID (the cloud name is set in `src/_data/site.json`) or a full image URL. Templates use `{% img id, "alt" %}`, which outputs a responsive `srcset` from Cloudinary's resize options.
