import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";

const getExcerpt = (content = "") => {
  return content
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 280);
};

export default function handler(req, res) {
  const { blog_folder } = config.settings;
  const { title } = config.site;
  const { meta_description, meta_author } = config.metadata;
  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://ahmedaqeelportfolio.vercel.app";

  const posts = getSinglePage(`content/${blog_folder}`);

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: title,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: meta_description,
    author: { name: meta_author },
    items: posts.map((post) => ({
      id: `${siteUrl}/${blog_folder}/${post.slug}`,
      url: `${siteUrl}/${blog_folder}/${post.slug}`,
      title: post.frontmatter.title,
      summary: post.frontmatter.description || getExcerpt(post.content),
      date_published: post.frontmatter.date
        ? new Date(post.frontmatter.date).toISOString()
        : new Date().toISOString(),
    })),
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(jsonFeed);
}
