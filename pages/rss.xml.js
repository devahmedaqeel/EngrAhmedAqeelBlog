import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";

const escapeXml = (unsafe) => {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

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

export const getServerSideProps = async ({ res }) => {
  const { blog_folder } = config.settings;
  const { title } = config.site;
  const { meta_description, meta_author } = config.metadata;
  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://ahmedaqeelportfolio.vercel.app";

  const posts = getSinglePage(`content/${blog_folder}`);
  const buildDate = new Date().toUTCString();

  const rssItems = posts
    .map((post) => {
      const pTitle = escapeXml(post.frontmatter.title);
      const pLink = `${siteUrl}/${blog_folder}/${post.slug}`;
      const pDesc = escapeXml(post.frontmatter.description || getExcerpt(post.content));
      const pDate = post.frontmatter.date
        ? new Date(post.frontmatter.date).toUTCString()
        : buildDate;

      return `<item>
        <title>${pTitle}</title>
        <link>${pLink}</link>
        <guid isPermaLink="true">${pLink}</guid>
        <pubDate>${pDate}</pubDate>
        <description>${pDesc}</description>
        <author>${escapeXml(post.frontmatter.author || meta_author)}</author>
      </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(meta_description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(rssXml);
  res.end();

  return { props: {} };
};

const Rss = () => null;
export default Rss;
