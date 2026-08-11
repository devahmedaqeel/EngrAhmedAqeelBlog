import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "styles/style.scss";

const App = ({ Component, pageProps }) => {
  const { default_theme } = config.settings;
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;

  // ── Font loading via link (no fetch/rerender flash) ──────────────
  const fontUrl = `https://fonts.googleapis.com/css2?family=${pf}${
    sf ? "&family=" + sf : ""
  }&display=swap`;

  // ── Page transition progress bar ─────────────────────────────────
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    const start = () => {
      setLoading(true);
      setProgress(20);
      timer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + Math.random() * 12 : p));
      }, 200);
    };
    const done = () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      clearInterval(timer);
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router]);

  // ── Scroll restoration ───────────────────────────────────────────
  useEffect(() => {
    const handleComplete = () => window.scrollTo({ top: 0, behavior: "instant" });
    router.events.on("routeChangeComplete", handleComplete);
    return () => router.events.off("routeChangeComplete", handleComplete);
  }, [router]);

  return (
    <JsonContext>
      <Head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load fonts via stylesheet — avoids FOUT */}
        <link rel="stylesheet" href={fontUrl} />
        {/* Responsive viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {/* DNS prefetch for common resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </Head>

      {/* Route-change progress bar */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            height: "3px",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6C63FF, #a78bfa)",
            transition: "width 0.2s ease",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}

      <ThemeProvider attribute="class" defaultTheme={default_theme} enableSystem>
        {/* Page fade-in transition */}
        <div
          key={router.asPath}
          style={{
            animation: "pageEnter 0.35s ease both",
          }}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>

      <style>{`
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Smooth scrolling site-wide */
        html {
          scroll-behavior: smooth;
        }
        /* Remove tap highlight on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        /* GPU-accelerated transitions */
        .card, .btn, .nav-link, img {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </JsonContext>
  );
};

export default App;
