import {
  HeadContent,
  Outlet,
  Scripts,
  ScriptOnce,
  createRootRoute,
} from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { type ReactNode } from "react";
// Same files the @font-face rules in styles.css load, so the preload and the CSS share one
// hashed URL and one download
import jakarta400 from "@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2?url";
import jakarta600 from "@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2?url";

import { AppDevtools } from "../components/AppDevtools";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { NotFound } from "../components/NotFound";
import { ThemeProvider } from "../components/ThemeProvider";

import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Riyaldi - Software Engineer" },
      {
        name: "description",
        content:
          "Riyaldi Hasan Setiawan — Software Engineer and Computer Science undergraduate. Personal portfolio of Riyaldi, Riyaldi Hasan, based in Sukoharjo, Indonesia. Explore projects, blog, and professional journey in web, Android, and machine learning.",
      },
      {
        name: "keywords",
        content:
          "Riyaldi, Riyaldi Hasan, Riyaldi Hasan Setiawan, riyhs, riyaldi.dev, Software Engineer, Portfolio, Web Developer, Web Development, Fullstack Development, Android Development, Machine Learning Engineer, Sukoharjo, Surakarta, Universitas Sebelas Maret, Personal Website",
      },
      { name: "author", content: "Riyaldi Hasan Setiawan" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#090911" },
      // --- Open Graph / Facebook / LinkedIn ---
      { property: "og:title", content: "Riyaldi - Software Engineer" },
      {
        property: "og:description",
        content:
          "Riyaldi Hasan Setiawan — Software Engineer and CS undergraduate. Personal portfolio of Riyaldi based in Sukoharjo, Indonesia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Riyaldi" },
      { property: "og:url", content: "https://riyaldi.dev" },
      { property: "og:image", content: "https://riyaldi.dev/img/website.webp" },
      { property: "og:image:alt", content: "Riyaldi Hasan Setiawan" },
      { property: "og:locale", content: "en_US" },
      // --- Twitter ---
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Riyaldi - Software Engineer" },
      {
        name: "twitter:description",
        content:
          "Riyaldi Hasan Setiawan — Software Engineer and CS undergraduate. Personal portfolio of Riyaldi.",
      },
      { name: "twitter:image", content: "https://riyaldi.dev/img/website.webp" },
      { name: "twitter:image:alt", content: "Riyaldi Hasan Setiawan" },
      { name: "twitter:site", content: "@riyhs_" },
      { name: "twitter:creator", content: "@riyhs_" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "128x128", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
      { rel: "manifest", href: "/manifest.json" },
      // Fetch both weights with the HTML instead of after the CSS is parsed, so the h1 and
      // body text swap from the fallback sooner. Fonts preload in CORS mode, hence crossOrigin.
      { rel: "preload", href: jakarta400, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: jakarta600, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
    ],
  }),

  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <div className="flex min-h-svh flex-col text-[rgb(var(--foreground))]">
      <Header />
      <main className="flex-1">
        {/* The page fade is the router's view transition (see `::view-transition-*` in
            styles.css), which cross-fades the old page into the new one */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ScriptOnce>{`(function(){try{var t=localStorage.getItem('riyaldi.theme')||'dark';var r=t==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t;document.documentElement.classList.add(r);document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r}catch(e){}})()`}</ScriptOnce>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
        <AppDevtools />
        <Scripts />
      </body>
    </html>
  );
}
