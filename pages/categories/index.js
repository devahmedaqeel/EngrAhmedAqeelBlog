import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getTaxonomy } from "@lib/taxonomyParser";
import { humanize, slugify } from "@lib/utils/textConverter";
import Link from "next/link";
import {
  FaFolder,
  FaBriefcase,
  FaCode,
  FaLaptopCode,
  FaBrain,
  FaArrowRight,
} from "react-icons/fa";
import { getSinglePage } from "@lib/contentParser";

const { blog_folder } = config.settings;

const getCategoryIcon = (name) => {
  const slug = name.toLowerCase();
  if (slug.includes("ai") || slug.includes("ml")) return <FaBrain />;
  if (slug.includes("web") || slug.includes("dev")) return <FaCode />;
  if (slug.includes("client") || slug.includes("work")) return <FaBriefcase />;
  if (slug.includes("studio")) return <FaLaptopCode />;
  return <FaFolder />;
};

const categoryGradients = [
  { bg: "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(167,139,250,0.06))", border: "rgba(108,99,255,0.3)", color: "#6C63FF" },
  { bg: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(96,165,250,0.06))", border: "rgba(59,130,246,0.3)", color: "#3B82F6" },
  { bg: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.06))", border: "rgba(16,185,129,0.3)", color: "#10B981" },
  { bg: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))", border: "rgba(245,158,11,0.3)", color: "#F59E0B" },
  { bg: "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(251,113,133,0.06))", border: "rgba(244,63,94,0.3)", color: "#F43F5E" },
];

const Categories = ({ categories }) => {
  return (
    <Base title="Project Categories">
      <section className="section py-12">
        <div className="container max-w-5xl">
          
          {/* Header Banner Centered Container */}
          <div className="relative mb-12 py-10 text-center rounded-3xl border border-border dark:border-darkmode-border bg-white/60 dark:bg-darkmode-theme-dark/60 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh" />
            <div
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[260px] w-[500px] rounded-full blur-[100px]"
              style={{ background: "rgba(108,99,255,0.15)" }}
            />

            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <FaFolder className="text-xs" />
              Explore Domains
            </span>

            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-dark dark:text-darkmode-light">
              Project <span className="logo-text-gradient">Categories</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-text dark:text-darkmode-text max-w-lg mx-auto leading-relaxed">
              Explore Engr. Ahmed Aqeel&apos;s production software applications, AI research models, and case studies by technology domain.
            </p>
          </div>

          {/* Category Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, i) => {
              const theme = categoryGradients[i % categoryGradients.length];
              const icon = getCategoryIcon(category.name);

              return (
                <Link
                  key={`category-${i}`}
                  href={`/categories/${category.name}`}
                  className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
                  style={{
                    background: theme.bg,
                    borderColor: theme.border,
                  }}
                >
                  {/* Top Ambient Glow */}
                  <div
                    className="pointer-events-none absolute top-0 left-0 right-0 h-1"
                    style={{ background: theme.color }}
                  />

                  <div>
                    {/* Icon Badge */}
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{ background: "rgba(255,255,255,0.9)", color: theme.color }}
                    >
                      {icon}
                    </div>

                    {/* Category Title */}
                    <h2 className="text-base font-black capitalize tracking-tight text-dark dark:text-darkmode-light mb-1">
                      {humanize(category.name)}
                    </h2>

                    {/* Post Count Pill */}
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-3">
                      {category.posts} {category.posts === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  {/* CTA Action */}
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-bold transition-all group-hover:translate-x-1"
                    style={{ color: theme.color }}
                  >
                    <span>View Projects</span>
                    <FaArrowRight className="text-[10px]" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
    </Base>
  );
};

export default Categories;

export const getStaticProps = () => {
  const posts = getSinglePage(`content/${blog_folder}`);
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
      categories: categoriesWithPostsCount,
    },
  };
};
