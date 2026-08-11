import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Allow GET or POST
  try {
    const { blog_folder } = config.settings;
    const posts = getSinglePage(`content/${blog_folder}`);

    if (!posts || posts.length === 0) {
      return res.status(200).json({ success: true, message: "No posts available to notify." });
    }

    // Latest post is the first post or sorted by date
    const latestPost = posts[0];
    const { title, description, categories, image } = latestPost.frontmatter || {};
    const slug = latestPost.slug;

    const siteUrl = "https://engr-ahmed-aqeel-blog.vercel.app";
    const postUrl = `${siteUrl}/${blog_folder}/${slug}`;

    // Get SMTP Configuration
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");
    let smtpUser = process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";
    if (smtpUser.includes("engrahmedaqeel4@gmail.com")) {
      smtpUser = "engrahmedaqeel14@gmail.com";
    }
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "";
    let toEmail = process.env.CONTACT_TO_EMAIL || smtpUser || "engrahmedaqeel14@gmail.com";
    if (toEmail.includes("engrahmedaqeel4@gmail.com")) {
      toEmail = "engrahmedaqeel14@gmail.com";
    }

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
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a2e; max-width: 620px; border: 1px solid #e8e8f0; border-radius: 16px; margin: auto; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="background: rgba(108,99,255,0.12); color: #6C63FF; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
              🚀 New Project &amp; Blog Update Published
            </span>
          </div>

          <h2 style="color: #1a1a2e; text-align: center; margin-top: 10px; font-size: 22px; font-weight: 800; line-height: 1.3;">
            ${title}
          </h2>

          ${image ? `<div style="text-align: center; margin: 20px 0;"><a href="${postUrl}"><img src="${siteUrl}${image}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.12);" /></a></div>` : ""}

          <p style="font-size: 14px; line-height: 1.6; color: #4a4a6a; margin-top: 15px;">
            ${description || "A new project case study and technical breakdown is live on Engr. Ahmed Aqeel's portfolio website!"}
          </p>

          ${categoryTags ? `<p style="font-size: 12px; color: #6C63FF; font-weight: bold; margin-top: 10px;">🏷️ Topics: ${categoryTags}</p>` : ""}

          <div style="text-align: center; margin-top: 25px; margin-bottom: 20px;">
            <a href="${postUrl}" style="background: linear-gradient(135deg, #6C63FF, #8B5CF6); color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 10px; font-size: 13px; font-weight: 800; display: inline-block; box-shadow: 0 4px 16px rgba(108,99,255,0.35);">
              📖 Read Full Project &amp; Article &rarr;
            </a>
          </div>

          <div style="text-align: center; margin-bottom: 15px;">
            <a href="${siteUrl}" style="color: #6C63FF; text-decoration: underline; font-size: 12px; font-weight: 700;">
              🌐 Visit Official Portfolio Website (${siteUrl})
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e8e8f0; margin-top: 25px;" />

          <p style="font-size: 11px; color: #9898b3; text-align: center; margin-top: 15px; line-height: 1.5;">
            Sent by <strong>Engr. Ahmed Aqeel</strong> &bull; Full Stack AI Developer &amp; Software Engineer<br/>
            Visit website: <a href="${siteUrl}" style="color: #6C63FF; font-weight: bold;">engr-ahmed-aqeel-blog.vercel.app</a>
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
