import { readFileSync } from "node:fs";
import { load as loadYaml } from "js-yaml";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
const site = JSON.parse(readFileSync(new URL("./src/_data/site.json", import.meta.url), "utf8"));

const CLOUDINARY = `https://res.cloudinary.com/${site.cloudinary}/image/upload`;
const WIDTHS = [400, 800, 1200, 1600];

// Cloudinary URL for a public ID at a given width (never upscaled).
// Full URLs pass through untouched so you can also point at any other image.
const imageUrl = (id, width = 1200) =>
  /^https?:\/\//.test(id) ? id : `${CLOUDINARY}/f_auto,q_auto,c_limit,w_${width}/${id}`;

const escapeAttr = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", (contents) => loadYaml(contents));

  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy("src/style.css");

  // {% img "public_id", "alt text", "sizes", "class", lazy %}
  eleventyConfig.addShortcode("img", (id, alt = "", sizes = "100vw", cls = "", lazy = true) => {
    if (!id) return "";
    const srcset = /^https?:\/\//.test(id)
      ? ""
      : ` srcset="${WIDTHS.map((w) => `${imageUrl(id, w)} ${w}w`).join(", ")}" sizes="${sizes}"`;
    return `<img src="${imageUrl(id, 1200)}"${srcset} alt="${escapeAttr(alt)}"${
      cls ? ` class="${cls}"` : ""
    }${lazy ? ' loading="lazy"' : ""} decoding="async">`;
  });

  eleventyConfig.addFilter("imageUrl", imageUrl);
  eleventyConfig.addFilter("fullUrl", (path) => new URL(path, site.url).href);
  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  eleventyConfig.addFilter("head", (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []));
  eleventyConfig.addFilter("featured", (arr) => (arr || []).filter((x) => x.featured));
  // stable slug for data-driven pages: explicit `slug`, else slugified title
  eleventyConfig.addFilter("itemSlug", function (item) {
    return item.slug || eleventyConfig.getFilter("slugify")(item.title);
  });

  // Blog posts: newest first. Set `draft: true` to keep a post off the live site.
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/blog/posts/*.md")
      .filter((p) => !(p.data.draft && process.env.ELEVENTY_RUN_MODE === "build"))
  );

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: `${site.title} — blog`,
      subtitle: site.description,
      base: site.url + "/",
      author: { name: site.title },
    },
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
