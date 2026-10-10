"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";

interface TechnologyItem {
  id: string;
  name: string;
  slug: string;
  iconColor?: string | null;
}

interface ProfileProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageKey?: string | null;
  kudosCount: number;
  isFeatured: boolean;
  technologies: {
    technology: TechnologyItem;
  }[];
}

interface ProfileProjectGridProps {
  userSlug: string;
  featuredProjects: ProfileProjectItem[];
  regularProjects: ProfileProjectItem[];
  allTechnologies: TechnologyItem[];
}

export function ProfileProjectGrid({
  userSlug,
  featuredProjects,
  regularProjects,
  allTechnologies,
}: ProfileProjectGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const allProjects = useMemo(() => {
    return [...featuredProjects, ...regularProjects];
  }, [featuredProjects, regularProjects]);

  // Filtered & sorted projects based on active tab
  const displayedProjects = useMemo(() => {
    if (selectedFilter === "all") {
      return regularProjects;
    }

    if (selectedFilter === "kudos") {
      return [...allProjects].sort((a, b) => b.kudosCount - a.kudosCount);
    }

    // Technology filter
    return allProjects.filter((p) =>
      p.technologies.some(
        (t) => t.technology.slug.toLowerCase() === selectedFilter.toLowerCase()
      )
    );
  }, [selectedFilter, allProjects, regularProjects]);

  const showFeaturedShelf = selectedFilter === "all" && featuredProjects.length > 0;

  return (
    <div className="space-y-12">
      {/* Filter Tabs Navigation */}
      {allProjects.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[var(--border)]/70">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
                : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-slate-50"
            }`}
          >
            All Work ({allProjects.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("kudos")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedFilter === "kudos"
                ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
                : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-slate-50"
            }`}
          >
            <span>★</span>
            <span>Most Kudos</span>
          </button>

          {allTechnologies.map((tech) => (
            <button
              key={tech.id}
              type="button"
              onClick={() => setSelectedFilter(tech.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tech.slug
                  ? "bg-[#0052ff] text-white shadow-sm shadow-blue-500/20"
                  : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-slate-50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tech.iconColor || "#0052ff" }}
              />
              <span>{tech.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. Featured Work Top Shelf */}
      {showFeaturedShelf && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[#0052ff] font-bold text-base">★</span>
            <h2 className="text-xl font-black tracking-tight text-[#0c0d12]">
              Featured Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {featuredProjects.map((project) => {
              const coverUrl = getCoverImageUrl(project.coverImageKey);
              return (
                <Link
                  key={project.id}
                  href={`/${userSlug}/${project.slug}`}
                  className="group flex flex-col rounded-3xl border border-blue-500/30 bg-[var(--card)] overflow-hidden hover:border-[#0052ff] hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  {/* Strict 16:9 Pristine Cover */}
                  <div className="aspect-video w-full bg-slate-900 border-b border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-3xl font-black text-[#0052ff]">
                        ⚡
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0052ff] border border-blue-100 font-mono text-xs font-bold shadow-sm">
                      ★ {project.kudosCount}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-xl text-[#0c0d12] group-hover:text-[#0052ff] transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]/60">
                      {project.technologies.slice(0, 4).map((t) => (
                        <TechBadge
                          key={t.technology.id}
                          name={t.technology.name}
                          iconName={t.technology.iconColor || undefined}
                          size="sm"
                        />
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. All Projects Grid / Filter Results */}
      <section className="space-y-5">
        {showFeaturedShelf && (
          <h2 className="text-xl font-black tracking-tight text-[#0c0d12]">
            All Projects
          </h2>
        )}

        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => {
              const coverUrl = getCoverImageUrl(project.coverImageKey);
              return (
                <Link
                  key={project.id}
                  href={`/${userSlug}/${project.slug}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[#0052ff] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Strict 16:9 Pristine Cover */}
                  <div className="aspect-video w-full bg-slate-900 border-b border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-2xl font-black text-[#0052ff]">
                        ⚡
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0052ff] border border-blue-100 font-mono text-[11px] font-bold shadow-sm">
                      ★ {project.kudosCount}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-[#0c0d12] group-hover:text-[#0052ff] transition-colors truncate">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[var(--border)]/60">
                      {project.technologies.slice(0, 3).map((t) => (
                        <TechBadge
                          key={t.technology.id}
                          name={t.technology.name}
                          iconName={t.technology.iconColor || undefined}
                          size="sm"
                        />
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)]">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-3xl p-8 space-y-3 bg-white/50">
            <p className="text-sm font-semibold text-[var(--foreground-muted)]">
              No projects matching &ldquo;{selectedFilter}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className="px-4 py-2 rounded-xl bg-[#0052ff] text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Reset to All Projects
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
