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
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "";
  let toEmail = process.env.CONTACT_TO_EMAIL || smtpUser || "engrahmedaqeel14@gmail.com";
  if (toEmail.includes("engrahmedaqeel4@gmail.com")) {
    toEmail = "engrahmedaqeel14@gmail.com";
  }

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
      });

      // 1. Send Welcome Email to Subscriber
      await transporter.sendMail({
        from: `"Engr. Ahmed Aqeel" <${smtpUser}>`,
        to: email,
        subject: `Welcome to Engr. Ahmed Aqeel's Newsletter! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a2e; max-width: 600px;">
            <h2 style="color: #6C63FF;">Welcome to my tech newsletter!</h2>
            <p>Hi there,</p>
            <p>Thank you for subscribing to my newsletter. You'll get exclusive updates on my latest <strong>Full Stack AI projects, software developments, LLM research, and tech tutorials</strong>.</p>
            <p>Stay tuned for new posts and insights!</p>
            <br/>
            <p>Best regards,<br/><strong>Engr. Ahmed Aqeel</strong><br/>Founder @ DevOrbit Tech</p>
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
