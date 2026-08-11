import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import InnerPagination from "@layouts/components/InnerPagination";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import { DiscussionEmbed } from "disqus-react";
import { MDXRemote } from "next-mdx-remote";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FaArrowLeft, FaRegCalendar, FaUserAlt, FaCodeBranch } from "react-icons/fa";
import Post from "./partials/Post";
import Sidebar from "./partials/Sidebar";
import shortcodes from "./shortcodes/all";

const { disqus } = config;
const { meta_author } = config.metadata;

const PostSingle = ({
  frontmatter,
  content,
  mdxContent,
  slug,
  posts,
  allCategories,
  relatedPosts,
}) => {
  let { description, title, date, image, categories } = frontmatter;
  description = description ? description : content.slice(0, 120);

  const { theme } = useTheme();
  const author = frontmatter.author ? frontmatter.author : meta_author;

  let disqusConfig = config.disqus.settings;
  disqusConfig.identifier = frontmatter.disqusId
    ? frontmatter.disqusId
    : config.settings.blog_folder + "/" + slug;

  return (
    <Base title={title} description={description} image={image}>
      <section className="section single-blog py-8">
        <div className="container">
          
          {/* Back button */}
          <Link
            href="/posts"
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:-translate-x-1"
            style={{ background: "rgba(108,99,255,0.1)" }}
          >
            <FaArrowLeft className="text-[10px]" />
            Back to All Projects
          </Link>

          <div className="row">
            {/* ── Article ── */}
            <div className="lg:col-8">
              <article className="card p-0 overflow-hidden shadow-xl">
                
                {/* Hero image */}
                {image && (
                  <div className="relative overflow-hidden group">
                    <ImageFallback
                      src={image}
                      height="500"
                      width="1000"
                      alt={title}
                      className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category badges */}
                    <ul className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                      {categories.map((tag, index) => (
                        <li key={"tag-" + index}>
                          <Link
                            className="category-tag text-[10px] px-2.5 py-1 uppercase tracking-wider font-bold"
                            href={`/categories/${tag.replace(" ", "-")}`}
                          >
                            {tag}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Pagination top */}
                  {config.settings.InnerPaginationOptions.enableTop && (
                    <div className="mb-6">
                      <InnerPagination posts={posts} date={date} />
                    </div>
                  )}

                  {/* Meta Label */}
                  <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <FaCodeBranch /> Project Showcase &amp; Technical Case Study
                  </div>

                  {/* Title */}
                  {markdownify(
                    title,
                    "h1",
                    "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-dark dark:text-darkmode-light mb-4 leading-tight"
                  )}

                  {/* Meta Info Bar */}
                  <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-light dark:text-darkmode-text">
                    <Link
                      className="inline-flex items-center hover:text-primary transition-colors"
                      href="/about"
                    >
                      <FaUserAlt className="mr-1.5 text-primary" />
                      {author}
                    </Link>
                    <span className="inline-flex items-center">
                      <FaRegCalendar className="mr-1.5 text-primary" />
                      {dateFormat(date)}
                    </span>
                  </div>

                  {/* Gradient Divider */}
                  <div className="mb-6 h-px w-full" style={{ background: "linear-gradient(90deg, rgba(108,99,255,0.4), transparent)" }} />

                  {/* Main MDX Content */}
                  <div className="content">
                    <MDXRemote {...mdxContent} components={shortcodes} />
                  </div>

                  {/* Pagination bottom */}
                  {config.settings.InnerPaginationOptions.enableBottom && (
                    <div className="mt-8">
                      <InnerPagination posts={posts} date={date} />
                    </div>
                  )}

                  {/* Disqus */}
                  {disqus.enable && (
                    <div className="mt-12">
                      <DiscussionEmbed
                        key={theme}
                        shortname={disqus.shortname}
                        config={disqusConfig}
                      />
                    </div>
                  )}
                </div>
              </article>
            </div>

            {/* ── Sidebar ── */}
            <Sidebar
              className="lg:col-4"
              posts={posts.filter((post) => post.slug !== slug)}
              categories={allCategories}
            />
          </div>

          {/* ── Related Projects ── */}
          {relatedPosts.length > 1 && (
            <div className="mt-16">
              <h2 className="section-title mb-6">Related Projects</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts
                  .filter((p) => p.slug !== slug)
                  .slice(0, 3)
                  .map((post, index) => (
                    <div key={"post-" + index} className="card p-0 overflow-hidden">
                      <Post post={post} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Base>
  );
};

export default PostSingle;
