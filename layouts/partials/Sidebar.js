import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import CustomForm from "@layouts/components/NewsLetterForm";
import Social from "@layouts/components/Social";
import Logo from "@layouts/components/Logo";
import dateFormat from "@lib/utils/dateFormat";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaRegCalendar, FaFolder } from "react-icons/fa";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import social from "@config/social.json";
const { blog_folder } = config.settings;
const { about, featured_posts, newsletter } = config.widgets;

const Sidebar = ({ posts, categories, className }) => {
  const sortPostByDate = sortByDate(posts);
  const featuredPosts = sortPostByDate.filter((p) => p.frontmatter.featured);
  const [showRecent, setShowRecent] = useState(true);

  return (
    <aside className={`${className} px-0 lg:pl-5 space-y-5`}>

      {/* ── About ──────────────────────────────── */}
      {about.enable && (
        <div className="card relative overflow-hidden text-center py-5 px-4">
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
            style={{ background: "linear-gradient(90deg,#6C63FF,#a78bfa)" }} />
          <div className="mb-2.5 flex justify-center">
            <Logo />
          </div>
          <p className="text-xs leading-relaxed text-text dark:text-darkmode-text mb-3" style={{ textAlign: "justify" }}>
            {about.content}
          </p>
          <Social className="socials justify-center" source={social} />
        </div>
      )}

      {/* ── Categories ─────────────────────────── */}
      {categories.length > 0 && (
        <div className="card py-4 px-4">
          <h4 className="section-title mb-3">Categories</h4>
          <ul className="space-y-0.5">
            {categories.map((cat, i) => (
              <li key={i}>
                <Link
                  href={`/categories/${cat.name}`}
                  className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold capitalize text-dark transition-all hover:text-primary dark:text-darkmode-light dark:hover:text-primary"
                  style={{ "&:hover": { background: "rgba(108,99,255,0.05)" } }}
                >
                  <span className="flex items-center gap-2">
                    <FaFolder className="text-[10px] text-primary opacity-60" />
                    {cat.name.replace(/-/g, " ")}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-primary transition-colors"
                    style={{ background: "rgba(108,99,255,0.08)" }}
                  >
                    {cat.posts}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Recent / Featured Posts ─────────────── */}
      {featured_posts.enable && (
        <div className="card py-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="section-title mb-0">Projects</h4>
            <div className="flex rounded-lg overflow-hidden border border-border dark:border-darkmode-border">
              <button
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={!showRecent
                  ? { background: "#6C63FF", color: "#fff" }
                  : { background: "transparent", color: "#9898b3" }}
                onClick={() => setShowRecent(false)}
              >
                Top
              </button>
              <button
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                style={showRecent
                  ? { background: "#6C63FF", color: "#fff" }
                  : { background: "transparent", color: "#9898b3" }}
                onClick={() => setShowRecent(true)}
              >
                New
              </button>
            </div>
          </div>

          <ul className="space-y-0">
            {(showRecent ? sortPostByDate : featuredPosts)
              .slice(0, featured_posts.showPost)
              .map((post, i) => (
                <li key={i} className={i !== 0 ? "border-t border-border dark:border-darkmode-border" : ""}>
                  <Link
                    href={`/${blog_folder}/${post.slug}`}
                    className="group flex items-start gap-2.5 py-2.5"
                  >
                    {post.frontmatter.image && (
                      <ImageFallback
                        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        width={48} height={48}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[11px] font-bold leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {post.frontmatter.title}
                      </h3>
                      <p className="inline-flex items-center text-[10px] text-light dark:text-darkmode-text font-medium gap-1">
                        <FaRegCalendar className="text-primary" />
                        {dateFormat(post.frontmatter.date)}
                      </p>
                    </div>
                    <FaArrowRight className="mt-1 flex-shrink-0 text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* ── Newsletter ──────────────────────────── */}
      {newsletter.enable && (
        <div className="card relative overflow-hidden py-6 px-5 text-center">
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
            style={{ background: "linear-gradient(90deg, #6C63FF, #a78bfa)" }}
          />
          <div
            className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl mx-auto shadow-sm"
            style={{ background: "rgba(108,99,255,0.1)", color: "#6C63FF" }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-dark dark:text-darkmode-light mb-1">
            {newsletter.title}
          </h4>
          <p className="mb-4 text-xs text-text dark:text-darkmode-text leading-relaxed max-w-xs mx-auto">
            {newsletter.content}
          </p>
          {newsletter.malichip_url ? (
            <MailchimpSubscribe
              url={newsletter.malichip_url}
              render={({ subscribe, status, message }) => (
                <CustomForm onValidated={(d) => subscribe(d)} status={status} message={message} />
              )}
            />
          ) : (
            <CustomForm />
          )}
          <p className="mt-3 text-[10px] text-light dark:text-darkmode-text flex items-center justify-center gap-1">
            <span>🔒 I respect your</span>
            <Link
              href={newsletter.privacy_policy_page}
              onClick={(e) => e.preventDefault()}
              className="font-bold text-primary hover:underline"
            >
              privacy
            </Link>.
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
