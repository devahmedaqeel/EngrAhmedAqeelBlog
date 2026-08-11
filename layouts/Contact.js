import React, { useState } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import social from "@config/social.json";

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, phone, mail, location } = frontmatter;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSubmitting(false);
        setSubmitted(true);
      } else {
        setSubmitting(false);
        setErrorMsg(resData.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg("Failed to send message. Please check your internet connection and try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section py-10">
      <div className="container max-w-5xl">
        
        {/* ── Top Contact Cards ───────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          
          {/* Phone / WhatsApp */}
          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card relative overflow-hidden p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 group"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #6C63FF, #a78bfa)" }}
              />
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-base group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <FaPhone />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-light dark:text-darkmode-text mb-0.5">
                  Phone / WhatsApp
                </p>
                <p className="text-xs font-bold text-dark dark:text-darkmode-light leading-snug break-words">
                  {phone}
                </p>
              </div>
            </a>
          )}

          {/* Email */}
          {mail && (
            <a
              href={`mailto:${mail}`}
              className="card relative overflow-hidden p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 group"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #6C63FF, #a78bfa)" }}
              />
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-base group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <FaEnvelope />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-light dark:text-darkmode-text mb-0.5">
                  Direct Email
                </p>
                <p className="text-xs font-bold text-dark dark:text-darkmode-light leading-snug break-all">
                  {mail}
                </p>
              </div>
            </a>
          )}

          {/* Location */}
          {location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${location} in Google Maps`}
              className="card relative overflow-hidden p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 group"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #6C63FF, #a78bfa)" }}
              />
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-base group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <FaMapMarkerAlt />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-light dark:text-darkmode-text mb-0.5">
                  Location (Google Maps)
                </p>
                <p className="text-xs font-bold text-dark dark:text-darkmode-light leading-snug break-words">
                  {location}
                </p>
              </div>
            </a>
          )}
        </div>

        {/* ── Main Contact Grid ────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Hero Intro & Direct Action Channels (5 cols) */}
          <div className="lg:col-span-5 text-left">
            
            {/* Live Availability Badge */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Available for Projects &amp; Hiring
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-dark dark:text-darkmode-light leading-tight mb-3">
              Let&apos;s Build Something Exceptional Together
            </h1>

            <p className="text-xs leading-relaxed text-text dark:text-darkmode-text mb-6">
              Have an innovative AI project, web application, mobile product, or full-stack software architecture requirement? Send a message or reach out directly through WhatsApp / LinkedIn.
            </p>

            {/* Direct Contact Buttons */}
            <div className="space-y-2.5 mb-6">
              <a
                href={`https://wa.me/${phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40"
              >
                <span className="flex items-center gap-2">
                  <FaWhatsapp className="text-base" /> Chat on WhatsApp
                </span>
                <span className="text-[10px] opacity-75">{phone}</span>
              </a>

              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2">
                    <FaLinkedin className="text-base" /> Connect on LinkedIn
                  </span>
                  <span className="text-[10px] opacity-75">Engr. Ahmed Aqeel</span>
                </a>
              )}
            </div>

            {/* Guaranteed Response SLA */}
            <div className="flex items-center gap-2 rounded-xl border border-border dark:border-darkmode-border bg-theme-light dark:bg-darkmode-theme-dark px-3.5 py-2 text-[11px] text-light dark:text-darkmode-text">
              <FaClock className="text-primary flex-shrink-0" />
              <span>Typical response SLA: <strong>Within 1–2 hours</strong></span>
            </div>
          </div>

          {/* Right Column: Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8">
              
              <div className="flex items-center justify-between border-b border-border dark:border-darkmode-border pb-4 mb-5">
                <h2 className="text-base font-extrabold text-dark dark:text-darkmode-light flex items-center gap-2">
                  Send Me A Message
                </h2>
                <span className="text-[10px] font-semibold text-light dark:text-darkmode-text">
                  * Required fields
                </span>
              </div>

              {submitted ? (
                <div className="py-8 text-center animate-fade-in-up">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <FaCheckCircle className="text-2xl" />
                  </div>
                  <h4 className="text-base font-extrabold text-dark dark:text-darkmode-light mb-1">
                    Message Sent Successfully! 🎉
                  </h4>
                  <p className="text-xs text-text dark:text-darkmode-text mb-4 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Your message has been received, and Engr. Ahmed Aqeel will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-outline-primary btn-sm text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-dark dark:text-darkmode-light" htmlFor="name">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        className="w-full rounded-xl border border-border bg-theme-light px-3.5 py-2.5 text-xs text-dark placeholder:text-light focus:border-primary focus:outline-none dark:border-darkmode-border dark:bg-darkmode-theme-dark dark:text-darkmode-light dark:placeholder:text-darkmode-text transition-all"
                        name="name"
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-dark dark:text-darkmode-light" htmlFor="email">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        className="w-full rounded-xl border border-border bg-theme-light px-3.5 py-2.5 text-xs text-dark placeholder:text-light focus:border-primary focus:outline-none dark:border-darkmode-border dark:bg-darkmode-theme-dark dark:text-darkmode-light dark:placeholder:text-darkmode-text transition-all"
                        name="email"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. alex@company.com"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-dark dark:text-darkmode-light" htmlFor="subject">
                      Subject <span className="text-primary">*</span>
                    </label>
                    <input
                      className="w-full rounded-xl border border-border bg-theme-light px-3.5 py-2.5 text-xs text-dark placeholder:text-light focus:border-primary focus:outline-none dark:border-darkmode-border dark:bg-darkmode-theme-dark dark:text-darkmode-light dark:placeholder:text-darkmode-text transition-all"
                      name="subject"
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. AI Application / Full Stack Project Inquiry"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-dark dark:text-darkmode-light" htmlFor="message">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-border bg-theme-light px-3.5 py-2.5 text-xs text-dark placeholder:text-light focus:border-primary focus:outline-none dark:border-darkmode-border dark:bg-darkmode-theme-dark dark:text-darkmode-light dark:placeholder:text-darkmode-text transition-all resize-none"
                      name="message"
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Engr. Ahmed, I'd like to discuss a project..."
                      required
                      disabled={submitting}
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-xs font-semibold text-red-500 animate-fade-in-up">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-full py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin text-xs" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-xs" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
