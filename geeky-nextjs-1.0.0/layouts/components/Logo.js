import ImageFallback from "@components/ImageFallback";
import config from "@config/config.json";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = ({ src }) => {
  const { logo, logo_white, logo_width, logo_height, logo_text, title } = config.site;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link href="/" className="navbar-brand inline-flex items-center gap-2.5 select-none group">
      {src ? (
        <ImageFallback
          width={logo_width.replace("px", "") * 2}
          height={logo_height.replace("px", "") * 2}
          src={mounted && (theme === "dark" || resolvedTheme === "dark") ? logo_white : logo}
          alt={title}
          priority
          style={{ height: logo_height.replace("px", "") + "px", width: logo_width.replace("px", "") + "px" }}
          className="m-auto"
        />
      ) : (
        <>
          {/* Executive Glowing Gradient Monogram Badge */}
          <span
            className="logo-mark"
            aria-hidden="true"
          >
            AA
          </span>

          {/* Executive Typography with Gradient Name Accent */}
          <div className="flex items-center gap-1.5">
            <span className="logo-text">
              Engr. <span className="logo-text-gradient">Ahmed Aqeel</span>
            </span>
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot shadow-sm"
              title="Verified Founder &amp; Engineer"
            />
          </div>
        </>
      )}
    </Link>
  );
};

export default Logo;
