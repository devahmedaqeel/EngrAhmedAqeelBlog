import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Sidebar from "@layouts/partials/Sidebar";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { humanize, slugify } from "@lib/utils/textConverter";
import Post from "@partials/Post";
import { FaFolderOpen, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const { blog_folder } = config.settings;

// Single Category Page
const Category = ({ postsByCategories, category, posts, categories }) => {
  return (
    <Base title={humanize(category)}>
      <section className="section py-10">
        <div className="container max-w-5xl">
          
          {/* Back button */}
          <Link
            href="/categories"
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:-translate-x-1"
            style={{ background: "rgba(108,99,255,0.1)" }}
          >
            <FaArrowLeft className="text-[10px]" />
            All Categories
          </Link>

          {/* Header Banner */}
          <div className="relative mb-10 p-6 sm:p-8 rounded-3xl border border-border dark:border-darkmode-border bg-white/60 dark:bg-darkmode-theme-dark/60 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh" />
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-lg">
                <FaFolderOpen />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Category Archive
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-dark dark:text-darkmode-light capitalize">
              {humanize(category)}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-text dark:text-darkmode-text">
              Showing {postsByCategories.length} {postsByCategories.length === 1 ? "project" : "projects"} filed under <strong>{humanize(category)}</strong>.
            </p>
          </div>

          <div className="row items-start">
            {/* Posts Grid */}
            <div className="lg:col-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {postsByCategories.map((post, i) => (
                  <div key={`key-${i}`} className="card p-0 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <Post post={post} />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar className="lg:col-4" posts={posts} categories={categories} />
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Category;

export const getStaticPaths = () => {
  const allCategories = getTaxonomy(`content/${blog_folder}`, "categories");
  const paths = allCategories.map((category) => ({
    params: {
      category: category,
    },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const filterPosts = posts.filter((post) =>
    post.frontmatter.categories.find((category) =>
      slugify(category).includes(params.category)
    )
  );
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.map((e) => slugify(e)).includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });

  return {
    props: {
      posts,
      postsByCategories: filterPosts,
      category: params.category,
      categories: categoriesWithPostsCount,
    },
  };
};
