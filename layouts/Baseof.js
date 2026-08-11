import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Footer from "@partials/Footer";
import Header from "@partials/Header";
import Head from "next/head";
import { useRouter } from "next/router";

const Base = ({
  title,
  meta_title,
  description,
  image,
  noindex,
  canonical,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url, favicon } = config.site;
  const router = useRouter();

  const pageTitle = plainify(
    meta_title ? meta_title : title ? title : config.site.title
  );
  const pageDesc = plainify(description ? description : meta_description);
  const pageImage = `${base_url}${image ? image : meta_image}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />

        {/* Favicon */}
        {favicon && <link rel="icon" href={favicon} />}

        {/* Canonical */}
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

        {/* Robots */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* Primary Meta */}
        <meta name="description" content={pageDesc} />
        <meta name="author" content={meta_author} />
        <meta name="google-site-verification" content="google8bac3146ca63224c" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${base_url}/${router.asPath.replace("/", "")}`} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />

        {/* Performance: Preload hero image */}
        <link rel="preload" href="/images/author-light.png" as="image" />
        <link rel="preload" href="/images/author-dark.png" as="image" />

        {/* RSS Auto-Discovery */}
        <link rel="alternate" type="application/rss+xml" title={`${pageTitle} RSS Feed`} href="/rss.xml" />
        <link rel="alternate" type="application/json" title={`${pageTitle} JSON Feed`} href="/feed.json" />
      </Head>

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content" className="min-h-[60vh]">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Base;
