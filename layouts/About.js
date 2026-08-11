import React, { useState, useEffect } from "react";
import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import ImageFallback from "./components/ImageFallback";
import Link from "next/link";
import {
  FaBriefcase,
  FaGraduationCap,
  FaCheckCircle,
  FaArrowRight,
  FaGithub,
  FaBrain,
  FaMobileAlt,
} from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiMongodb,
  SiDocker,
  SiTypescript,
  SiTailwindcss,
  SiFastapi,
} from "react-icons/si";

// Typing effect hook for dynamic professional roles
const useTypingEffect = (words, speed = 85, pause = 2200) => {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timer;
    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
};

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, education, experience } = frontmatter;

  const roles = [
    "Full Stack AI Developer",
    "Software Engineer & Architect",
    "Founder of DevOrbit Tech",
    "LLM & OCR Solution Specialist",
  ];
  const typedRole = useTypingEffect(roles, 85, 2000);

  // 10 Official Tech Stack Pills with Authentic Brand Colors
  const techStack = [
    { name: "React.js", icon: <SiReact />, color: "#61DAFB" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "#6C63FF" },
    { name: "AI / Gemini LLM", icon: <FaBrain />, color: "#8B5CF6" },
    { name: "Python / FastAPI", icon: <SiPython />, color: "#3776AB" },
    { name: "Node.js & Express", icon: <SiNodedotjs />, color: "#339933" },
    { name: "MongoDB & Supabase", icon: <SiMongodb />, color: "#47A248" },
    { name: "Docker & DevOps", icon: <SiDocker />, color: "#2496ED" },
    { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "#06B6D4" },
    { name: "React Native Mobile", icon: <FaMobileAlt />, color: "#F43F5E" },
  ];

  return (
    <section className="section py-8">
      <div className="container max-w-5xl">
        
        {/* ── Executive Hero Card ──────────────────────── */}
        <div className="card relative p-6 sm:p-8 mb-8 animate-fade-in-up">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Column Bio */}
            <div className="flex-1 text-center lg:text-left">
              
              {/* Animated Live Status Pill Badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in-left">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                Available for Projects &amp; Hiring
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-dark dark:text-darkmode-light mb-1.5 animate-fade-in-up delay-100">
                Engr. Ahmed Aqeel
              </h1>

              {/* Dynamic Animated Typing Role */}
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary mb-4 h-5 flex items-center justify-center lg:justify-start">
                <span className="typing-cursor">{typedRole}</span>
              </p>

              {/* Narrative Bio */}
              <p className="text-xs leading-relaxed text-text dark:text-darkmode-text mb-5 text-left max-w-xl animate-fade-in-up delay-200">
                Full Stack AI Developer and Software Engineer who designs and ships production-grade digital products — from responsive web and mobile frontends to scalable backend microservices, OCR pipelines, and LLM-powered applications. Founder of <strong className="text-dark dark:text-darkmode-light">DevOrbit Tech</strong>.
              </p>

              {/* Tech Stack Pills Bar */}
              <div className="mb-6 animate-fade-in-up delay-300">
                <p className="text-[10px] font-bold uppercase tracking-wider text-light dark:text-darkmode-text mb-2 text-left">
                  Core Technical Ecosystem:
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                  {techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-pill">
                      <span style={{ color: tech.color }}>{tech.icon}</span>
                      <span>{tech.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 animate-fade-in-up delay-400">
                <Link href="/contact" className="btn btn-primary btn-sm text-xs py-2 px-4 gap-2">
                  Get In Touch <FaArrowRight className="text-[10px]" />
                </Link>
                <a
                  href="https://github.com/devahmedaqeel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm text-xs py-2 px-4 gap-2"
                >
                  <FaGithub /> GitHub Profile
                </a>
              </div>
            </div>

            {/* Right Column Standing Portrait (Clean & Frameless) */}
            <div className="relative flex-shrink-0 flex justify-center items-center py-2">
              <div className="relative p-2">
                <ImageFallback
                  src="/images/author-light.png"
                  width={240}
                  height={280}
                  alt={title}
                  priority
                  className="dark:hidden h-[260px] sm:h-[300px] w-auto object-contain drop-shadow-2xl"
                />
                <ImageFallback
                  src="/images/author-dark.png"
                  width={240}
                  height={280}
                  alt={title}
                  priority
                  className="hidden dark:block h-[260px] sm:h-[300px] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Education & Experience Grid ──────────────── */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          
          {/* Formal Education */}
          <div className="card p-6 animate-fade-in-up delay-200">
            <div className="flex items-center gap-3 mb-5 border-b border-border dark:border-darkmode-border pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaGraduationCap className="text-base" />
              </div>
              <h2 className="text-base font-extrabold text-dark dark:text-darkmode-light">
                Formal Education
              </h2>
            </div>

            {education.degrees.map((degree, index) => (
              <div key={"degree-" + index} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-dark dark:text-darkmode-light">
                      {degree.university}
                    </h3>
                    <p className="text-[11px] font-semibold text-primary mt-0.5">
                      {degree.degree}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                    {degree.period}
                  </span>
                </div>

                {degree.coursework && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-light dark:text-darkmode-text mb-2">
                      Key Coursework:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {degree.coursework.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="rounded-md border border-border dark:border-darkmode-border bg-theme-light dark:bg-darkmode-theme-dark px-2.5 py-1 text-[10px] font-medium text-dark dark:text-darkmode-light transition-colors hover:border-primary/40"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Work Experience & Highlights */}
          <div className="card p-6 animate-fade-in-up delay-300">
            <div className="flex items-center gap-3 mb-5 border-b border-border dark:border-darkmode-border pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBriefcase className="text-base" />
              </div>
              <h2 className="text-base font-extrabold text-dark dark:text-darkmode-light">
                Experience &amp; Highlights
              </h2>
            </div>

            <ul className="space-y-3">
              {experience?.list?.map((item, index) => (
                <li
                  key={"experience-" + index}
                  className="flex items-start gap-2.5 text-xs text-text dark:text-darkmode-text leading-relaxed"
                >
                  <FaCheckCircle className="mt-0.5 flex-shrink-0 text-primary text-xs" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Main Bio Content ────────────────────────── */}
        <div className="card p-6 sm:p-8 animate-fade-in-up delay-400">
          <div className="content text-left max-w-none text-xs">
            <MDXRemote {...mdxContent} components={shortcodes} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
