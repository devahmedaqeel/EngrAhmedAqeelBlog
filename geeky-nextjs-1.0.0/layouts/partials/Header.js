import Logo from "@components/Logo";
import menu from "@config/menu.json";
import social from "@config/social.json";
import ThemeSwitcher from "@layouts/components/ThemeSwitcher";
import SearchModal from "@partials/SearchModal";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";

const Header = () => {
  const { main } = menu;
  const [searchModal, setSearchModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [showMenu]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`header ${scrolled ? "header--scrolled" : ""}`}
        style={{ transition: "all 0.3s ease" }}
      >
        <nav className="navbar container">

          {/* ── Logo ─────────────────────────────── */}
          <div className="order-0 flex-shrink-0">
            <Logo />
          </div>

          {/* ── Center nav (desktop) ─────────────── */}
          <ul className="navbar-nav hidden lg:flex lg:items-center lg:gap-0">
            {main.map((menuItem, i) => (
              <React.Fragment key={`menu-${i}`}>
                {menuItem.hasChildren ? (
                  <li className="nav-item nav-dropdown group relative">
                    <span
                      className={`nav-link cursor-pointer inline-flex items-center gap-1 ${
                        menuItem.children.map((c) => c.url).includes(router.asPath)
                          ? "active"
                          : ""
                      }`}
                    >
                      {menuItem.name}
                      <svg
                        className="h-3 w-3 fill-current transition-transform duration-200 group-hover:rotate-180"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </span>
                    <ul className="nav-dropdown-list hidden group-hover:block md:invisible md:absolute md:block md:opacity-0 md:group-hover:visible md:group-hover:opacity-100 md:transition-all md:duration-200">
                      {menuItem.children.map((child, j) => (
                        <li className="nav-dropdown-item" key={`children-${j}`}>
                          <Link
                            href={child.url}
                            className={`nav-dropdown-link block ${
                              router.asPath === child.url ? "active" : ""
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link
                      href={menuItem.url}
                      className={`nav-link block ${
                        router.asPath === menuItem.url ? "active" : ""
                      }`}
                    >
                      {menuItem.name}
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>

          {/* ── Right actions ─────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Social icons — desktop only */}
            <div className="hidden lg:flex items-center gap-1 mr-1">
              <div className="w-px h-4 mx-1.5" style={{ background: "rgba(0,0,0,0.1)" }} />
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="nav-icon-btn"
                >
                  <IoLogoLinkedin size={15} />
                </a>
              )}
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="nav-icon-btn"
                >
                  <IoLogoGithub size={15} />
                </a>
              )}
            </div>

            {/* Hire Me pill button */}
            <Link
              href="/contact"
              className="hire-btn hidden sm:inline-flex"
            >
              <span className="relative z-10">Hire Me</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block w-px h-4 mx-1" style={{ background: "rgba(0,0,0,0.1)" }} />

            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Search */}
            <button
              className="nav-icon-btn"
              onClick={() => setSearchModal(true)}
              aria-label="Search"
            >
              <IoSearch size={14} />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="hamburger-btn lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0V15z" />
              </svg>
            </button>
          </div>

          {/* ── Mobile menu panel ─────────────────── */}
          {showMenu && (
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMenu(false)}
            />
          )}
          <div className={`mobile-menu ${showMenu ? "open" : ""} lg:hidden`}>
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button
                className="nav-icon-btn"
                onClick={() => setShowMenu(false)}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <ul className="space-y-1 mb-6">
              {main.map((menuItem, i) => (
                <li key={i}>
                  <Link
                    href={menuItem.hasChildren ? menuItem.children[0]?.url || "#" : menuItem.url}
                    className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      router.asPath === menuItem.url
                        ? "bg-primary/10 text-primary"
                        : "text-dark dark:text-darkmode-light hover:bg-theme-light dark:hover:bg-darkmode-theme-dark hover:text-primary"
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    {menuItem.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-border dark:border-darkmode-border pt-4 flex gap-2">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="nav-icon-btn"><IoLogoLinkedin size={16} /></a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer"
                  className="nav-icon-btn"><IoLogoGithub size={16} /></a>
              )}
              <Link href="/contact" className="hire-btn ml-auto" onClick={() => setShowMenu(false)}>
                Hire Me
              </Link>
            </div>
          </div>
        </nav>

        <SearchModal searchModal={searchModal} setSearchModal={setSearchModal} />
      </header>
    </>
  );
};

export default Header;
