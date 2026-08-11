import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/partials/Post";
import Sidebar from "@layouts/partials/Sidebar";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import dateFormat from "@lib/utils/dateFormat";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBrain,
  FaDatabase,
  FaNodeJs,
  FaReact,
  FaRegCalendar,
  FaPython,
  FaDocker,
  FaMobileAlt,
} from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

const { blog_folder, pagination } = config.settings;

// Typing animation hook
const useTypingEffect = (words, speed = 90, pause = 2200) => {
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

const Home = ({ banner, posts, featured_posts, recent_posts, categories, promotion }) => {
  const sortPostByDate = sortByDate(posts);
  const featuredPosts = sortPostByDate.filter((p) => p.frontmatter.featured);
  const showPosts = pagination;

  const roles = [
    "Full Stack AI Developer",
    "Software Engineer & Architect",
    "Founder @ DevOrbit Tech",
    "LLM & Web Systems Lead",
  ];
  const typedRole = useTypingEffect(roles, 85, 2200);

  // 8 Skill Badges close to photo with even vertical spacing (top to bottom)
  const skills = [
    // Left Column Badges (4 skills - Evenly Spaced Vertically)
    {
      icon: <FaReact className="text-[11px]" />,
      label: "React & Next.js",
      color: "#61DAFB",
      bg: "rgba(97,218,251,0.15)",
      pos: "top-4 -left-2 sm:-left-4 lg:-left-6",
      anim: "animate-float",
      delay: "0s",
    },
    {
      icon: <FaNodeJs className="text-[11px]" />,
      label: "Node.js",
      color: "#339933",
      bg: "rgba(51,153,51,0.15)",
      pos: "top-[26%] -left-3 sm:-left-6 lg:-left-8",
      anim: "animate-float-reverse",
      delay: "0.4s",
    },
    {
      icon: <FaDatabase className="text-[11px]" />,
      label: "MongoDB",
      color: "#47A248",
      bg: "rgba(71,162,72,0.15)",
      pos: "top-[48%] -left-3 sm:-left-6 lg:-left-8",
      anim: "animate-float",
      delay: "0.8s",
    },
    {
      icon: <SiTailwindcss className="text-[11px]" />,
      label: "Tailwind CSS",
      color: "#06B6D4",
      bg: "rgba(6,182,212,0.15)",
      pos: "top-[70%] -left-2 sm:-left-4 lg:-left-6",
      anim: "animate-float-reverse",
      delay: "1.2s",
    },

    // Right Column Badges (4 skills - Evenly Spaced Vertically)
    {
      icon: <FaBrain className="text-[11px]" />,
      label: "AI / Gemini",
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.15)",
      pos: "top-4 -right-2 sm:-right-4 lg:-right-6",
      anim: "animate-float-reverse",
      delay: "0.2s",
    },
    {
      icon: <FaPython className="text-[11px]" />,
      label: "Python",
      color: "#3776AB",
      bg: "rgba(55,118,171,0.15)",
      pos: "top-[26%] -right-3 sm:-right-6 lg:-right-8",
      anim: "animate-float",
      delay: "0.6s",
    },
    {
      icon: <FaDocker className="text-[11px]" />,
      label: "Docker",
      color: "#2496ED",
      bg: "rgba(36,150,237,0.15)",
      pos: "top-[48%] -right-3 sm:-right-6 lg:-right-8",
      anim: "animate-float-reverse",
      delay: "1.0s",
    },
    {
      icon: <FaMobileAlt className="text-[11px]" />,
      label: "React Native",
      color: "#F43F5E",
      bg: "rgba(244,63,94,0.15)",
      pos: "top-[70%] -right-2 sm:-right-4 lg:-right-6",
      anim: "animate-float",
      delay: "1.4s",
    },
  ];

  return (
    <Base>
      {/* ════════════════════════════ HERO ════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "92vh", display: "flex", alignItems: "center" }}>
        <div className="gradient-mesh pointer-events-none absolute inset-0 -z-10" />

        {/* Orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(108,99,255,0.08)" }} />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-[400px] w-[400px] rounded-full blur-[100px]"
          style={{ background: "rgba(167,139,250,0.07)" }} />

        <div className="container w-full py-16">
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-14">

            {/* ── Text Column ────────────────────────── */}
            <div className="w-full text-center lg:w-[52%] lg:text-left">

              {/* Live Status Pill Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 animate-fade-in-up">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                Available for Contract &amp; Hiring
              </div>

              {/* Title */}
              <div className="banner-title animate-fade-in-up delay-100">
                {markdownify(banner.title, "h1")}
              </div>

              {/* Dynamic Role Rotator Badge (Zero Cut-Off) */}
              <div className="mt-2 mb-4 h-8 flex items-center justify-center lg:justify-start animate-fade-in-up delay-200">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs sm:text-sm font-black uppercase tracking-wider text-primary">
                  <span className="typing-cursor">{typedRole}</span>
                </span>
              </div>

              {/* Narrative Content */}
              <p className="text-sm leading-relaxed text-text dark:text-darkmode-text max-w-lg mx-auto lg:mx-0 mb-6 text-left animate-fade-in-up delay-300">
                {banner.content}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start animate-fade-in-up delay-400">
                {banner.button.enable && (
                  <Link className="btn btn-primary group text-xs sm:text-sm py-2.5 px-5" href={banner.button.link} rel={banner.button.rel}>
                    {banner.button.label}
                    <FaArrowRight className="text-[11px] transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
                <Link className="btn btn-outline-primary text-xs sm:text-sm py-2.5 px-5" href="/contact">
                  Hire Me
                </Link>
              </div>

              {/* Metrics Stats */}
              <div className="mt-8 flex justify-center gap-8 lg:justify-start animate-fade-in-up delay-500 border-t border-border dark:border-darkmode-border pt-6">
                {[
                  { num: "10+",  label: "Projects Shipped" },
                  { num: "3+",   label: "Years Exp" },
                  { num: "100%", label: "Dedicated & Open" },
                ].map((s, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-black tracking-tight"
                      style={{ background: "linear-gradient(135deg,#6C63FF,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {s.num}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-light dark:text-darkmode-text mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Photo + Symmetrical Skill Badges ─────────────────────── */}
            {banner.image_enable && (
              <div className="relative w-full lg:w-[48%] flex justify-center items-end" style={{ minHeight: "440px" }}>

                {/* Symmetrical 8 Skill Badges with High Contrast & ON/OFF Blinking Beacon Dots */}
                {skills.map((sk, i) => (
                  <div
                    key={i}
                    className={`absolute ${sk.pos} ${sk.anim} z-10 flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-primary/40 bg-white/95 dark:bg-[#16152a]/95 px-3 py-1.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary/60`}
                    style={{
                      animationDelay: sk.delay,
                      boxShadow: `0 0 16px ${sk.color}35, 0 6px 16px rgba(0,0,0,0.18)`,
                    }}
                  >
                    {/* Glowing High-Contrast Icon Badge */}
                    <div
                      className="flex h-5.5 w-5.5 items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        background: sk.bg,
                        color: sk.color,
                        boxShadow: `0 0 10px ${sk.color}80`,
                      }}
                    >
                      {sk.icon}
                    </div>

                    {/* Blinking ON/OFF Beacon Light Indicator */}
                    <span
                      className="animate-beacon-blink h-2 w-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: sk.color,
                        color: sk.color,
                      }}
                    />

                    {/* High-Contrast Skill Label */}
                    <span className="text-[10.5px] font-black text-slate-900 dark:text-white whitespace-nowrap tracking-wide">
                      {sk.label}
                    </span>
                  </div>
                ))}

                {/* Photos */}
                <ImageFallback
                  className="dark:hidden relative z-[1] max-h-[470px] w-auto object-contain drop-shadow-2xl"
                  src="/images/author-light.png"
                  width={420} height={470} priority alt="Engr. Ahmed Aqeel"
                />
                <ImageFallback
                  className="hidden dark:block relative z-[1] max-h-[470px] w-auto object-contain drop-shadow-2xl"
                  src="/images/author-dark.png"
                  width={420} height={470} priority alt="Engr. Ahmed Aqeel"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════ MAIN CONTENT ════════════════════════ */}
      <section className="section border-t border-border dark:border-darkmode-border">
        <div className="container">
          <div className="row items-start">

            {/* Posts column */}
            <div className="mb-10 lg:mb-0 lg:col-8">

              {/* Featured posts */}
              {featured_posts.enable && featuredPosts.length > 0 && (
                <div className="mb-10">
                  <h2 className="section-title mb-5">Featured Projects</h2>
                  <div className="card p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border dark:divide-darkmode-border">
                      {/* Main featured */}
                      <div className="lg:w-[55%]">
                        <Post post={featuredPosts[0]} featured />
                      </div>
                      {/* Side list */}
                      <div className="lg:w-[45%] divide-y divide-border dark:divide-darkmode-border overflow-y-auto" style={{ maxHeight: "360px" }}>
                        {featuredPosts.slice(1).map((post, i) => (
                          <Link
                            key={i}
                            href={`/${blog_folder}/${post.slug}`}
                            className="flex items-start gap-3 p-3.5 hover:bg-theme-light dark:hover:bg-darkmode-theme-dark transition-colors group"
                          >
                            {post.frontmatter.image && (
                              <ImageFallback
                                className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                                src={post.frontmatter.image}
                                alt={post.frontmatter.title}
                                width={56} height={56}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-light dark:text-darkmode-text mb-1 flex items-center gap-1">
                                <FaRegCalendar className="text-primary" />
                                {dateFormat(post.frontmatter.date)}
                              </p>
                              <h3 className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {post.frontmatter.title}
                              </h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Promotion */}
              {promotion.enable && (
                <Link href={promotion.link} className="block mb-10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <ImageFallback className="w-full" height="115" width="800" src={promotion.image} alt="promotion" />
                </Link>
              )}

              {/* All Projects */}
              {recent_posts.enable && (
                <div>
                  <h2 className="section-title mb-5">All Projects</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {sortPostByDate.slice(0, showPosts).map((post, i) => (
                      <div className="card p-0 overflow-hidden animate-fade-in-up" key={post.slug}
                        style={{ animationDelay: `${i * 0.08}s` }}>
                        <Post post={post} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Pagination totalPages={Math.ceil(posts.length / showPosts)} currentPage={1} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar className="lg:col-4" posts={posts} categories={categories} />
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

export const getStaticProps = async () => {
  const homepage = await getListPage("content/_index.md");
  const { frontmatter } = homepage;
  const { banner, featured_posts, recent_posts, promotion } = frontmatter;
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.includes(category)
    );
    return { name: category, posts: filteredPosts.length };
  });

  return {
    props: {
      banner,
      posts,
      featured_posts,
      recent_posts,
      promotion,
      categories: categoriesWithPostsCount,
    },
  };
};
