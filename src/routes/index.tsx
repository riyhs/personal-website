import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { Section } from "../components/Section";
import { getButtonClasses } from "../components/ui/button";
import { GithubIcon } from "../components/ui/GithubIcon";
import { LinkedinIcon } from "../components/ui/LinkedinIcon";
import { TwitterIcon } from "../components/ui/TwitterIcon";
import { cn } from "../lib/utils";
import { formatShortDate } from "../lib/date";
import { profile } from "../data/profile";
import { projectShotTransition, spotlightProjects } from "../data/projects";
import { techStack } from "../data/stack";
import { listPosts } from "../lib/posts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Riyaldi Hasan - Software Engineer & Personal Portfolio (riyaldi.dev)",
      },
      {
        name: "description",
        content:
          "Riyaldi (Riyaldi Hasan Setiawan) — Software Engineer and Computer Science undergraduate at Universitas Sebelas Maret. Personal portfolio of Riyaldi Hasan featuring projects, blog, and professional journey in web, Android, and machine learning.",
      },
      {
        name: "keywords",
        content:
          "Riyaldi, Riyaldi Hasan, Riyaldi Hasan Setiawan, riyhs, riyaldi.dev, Software Engineer, Personal Portfolio, Web Developer, Fullstack Developer, Android Developer, Machine Learning Engineer, Universitas Sebelas Maret, Sukoharjo",
      },
      {
        property: "og:title",
        content:
          "Riyaldi Hasan - Software Engineer & Personal Portfolio (riyaldi.dev)",
      },
      {
        property: "og:description",
        content:
          "Riyaldi (Riyaldi Hasan Setiawan) — Software Engineer and CS undergraduate. Personal portfolio of Riyaldi Hasan based in Sukoharjo, Indonesia.",
      },
      { property: "og:url", content: "https://riyaldi.dev/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://riyaldi.dev/img/website.webp" },
      { property: "og:image:alt", content: "Riyaldi Hasan Setiawan" },
      { name: "twitter:title", content: "Riyaldi Hasan - Software Engineer" },
      {
        name: "twitter:description",
        content:
          "Riyaldi (Riyaldi Hasan Setiawan) — Software Engineer and CS undergraduate. Personal portfolio of Riyaldi Hasan.",
      },
      { name: "twitter:image", content: "https://riyaldi.dev/img/website.webp" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://riyaldi.dev/",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "Riyaldi Hasan - Personal Website",
              alternateName: [
                "Riyaldi",
                "Riyaldi Hasan",
                "Riyaldi Hasan Setiawan",
                "riyhs",
              ],
              url: "https://riyaldi.dev",
              description:
                "Personal portfolio and website of Riyaldi Hasan Setiawan, Software Engineer.",
              inLanguage: "en-US",
              publisher: {
                "@type": "Person",
                name: "Riyaldi Hasan Setiawan",
                url: "https://riyaldi.dev",
              },
            },
            {
              "@type": "Person",
              "@id": "https://riyaldi.dev/#person",
              name: "Riyaldi Hasan Setiawan",
              alternateName: ["Riyaldi", "Riyaldi Hasan", "riyhs"],
              url: "https://riyaldi.dev",
              jobTitle: "Software Engineer",
              description:
                "Riyaldi Hasan Setiawan is a Software Engineer and Computer Science undergraduate at Universitas Sebelas Maret, specializing in Web, Android, and Machine Learning.",
              sameAs: [
                "https://github.com/riyhs",
                "https://twitter.com/riyhs_",
                "https://www.linkedin.com/in/riyaldi",
              ],
              image: "https://riyaldi.dev/img/riyaldi-hasan.webp",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sukoharjo",
                addressCountry: "ID",
              },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Universitas Sebelas Maret",
              },
              knowsAbout: [
                "Software Engineering",
                "Web Development",
                "Android Development",
                "Fullstack Development",
                "Machine Learning",
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
  loader: () => {
    const posts = listPosts().slice(0, 2);
    return {
      projects: spotlightProjects,
      posts: posts.map((post) => ({
        slug: post.slug,
        frontmatter: post.frontmatter,
      })),
    };
  },
});

const socialIcons = {
  GitHub: GithubIcon,
  Twitter: TwitterIcon,
  LinkedIn: LinkedinIcon,
};

function HomePage() {
  const { projects, posts } = Route.useLoaderData();

  return (
    <div className="pb-8">
      <PageHeader label={profile.tagline} title={profile.name} lead={profile.summary}>
        <p className="lead-text mt-4">{profile.recent}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/projects" className={cn(getButtonClasses(), "px-6 text-sm")}>
            View projects
          </Link>
          <a
            href="/docs/Riyaldi_Hasan_Setiawan_CV.pdf"
            target="_blank"
            rel="noreferrer"
            className={cn(getButtonClasses("outline"), "px-6 text-sm")}
          >
            Download CV
          </a>
          <div className="ml-1 flex items-center gap-4">
            {profile.socials.map((social) => {
              const Icon = socialIcons[social.label];
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-[rgb(var(--foreground)/0.6)] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              );
            })}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="text-[rgb(var(--foreground)/0.6)] transition-colors hover:text-[rgb(var(--foreground))]"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </PageHeader>

      <Section label="Selected work" link={{ to: "/projects", label: "All projects" }}>
        <ul className="divide-y divide-dashed divide-[rgb(var(--foreground)/0.12)]">
          {projects.map((project: (typeof spotlightProjects)[number]) => (
            <li key={project.slug}>
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 py-5 sm:grid-cols-[8rem_1fr_auto] sm:gap-6"
              >
                <img
                  src={project.thumbnail}
                  alt=""
                  width={640}
                  height={360}
                  loading="lazy"
                  style={{ viewTransitionName: projectShotTransition(project.slug) }}
                  className="aspect-video w-full rounded-[4px] border border-[rgb(var(--foreground)/0.1)] object-cover"
                />
                <div className="min-w-0">
                  <h3 className="item-title group-hover:underline">
                    {project.title}
                  </h3>
                  <p className="item-text mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <span className="mono-label hidden sm:block">
                  {project.year} · {project.platform}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Stack" link={{ to: "/about", label: "About me" }}>
        <dl className="space-y-4 sm:space-y-3">
          {techStack.map((group) => (
            <div key={group.label} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm text-[rgb(var(--foreground)/0.6)]">{group.label}</dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[rgb(var(--foreground)/0.9)]">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Recent writing" link={{ to: "/blog", label: "All posts" }}>
        <ul className="divide-y divide-dashed divide-[rgb(var(--foreground)/0.12)]">
          {posts.map(
            (post: {
              slug: string;
              frontmatter: { title: string; excerpt: string; date: string };
            }) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <time dateTime={post.frontmatter.date} className="mono-label shrink-0 sm:w-32">
                    {formatShortDate(post.frontmatter.date)}
                  </time>
                  <span className="item-title group-hover:underline">
                    {post.frontmatter.title}
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </Section>
    </div>
  );
}
