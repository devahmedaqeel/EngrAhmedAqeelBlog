const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const config = require("../config/config.json");
const { blog_folder } = config.settings;
const { title, base_url } = config.site;
const { meta_description, meta_author } = config.metadata;

const jsonDir = path.join(__dirname, "../.json");
const publicDir = path.join(__dirname, "../public");
const contentDir = path.join(__dirname, `../content/${blog_folder}`);

// Get post data
const getPosts = fs.readdirSync(contentDir);
const filterPosts = getPosts.filter((post) => post.match(/^(?!_)/));

const posts = filterPosts.map((filename) => {
  const slug = filename.replace(".md", "");
  const postData = fs.readFileSync(path.join(contentDir, filename), "utf-8");
  const parsed = matter(postData);

  return {
    frontmatter: parsed.data,
    content: parsed.content,
    slug: slug,
  };
});

// Helper to escape XML special chars
const escapeXml = (unsafe) => {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Clean plain excerpt
const getExcerpt = (content) => {
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

// 1. Generate .json/posts.json
try {
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  fs.writeFileSync(path.join(jsonDir, "posts.json"), JSON.stringify(posts, null, 2));
  console.log("Successfully generated .json/posts.json");
} catch (err) {
  console.error("Error generating posts.json:", err);
}

// 2. Generate public/rss.xml (RSS 2.0 Feed for Mailchimp / RSS Readers)
try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const siteUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (base_url && base_url !== "/" ? (base_url.endsWith("/") ? base_url.slice(0, -1) : base_url) : "https://engr-ahmed-aqeel-blog.vercel.app");
  const buildDate = new Date().toUTCString();

  const rssItems = posts
    .map((post) => {
      const pTitle = escapeXml(post.frontmatter.title);
      const pLink = `${siteUrl}/${blog_folder}/${post.slug}`;
      const pDesc = escapeXml(post.frontmatter.description || getExcerpt(post.content));
      const pDate = post.frontmatter.date
        ? new Date(post.frontmatter.date).toUTCString()
        : buildDate;

      return `    <item>
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

  fs.writeFileSync(path.join(publicDir, "rss.xml"), rssXml);
  fs.writeFileSync(path.join(publicDir, "feed.xml"), rssXml);
  console.log("Successfully generated public/rss.xml & public/feed.xml");

  // Also JSON Feed for modern integrations
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
  fs.writeFileSync(path.join(publicDir, "feed.json"), JSON.stringify(jsonFeed, null, 2));
  console.log("Successfully generated public/feed.json");
} catch (err) {
  console.error("Error generating RSS/JSON feeds:", err);
}
