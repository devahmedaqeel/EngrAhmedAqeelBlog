import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address." });
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465");
  let smtpUser = process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";
  if (smtpUser.includes("engrahmedaqeel4@gmail.com")) {
    smtpUser = "engrahmedaqeel14@gmail.com";
  }
  const defaultPass = "nykgqmaummkebmgd";
  const smtpPass = (process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "") || defaultPass;
  let toEmail = process.env.CONTACT_TO_EMAIL || smtpUser || "engrahmedaqeel14@gmail.com";
  if (toEmail.includes("engrahmedaqeel4@gmail.com")) {
    toEmail = "engrahmedaqeel14@gmail.com";
  }

  const createTransporter = (port, secure) => {
    return nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
    });
  };

  try {
    let transporter;
    try {
      transporter = createTransporter(465, true);
    } catch (e) {
      transporter = createTransporter(587, false);
    }

      // 1. Send Welcome Email to Subscriber
      await transporter.sendMail({
        from: `"Engr. Ahmed Aqeel" <${smtpUser}>`,
        to: email,
        subject: `Welcome to Engr. Ahmed Aqeel's Newsletter! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a2e; max-width: 600px; border: 1px solid #e8e8f0; border-radius: 16px; margin: auto; background: #ffffff;">
            <h2 style="color: #6C63FF; text-align: center; margin-top: 0;">Welcome to My Tech Newsletter! 🎉</h2>
            <p>Hi there,</p>
            <p>Thank you for subscribing! You will receive instant email notifications whenever I publish new <strong>Full Stack AI projects, software engineering updates, LLM research, and web apps</strong>.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://engr-ahmed-aqeel-blog.vercel.app/posts" style="background: linear-gradient(135deg, #6C63FF, #8B5CF6); color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-size: 13px; font-weight: 800; display: inline-block;">
                Explore All Projects &amp; Articles &rarr;
              </a>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
              <a href="https://engr-ahmed-aqeel-blog.vercel.app" style="color: #6C63FF; font-weight: 700; text-decoration: underline; font-size: 12px;">
                🌐 Visit Portfolio Website (engr-ahmed-aqeel-blog.vercel.app)
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e8e8f0; margin-top: 25px;" />
            <p style="font-size: 12px; color: #666; margin-top: 15px;">Best regards,<br/><strong>Engr. Ahmed Aqeel</strong><br/>Founder @ DevOrbit Tech</p>
          </div>
        `,
      });

      // 2. Notify Owner of new subscriber
      try {
        await transporter.sendMail({
          from: `"Portfolio Newsletter" <${smtpUser}>`,
          to: toEmail,
          subject: `New Newsletter Subscriber: ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a2e;">
              <h3>New Subscriber Joined!</h3>
              <p>Email: <strong>${email}</strong></p>
            </div>
          `,
        });
      } catch (err) {
        console.warn("Owner notification warning:", err.message);
      }

      return res.status(200).json({ success: true, message: "Subscription successful!" });
    } catch (error) {
      console.error("Nodemailer subscription error:", error);
      return res.status(500).json({ success: false, error: "Failed to subscribe. Please try again later." });
    }
  }

  // Fallback mode if SMTP keys not yet added to Vercel env
  console.log(`[New Subscriber Received] Email: ${email}`);
  return res.status(200).json({
    success: true,
    message: "Subscribed successfully! (Add SMTP_USER & SMTP_PASS to Vercel Environment Variables for live email delivery)",
  });
}
