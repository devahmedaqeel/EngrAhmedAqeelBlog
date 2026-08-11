import React, { useState, useEffect } from "react";
import { FaEnvelope, FaCheckCircle, FaSpinner } from "react-icons/fa";

function CustomForm({ status, message, onValidated }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const existing = localStorage.getItem("subscribed_email");
      if (existing) {
        setSubmitted(true);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (status === "sending") {
      setSubmitting(true);
    } else if (status === "success") {
      setSubmitting(false);
      setSubmitted(true);
    } else if (status === "error") {
      setSubmitting(false);
      setErrorMsg(message || "An error occurred. Please try again.");
    }
  }, [status, message]);

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        try {
          localStorage.setItem("subscribed_email", email.trim());
        } catch (err) {
          // ignore
        }
        setSubmitting(false);
        setSubmitted(true);
      } else {
        setSubmitting(false);
        setErrorMsg(resData.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg("Failed to subscribe. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail("");
    setErrorMsg("");
  };

  if (submitted) {
    return (
      <div className="py-4 text-center animate-fade-in-up">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <FaCheckCircle className="text-lg" />
        </div>
        <h5 className="text-xs font-extrabold text-dark dark:text-darkmode-light mb-1">
          You&apos;re Subscribed! 🎉
        </h5>
        <p className="text-[11px] text-text dark:text-darkmode-text mb-2.5 leading-relaxed">
          Thank you for joining. You&apos;ll receive updates on new AI projects &amp; articles.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] font-bold text-primary hover:underline"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              className="w-full rounded-xl border border-border bg-theme-light px-3.5 py-2.5 pr-9 text-xs text-dark placeholder:text-light focus:border-primary focus:outline-none dark:border-darkmode-border dark:bg-darkmode-theme-dark dark:text-darkmode-light dark:placeholder:text-darkmode-text transition-all"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Enter your email address..."
              aria-label="Email address"
              disabled={submitting}
            />
            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary opacity-60 pointer-events-none" />
          </div>

          <button
            className="btn btn-primary sm:w-auto px-5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Subscribing...</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-1.5 text-center text-[11px] font-semibold text-red-500 animate-fade-in-up">
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
}

export default CustomForm;
