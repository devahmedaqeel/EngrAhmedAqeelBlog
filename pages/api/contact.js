import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  const smtpUser = process.env.SMTP_USER || "engrahmedaqeel14@gmail.com";
  const defaultPass = "nykgqmaummkebmgd";
  const smtpPass = (process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "") || defaultPass;
  let toEmail = process.env.CONTACT_TO_EMAIL || smtpUser || "engrahmedaqeel14@gmail.com";
  if (toEmail.includes("engrahmedaqeel4@gmail.com")) {
    toEmail = "engrahmedaqeel14@gmail.com";
  }

  try {
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

    // 1. Send Email to Site Owner
    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Inquiry: ${subject || "Contact Form Submission"} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a2e; max-width: 600px;">
          <h2 style="color: #6C63FF; border-bottom: 2px solid #6C63FF; padding-bottom: 8px;">New Portfolio Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <div style="background: #f4f3ff; border-left: 4px solid #6C63FF; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #888; margin-top: 25px;">Sent from Engr. Ahmed Aqeel Portfolio &amp; Blog</p>
        </div>
      `,
    });

    // 2. Auto-reply to Sender
    try {
      await transporter.sendMail({
        from: `"Engr. Ahmed Aqeel" <${smtpUser}>`,
        to: email,
        subject: `Thank you for reaching out, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a2e; max-width: 600px;">
            <h2 style="color: #6C63FF;">Thank you for contacting me!</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your message has been received successfully. I will review your inquiry and get back to you within 1-2 hours.</p>
            <div style="background: #f8f9fa; border: 1px solid #e8e8f0; padding: 15px; margin: 15px 0; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px; color: #555;"><strong>Your Message:</strong></p>
              <p style="margin-top: 5px; font-size: 13px; color: #333;">"${message}"</p>
            </div>
            <p>Best regards,<br/><strong>Engr. Ahmed Aqeel</strong><br/>Full Stack AI Developer &amp; Software Engineer</p>
          </div>
        `,
      });
    } catch (autoReplyErr) {
      console.warn("Auto-reply email warning:", autoReplyErr.message);
    }

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return res.status(500).json({ success: false, error: `Email Error: ${error.message || "Failed to send"}` });
  }
}
