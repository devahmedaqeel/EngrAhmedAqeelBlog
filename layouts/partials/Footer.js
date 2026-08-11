import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import Logo from "@layouts/components/Logo";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";

const Footer = () => {
  const { copyright, footer_content } = config.params;

  return (
    <footer className="relative mt-auto border-t border-border dark:border-darkmode-border pt-10 pb-6">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)" }} />

      <div className="container">
        <div className="grid gap-8 sm:grid-cols-3 pb-8 border-b border-border dark:border-darkmode-border">

          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-3 text-xs leading-relaxed text-text dark:text-darkmode-text max-w-[230px]" style={{ textAlign: "justify" }}>
              {footer_content}
            </p>
            <Social source={social} className="socials mt-4" />
          </div>

          {/* Navigation */}
          <div>
            <h5 className="mb-3 text-[10px] font-black uppercase tracking-[0.15em] text-dark dark:text-darkmode-light">
              Navigation
            </h5>
            <ul className="space-y-2">
              {menu.footer.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className="group inline-flex items-center gap-2 text-xs font-semibold text-text hover:text-primary dark:text-darkmode-text dark:hover:text-primary transition-colors"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h5 className="mb-3 text-[10px] font-black uppercase tracking-[0.15em] text-dark dark:text-darkmode-light">
              Work Together
            </h5>
            <p className="text-xs leading-relaxed text-text dark:text-darkmode-text mb-4" style={{ textAlign: "justify" }}>
              Have a project in mind? Let&apos;s build something great together.
            </p>
            <Link href="/contact" className="btn btn-primary btn-sm text-xs">
              Get In Touch
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-light dark:text-darkmode-text order-2 sm:order-1">
            {copyright}
          </p>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
