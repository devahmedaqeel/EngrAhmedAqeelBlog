# 🚀 Engr. Ahmed Aqeel — Engineering Portfolio & Technical Blog

[![Next.js](https://img.shields.io/badge/Next.js-13.1.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosted-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A production-grade, high-performance **Engineering Portfolio & Technical Blog** built for **Engr. Ahmed Aqeel** (Full Stack AI Developer, Software Architect, and Founder of DevOrbit Tech). Featuring modern dark/light mode aesthetics, interactive 3D mouse parallax tilt physics, symmetrical glowing beacon skill badges, automated RSS/JSON feed generators, and fast static site generation.

---

## 🌟 Key Features & Capabilities

- ⚡ **Fast Next.js 13 Engine**: Static Site Generation (SSG) for instant page loads and zero layout shift.
- 🎨 **Modern Design System**: Custom Tailwind CSS + SCSS styling, glassmorphism, radial dot-grid UI, and smooth dark/light mode theme toggling (`next-themes`).
- 🧠 **Interactive 3D Motion**: Dynamic 3D mouse-parallax tilt physics on portrait photography and symmetrical glowing beacon skill badges.
- 📰 **Automated RSS 2.0 & JSON Feeds**: Auto-generates `rss.xml`, `feed.xml`, and `feed.json` at build time for Mailchimp and RSS reader integrations.
- 📬 **Interactive Contact Hub**: Contact form with loading indicators, animated success confirmations, direct **WhatsApp Chat**, and **LinkedIn Connect** links.
- 📍 **Google Maps Location Integration**: Direct one-click Google Maps location search for **Kotli, Azad Jammu & Kashmir, Pakistan**.
- 📁 **Domain Taxonomy & Project Categories**: Domain filtering for AI/ML, Web Development, Client Work, and Engineering Case Studies.
- 🔍 **Instant Search Engine**: Client-side JSON search index for instant article and project lookup.

---

## 🛠️ Technical Stack

- **Framework**: Next.js 13, React 18
- **Styling & UI**: Tailwind CSS 3, Sass / SCSS, Next Themes
- **Markdown Processing**: MDX (`next-mdx-remote`), `gray-matter`, `marked`
- **Icons**: React Icons (FontAwesome, SimpleIcons, Ionicons)
- **Feeds & Search**: Custom Node.js RSS/JSON Generator (`lib/jsonGenerator.js`)
- **Hosting & Infrastructure**: Vercel (`vercel.json` asset caching & security headers)

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devahmedaqeel/EngrAhmedAqeelBlog.git
   cd EngrAhmedAqeelBlog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Scripts Overview

| Command | Action |
| :--- | :--- |
| `npm run dev` | Generates search index & RSS feeds, then starts dev server on `http://localhost:3000` |
| `npm run build` | Generates search index, RSS feeds, and builds Next.js production bundle |
| `npm run start` | Runs Next.js production server locally |
| `npm run lint` | Runs Next.js ESLint diagnostics |

---

## 🌐 Deploying to Vercel

This repository includes a pre-configured `vercel.json` for seamless Vercel deployment:

1. Push your changes to GitHub:
   ```bash
   git push -u origin main --force
   ```
2. Go to **[vercel.com](https://vercel.com)**, import the `EngrAhmedAqeelBlog` repository.
3. Click **Deploy** — Vercel will automatically build and host your portfolio blog site with static asset caching and RSS feeds!

---

## 👤 Author & Contact

**Engr. Ahmed Aqeel**
*Full Stack AI Developer & Software Engineer | Founder of DevOrbit Tech*

- 🌐 **Portfolio**: [https://ahmedaqeelportfolio.vercel.app](https://ahmedaqeelportfolio.vercel.app)
- 💼 **LinkedIn**: [https://linkedin.com/in/ahmed-aqeel-2a0090271](https://linkedin.com/in/ahmed-aqeel-2a0090271)
- 🐙 **GitHub**: [https://github.com/devahmedaqeel](https://github.com/devahmedaqeel)
- 💬 **WhatsApp**: [+92 316 189 3004](https://wa.me/923161893004)
- 📍 **Location**: [Kotli, Azad Jammu & Kashmir, Pakistan](https://www.google.com/maps/search/?api=1&query=Kotli,+Azad+Jammu+%26+Kashmir,+Pakistan)

---

© 2026 Engr. Ahmed Aqeel. All rights reserved.
