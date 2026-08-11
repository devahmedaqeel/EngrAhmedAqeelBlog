import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import dateFormat from "@lib/utils/dateFormat";
import Link from "next/link";
import { FaArrowRight, FaRegCalendar, FaTag } from "react-icons/fa";

const stripMarkdown = (str = "") =>
  str
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/[-_*]{3,}/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();

const Post = ({ post, featured = false }) => {
  const { summary_length, blog_folder } = config.settings;
  const { meta_author } = config.metadata;
  const author = post.frontmatter.author || meta_author;
  const excerpt = stripMarkdown(post.content).slice(0, Number(summary_length));

  return (
    <article className="group flex h-full flex-col">
      {/* Thumbnail */}
      {post.frontmatter.image && (
        <div className="relative overflow-hidden">
          <ImageFallback
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
              featured ? "h-[220px]" : "h-[180px]"
            }`}
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            width={featured ? 600 : 400}
            height={featured ? 220 : 180}
          />
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* Category tags */}
          <ul className="absolute bottom-2.5 left-3 flex flex-wrap gap-1.5">
            {post.frontmatter.categories.slice(0, 2).map((tag, i) => (
              <li key={i}>
                <Link className="category-tag" href={`/categories/${tag.replace(/ /g, "-")}`}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Date */}
        <p className="mb-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-light dark:text-darkmode-text">
          <FaRegCalendar className="text-primary" />
          {dateFormat(post.frontmatter.date)}
        </p>

        {/* Title */}
        <h3 className={`mb-2 font-extrabold leading-snug tracking-tight text-dark dark:text-darkmode-light ${featured ? "text-[15px]" : "text-sm"}`}>
          <Link
            href={`/${blog_folder}/${post.slug}`}
            className="line-clamp-2 hover:text-primary transition-colors"
          >
            {post.frontmatter.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-xs leading-relaxed text-text dark:text-darkmode-text line-clamp-3">
          {excerpt}{excerpt.length >= Number(summary_length) ? "…" : ""}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border dark:border-darkmode-border">
          <span className="text-[10px] font-semibold text-light dark:text-darkmode-text truncate max-w-[120px]">
            {author}
          </span>
          <Link
            href={`/${blog_folder}/${post.slug}`}
            className="group/btn inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-2 transition-all"
          >
            Read More
            <FaArrowRight className="text-[9px] transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Post;
