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

  // 4. Generate public/sitemap.xml
  const currentDate = new Date().toISOString();
  const staticPages = ["", "about", "contact", "posts", "categories"];
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

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml);
  console.log("Successfully generated public/sitemap.xml");

  // 5. Automatic Subscriber Email Broadcast during Build
  const nodemailer = require("nodemailer");
  const smtpUser = process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";
  const smtpPass = (process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "") || "svgtgjzhnbqtqgdt";
  let subscribers = ["chahmedaqeel53@gmail.com", "engrahmedaqeel14@gmail.com"];
  try {
    try {
      const certSrc = 'C:/Users/user/.gemini/antigravity-ide/brain/cdae5f38-f3a0-479c-9002-5da4406dd584/.tempmediaStorage/media_cdae5f38-f3a0-479c-9002-5da4406dd584_1786513534911.png';
      const certDest = path.join(process.cwd(), 'public', 'images', 'post', 'meta-react-native-certificate.png');
      if (fs.existsSync(certSrc)) {
        if (!fs.existsSync(path.dirname(certDest))) fs.mkdirSync(path.dirname(certDest), { recursive: true });
        fs.copyFileSync(certSrc, certDest);
        console.log("Successfully copied Meta React Native Certificate image to public/images/post!");
      }
    } catch (copyErr) {
      console.warn("Cert image copy warning:", copyErr.message);
    }
    const subFile = path.join(process.cwd(), "config", "subscribers.json");
    if (fs.existsSync(subFile)) {
      const subData = JSON.parse(fs.readFileSync(subFile, "utf-8"));
      if (Array.isArray(subData) && subData.length > 0) {
        subscribers = Array.from(new Set(subData)).filter(email => email !== "engrahmedaqeel99@gmail.com");
      }
    }
  } catch (e) {
    console.warn("Subscribers file read warning:", e.message);
  }

  // Ensure Meta Certification post is latest if available
  if (posts && posts.length > 0) {
    posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    const latest = posts.find(p => p.slug === "meta-react-native-certification") || posts[0];
    const siteUrl = "https://engr-ahmed-aqeel-blog.vercel.app";
    const pUrl = `${siteUrl}/${blog_folder}/${latest.slug}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser.includes("engrahmedaqeel4") ? "engrahmedaqeel14@gmail.com" : smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a2e; max-width: 620px; border: 1px solid #e8e8f0; border-radius: 16px; margin: auto; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="background: rgba(108,99,255,0.12); color: #6C63FF; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
            🚀 New Project &amp; Blog Update Published
          </span>
        </div>

        <h2 style="color: #1a1a2e; text-align: center; margin-top: 10px; font-size: 22px; font-weight: 800; line-height: 1.3;">
          ${latest.frontmatter.title}
        </h2>

        <p style="font-size: 14px; line-height: 1.6; color: #4a4a6a; margin-top: 15px;">
          ${latest.frontmatter.description || getExcerpt(latest.content)}
        </p>

        <div style="text-align: center; margin-top: 25px; margin-bottom: 20px;">
          <a href="${pUrl}" style="background: linear-gradient(135deg, #6C63FF, #8B5CF6); color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 10px; font-size: 13px; font-weight: 800; display: inline-block; box-shadow: 0 4px 16px rgba(108,99,255,0.35);">
            📖 Read Full Project &amp; Article &rarr;
          </a>
        </div>

        <div style="text-align: center; margin-bottom: 15px;">
          <a href="${siteUrl}" style="color: #6C63FF; text-decoration: underline; font-size: 12px; font-weight: 700;">
            🌐 Visit Official Portfolio Website (${siteUrl})
          </a>
        </div>
      </div>
    `;

    for (const sub of subscribers) {
      transporter.sendMail({
        from: `"Engr. Ahmed Aqeel" <${smtpUser}>`,
        to: sub,
        subject: `🚀 New Project Published: ${latest.frontmatter.title}`,
        html: htmlContent,
      }).then(() => {
        console.log(`Auto-broadcast email sent to subscriber: ${sub}`);
      }).catch((err) => {
        console.warn(`Auto-broadcast error for ${sub}:`, err.message);
      });
    }
  }
} catch (err) {
  console.error("Error generating RSS/JSON/Sitemap feeds:", err);
}
