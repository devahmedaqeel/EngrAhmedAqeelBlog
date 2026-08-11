import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Allow GET or POST
  try {
    const jsonPath = path.join(process.cwd(), ".json/posts.json");
    if (!fs.existsSync(jsonPath)) {
      return res.status(400).json({ success: false, error: "No posts data found." });
    }

    const postsRaw = fs.readFileSync(jsonPath, "utf-8");
    const posts = JSON.parse(postsRaw || "[]");

    if (!posts || posts.length === 0) {
      return res.status(200).json({ success: true, message: "No posts available to notify." });
    }

    // Latest post is the first post or sorted by date
    const latestPost = posts[0];
    const { title, description, categories, image } = latestPost.frontmatter || {};
    const slug = latestPost.slug;

    const siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://ahmedaqeelportfolio.vercel.app";
    const postUrl = `${siteUrl}/posts/${slug}`;

    // Get SMTP Configuration
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";

    // If Nodemailer is configured
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const categoryTags = (categories || []).join(", ");

      // Broadcast Email HTML
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a2e; max-width: 620px; border: 1px solid #e8e8f0; border-radius: 16px; margin: auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background: rgba(108,99,255,0.1); color: #6C63FF; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              🚀 New Project &amp; Tech Update
            </span>
          </div>

          <h2 style="color: #1a1a2e; text-align: center; margin-top: 10px; font-size: 22px; font-weight: 800;">
            ${title}
          </h2>

          ${image ? `<div style="text-align: center; margin: 20px 0;"><img src="${siteUrl}${image}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" /></div>` : ""}

          <p style="font-size: 14px; line-height: 1.6; color: #4a4a6a; margin-top: 15px;">
            ${description || "Check out the latest software architecture, AI feature, and project case study on Engr. Ahmed Aqeel's portfolio website."}
          </p>

          ${categoryTags ? `<p style="font-size: 12px; color: #6C63FF; font-weight: bold;">Filed under: ${categoryTags}</p>` : ""}

          <div style="text-align: center; margin-top: 25px;">
            <a href="${postUrl}" style="background: linear-gradient(135deg, #6C63FF, #8B5CF6); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px rgba(108,99,255,0.3);">
              View Project Case Study &rarr;
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e8e8f0; margin-top: 30px;" />

          <p style="font-size: 11px; color: #9898b3; text-align: center; margin-top: 15px;">
            Sent by <strong>Engr. Ahmed Aqeel</strong> &bull; Full Stack AI Developer &amp; Software Engineer<br/>
            You are receiving this update because you subscribed to tech updates on <a href="${siteUrl}" style="color: #6C63FF;">ahmedaqeelportfolio.vercel.app</a>
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Engr. Ahmed Aqeel" <${smtpUser}>`,
        to: toEmail,
        subject: `🚀 New Project Published: ${title}`,
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        message: `Notification broadcast sent successfully for "${title}"!`,
        latestPost: { title, slug, postUrl },
      });
    }

    // Dry-run mode if SMTP credentials not added yet
    return res.status(200).json({
      success: true,
      message: `Latest post ready for subscribers: "${title}"`,
      postUrl,
      rssFeedUrl: `${siteUrl}/rss.xml`,
      jsonFeedUrl: `${siteUrl}/feed.json`,
      info: "Add SMTP_USER & SMTP_PASS to Vercel Environment Variables to trigger instant email broadcasts, or link your RSS feed URL to Mailchimp / ConvertKit RSS campaigns!",
    });
  } catch (error) {
    console.error("Subscriber notification error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
