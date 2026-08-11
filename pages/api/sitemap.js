import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";

export default function handler(req, res) {
  const { blog_folder } = config.settings;
  const siteUrl = "https://engr-ahmed-aqeel-blog.vercel.app";

  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const staticPages = [
    "",
    "about",
    "contact",
    "posts",
    "categories",
  ];

  const currentDate = new Date().toISOString();

  const staticUrls = staticPages
    .map((page) => {
      const url = page ? `${siteUrl}/${page}` : `${siteUrl}/`;
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n");

  const postUrls = posts
    .map((post) => {
      const pUrl = `${siteUrl}/${blog_folder}/${post.slug}`;
      const pDate = post.frontmatter.date
        ? new Date(post.frontmatter.date).toISOString()
        : currentDate;
      return `  <url>
    <loc>${pUrl}</loc>
    <lastmod>${pDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join("\n");

  const categoryUrls = categories
    .map((cat) => {
      const cUrl = `${siteUrl}/categories/${cat.replace(/ /g, "-")}`;
      return `  <url>
    <loc>${cUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
${categoryUrls}
</urlset>`;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(sitemapXml);
}
