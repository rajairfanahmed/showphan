"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { ReadmeBadgeCard } from "@/components/ReadmeBadgeCard";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageKey: string | null;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  position: number;
  updatedAt: string;
  technologies: Array<{ technology: { id: string; name: string; iconColor: string } }>;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [copyToast, setCopyToast] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
      return;
    }
    if (session?.user) {
      let isMounted = true;
      fetch("/api/projects")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.projects) {
            setProjects(data.projects);
          }
        })
        .catch((err) => console.error("Failed to load projects", err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [isPending, session, router]);

  const handleCreateNew = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Project" }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/project/${data.project.id}/edit`);
      } else {
        const err = await res.json();
        alert(err.error?.message || "Failed to create project draft.");
      }
    } catch {
      alert("Network error creating project draft.");
    }
  };

  const handleToggleFeatured = async (project: ProjectItem) => {
    const featuredCount = projects.filter((p) => p.isFeatured).length;
    if (!project.isFeatured && featuredCount >= 6) {
      alert("Maximum limit of 6 featured projects reached.");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !project.isFeatured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, isFeatured: !p.isFeatured } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (project: ProjectItem) => {
    const endpoint =
      project.status === "PUBLISHED"
        ? `/api/projects/${project.id}/unpublish`
        : `/api/projects/${project.id}/publish`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, status: data.project.status } : p
          )
        );
      } else {
        const err = await res.json();
        if (err.error?.missingRules) {
          alert(`Publishing blocked:\n- ${err.error.missingRules.join("\n- ")}`);
        } else {
          alert(err.error?.message || "Could not change project status.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      const res = await fetch(`/api/projects/${deleteModalId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteModalId));
        setDeleteModalId(null);
      }
    } catch {
      alert("Failed to delete project.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProjects(updated);

    await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectIds: updated.map((p) => p.id) }),
    });
  };

  const userSlug = (session?.user as { slug?: string } | undefined)?.slug || "profile";
  const publicProfileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${userSlug}`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "PUBLISHED") return p.status === "PUBLISHED";
    if (activeTab === "DRAFT") return p.status === "DRAFT";
    return true;
  });

  const featuredCount = projects.filter((p) => p.isFeatured).length;

  if (isPending || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-[var(--muted)] rounded-md w-1/4" />
        <div className="h-64 bg-[var(--muted)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Your Projects
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
              {projects.length} / 30
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Manage your project showcases, drag to reorder, and control live visibility.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={copyProfileLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-sm font-medium transition-colors"
          >
            <span>{copyToast ? "Copied! ✓" : "Copy Profile Link"}</span>
          </button>
          <Link
            href={`/${userSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] text-sm font-medium transition-colors"
          >
            <span>View Public Profile ↗</span>
          </Link>
          <button
            onClick={handleCreateNew}
            disabled={projects.length >= 30}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0052ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all min-touch cursor-pointer"
          >
            <span>+ Add project</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 text-sm">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === "ALL"
              ? "bg-blue-500/10 text-[#0052ff] border border-blue-500/30"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("PUBLISHED")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === "PUBLISHED"
              ? "bg-blue-500/10 text-[#0052ff] border border-blue-500/30"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Published ({projects.filter((p) => p.status === "PUBLISHED").length})
        </button>
        <button
          onClick={() => setActiveTab("DRAFT")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === "DRAFT"
              ? "bg-blue-500/10 text-[#0052ff] border border-blue-500/30"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Drafts ({projects.filter((p) => p.status === "DRAFT").length})
        </button>
      </div>

      {/* Projects List or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl bg-white/50 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052ff] flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
            💡
          </div>
          <h3 className="font-bold text-lg text-[var(--foreground)]">No projects here yet</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
            {activeTab === "ALL"
              ? "Add your first coding project in ~5 minutes with a cover image, tech stack, and links."
              : `You have no projects under the ${activeTab.toLowerCase()} tab.`}
          </p>
          {activeTab === "ALL" && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              + Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project, idx) => {
            const coverUrl = getCoverImageUrl(project.coverImageKey);
            return (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-white hover:border-blue-500/30 transition-colors gap-4 shadow-sm"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Reorder Buttons */}
                  <div className="hidden sm:flex flex-col gap-1 text-[var(--muted-foreground)]">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="hover:text-[#0052ff] disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === filteredProjects.length - 1}
                      className="hover:text-[#0052ff] disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-24 h-14 rounded-lg bg-slate-100 border border-[var(--border)] shrink-0 overflow-hidden flex items-center justify-center relative">
                    {coverUrl ? (
                      <img src={coverUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 uppercase font-mono">No Cover</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-[var(--foreground)] truncate">
                        {project.title}
                      </h3>
                      {project.status === "PUBLISHED" ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600">
                          Published
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] truncate max-w-md">
                      {project.summary || "No summary added yet."}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  {/* Featured Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      project.isFeatured
                        ? "border-blue-500/40 bg-blue-500/10 text-[#0052ff]"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                    title={
                      !project.isFeatured && featuredCount >= 6
                        ? "Maximum 6 featured projects allowed"
                        : "Toggle featured on public profile"
                    }
                  >
                    <span>★ {project.isFeatured ? "Featured" : "Feature"}</span>
                  </button>

                  {/* Publish/Unpublish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    {project.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/dashboard/project/${project.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-[#0052ff] hover:bg-blue-500/20 transition-colors"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteModalId(project.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GitHub Profile README Badge Card */}
      {session?.user && userSlug && (
        <div className="pt-4">
          <ReadmeBadgeCard slug={userSlug} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Delete this project?</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              This action cannot be undone. The project details and its stored cover image in Cloudflare R2 will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
