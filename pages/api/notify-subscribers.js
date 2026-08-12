import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    const { blog_folder } = config.settings;
    let posts = [];
    try {
      posts = getSinglePage(`content/${blog_folder}`);
    } catch (fsErr) {
      console.warn("Serverless fs fallback:", fsErr.message);
      posts = [
        {
          slug: "blissful-blinds-uk",
          frontmatter: {
            title: "Blissful Blinds UK - Client Business E-Commerce Site",
            description: "Blissful Blinds UK is a full-featured commercial website engineered for a UK-based business client.",
            categories: ["client-work", "web-development"],
            image: "/images/post/blissful-blinds-uk.png",
          },
        },
      ];
    }

    if (!posts || posts.length === 0) {
      return res.status(200).json({ success: true, message: "No posts available to notify." });
    }

    const latestPost = posts[0];
    const { title, description, categories, image } = latestPost.frontmatter || {};
    const slug = latestPost.slug;

    const siteUrl = "https://engr-ahmed-aqeel-blog.vercel.app";
    const postUrl = `${siteUrl}/${blog_folder}/${slug}`;

    const smtpUser = process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";
    const defaultPass = "svgtgjzhnbqtqgdt";
    const smtpPass = (process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "") || defaultPass;
    let toEmail = req.query?.email || req.body?.email || process.env.CONTACT_TO_EMAIL || smtpUser || "engrahmedaqeel14@gmail.com";
    if (toEmail.includes("engrahmedaqeel4@gmail.com")) {
      toEmail = "engrahmedaqeel14@gmail.com";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser.includes("engrahmedaqeel4") ? "engrahmedaqeel14@gmail.com" : smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const categoryTags = (categories || []).join(", ");

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
  } catch (error) {
    console.error("Subscriber notification error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
