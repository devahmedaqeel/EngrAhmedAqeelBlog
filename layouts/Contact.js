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
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <FaClock className="text-emerald-500 flex-shrink-0" />
              <span>Priority Response SLA: <strong>Within Minutes (Instant)</strong></span>
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
                <div className="py-8 px-2 text-center animate-fade-in-up">
                  {/* Glowing 3D Check Badge */}
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-transform hover:scale-105">
                    <span className="absolute -inset-1 rounded-2xl bg-emerald-500/30 blur-md animate-pulse" />
                    <FaCheckCircle className="relative z-10 text-4xl text-white" />
                  </div>

                  {/* Status Pill */}
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Delivered to engrahmedaqeel14@gmail.com
                  </div>

                  {/* Main Title */}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                    Message Sent Successfully! 🎉
                  </h3>

                  {/* Summary Card */}
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 dark:border-primary/25 bg-gradient-to-b from-white/90 to-slate-50/90 dark:from-[#1a1936]/90 dark:to-[#14132a]/90 p-5 mb-7 shadow-xl backdrop-blur-xl text-left space-y-3">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-bold flex-shrink-0">⚡</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Response Time:</span> Within <strong>Minutes (Instant Priority)</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-white/5 pt-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-bold flex-shrink-0">📧</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Auto-Reply Sent:</span> Check your inbox for confirmation
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-white/5 pt-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 font-bold flex-shrink-0">📍</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Location:</span> Kotli, Azad Jammu &amp; Kashmir, Pakistan
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-primary text-xs sm:text-sm py-3 px-7 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105 font-bold"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/posts"
                      className="btn btn-outline-primary text-xs sm:text-sm py-3 px-7 rounded-xl transition-all hover:scale-105 font-bold"
                    >
                      Browse Projects &rarr;
                    </Link>
                  </div>
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
