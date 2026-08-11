const config = require("./config/config.json");

let font_base = config.theme_font.font_family.primary.replace(/\+/g, " ");
let font_secondary =
  config.theme_font.font_family.secondary.replace(/\+/g, " ");

let font_base_type = config.theme_font.font_family.primary_type;
let font_secondary_type = config.theme_font.font_family.secondary_type;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: config.color_theme.default.text_color.default,
        light: config.color_theme.default.text_color.light,
        dark: config.color_theme.default.text_color.dark,
        primary: config.color_theme.default.theme_color.primary,
        secondary: config.color_theme.default.theme_color.secondary,
        body: config.color_theme.default.theme_color.body,
        border: config.color_theme.default.theme_color.border,
        "theme-light": config.color_theme.default.theme_color.theme_light,
        "theme-dark": config.color_theme.default.theme_color.theme_dark,
        darkmode: {
          text: config.color_theme.darkmode.text_color.default,
          light: config.color_theme.darkmode.text_color.light,
          dark: config.color_theme.darkmode.text_color.dark,
          primary: config.color_theme.darkmode.theme_color.primary,
          secondary: config.color_theme.darkmode.theme_color.secondary,
          body: config.color_theme.darkmode.theme_color.body,
          border: config.color_theme.darkmode.theme_color.border,
          "theme-light": config.color_theme.darkmode.theme_color.theme_light,
          "theme-dark": config.color_theme.darkmode.theme_color.theme_dark,
        },
      },
      fontSize: {
        base: config.theme_font.font_size.base + "px",
        h1: config.theme_font.font_size.h1 + "rem",
        "h1-sm": config.theme_font.font_size.h1_sm + "rem",
        h2: config.theme_font.font_size.h2 + "rem",
        "h2-sm": config.theme_font.font_size.h2_sm + "rem",
        h3: config.theme_font.font_size.h3 + "rem",
        "h3-sm": config.theme_font.font_size.h3_sm + "rem",
        h4: config.theme_font.font_size.h4 + "rem",
        h5: config.theme_font.font_size.h5 + "rem",
        h6: config.theme_font.font_size.h6 + "rem",
      },
      fontFamily: {
        primary: [font_base, font_base_type],
        secondary: [font_secondary, font_secondary_type],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-bootstrap-grid")({
      generateContainer: false,
      gridGutterWidth: "30px",
      gridGutters: {
        1: "4px",
        2: "8px",
        3: "16px",
        4: "24px",
        5: "32px",
      },
    }),
  ],
};
