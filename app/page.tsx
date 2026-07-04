import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileDown } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { Terminal } from "@/components/terminal";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";
import { ContributionGraph } from "@/components/contribution-graph";
import { getLiveProjects } from "@/lib/projects-live";
import { getAllPosts } from "@/lib/content";
import { site } from "@/lib/data/site";
import profilePic from "@/public/images/profile.jpg";

export const revalidate = 3600;

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col gap-20">
      {/* Hero */}
      <section className="pt-6">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-sm text-accent">hi, my name is</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
                {site.name}
              </h1>
              <p className="mt-3 font-mono text-sm text-muted">
                {site.role} @{" "}
                <a
                  href={site.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline decoration-accent underline-offset-4 hover:text-accent"
                >
                  {site.company}
                </a>
              </p>
            </div>
            <Image
              src={profilePic}
              alt={`Portrait of ${site.name}`}
              width={88}
              height={88}
              priority
              className="hidden rounded-full border-2 border-edge-strong sm:block"
            />
          </div>
          <p className="mt-6 max-w-xl leading-relaxed text-muted">
            I build distributed, event-driven backends in{" "}
            <span className="text-fg">Java &amp; Spring Boot</span> by day — and{" "}
            <span className="text-fg">Rust</span> CLIs, crates, and open-source
            APIs by night. Owner of an enterprise Order Management System,
            maintainer of{" "}
            <Link
              href="/projects"
              className="text-fg underline decoration-accent underline-offset-4 hover:text-accent"
            >
              five published crates
            </Link>
            , and firm believer that software should be free and open.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              resume.pdf
            </a>
            <Link
              href="/about"
              className="group flex items-center gap-2 rounded-lg border border-edge px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              more about me
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Interactive terminal — the signature flourish */}
      <section aria-label="Interactive terminal">
        <Reveal delay={0.1}>
          <Terminal />
        </Reveal>
      </section>

      {/* Selected projects */}
      <section>
        <Reveal>
          <SectionHeading href="/projects">selected projects</SectionHeading>
        </Reveal>
        <Suspense fallback={<ProjectsSkeleton />}>
          <FeaturedProjects />
        </Suspense>
      </section>

      {/* Latest writing */}
      {posts.length > 0 && (
        <section>
          <Reveal>
            <SectionHeading href="/blog">latest writing</SectionHeading>
            <div className="flex flex-col gap-1">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* GitHub activity */}
      <section>
        <Reveal>
          <SectionHeading href={site.links.github} hrefLabel="github ↗">
            contribution graph
          </SectionHeading>
        </Reveal>
        <Suspense
          fallback={
            <div
              className="h-28 animate-pulse rounded-lg bg-elevated"
              aria-hidden="true"
            />
          }
        >
          <ContributionGraph />
        </Suspense>
      </section>
    </div>
  );
}

async function FeaturedProjects() {
  const projects = (await getLiveProjects()).filter((p) => p.featured);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&:has(a:hover)_a:not(:hover)]:opacity-60">
      {projects.map((project, i) => (
        <Reveal key={project.repo} delay={i * 0.05} className="h-full">
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl bg-elevated" />
      ))}
    </div>
  );
}
