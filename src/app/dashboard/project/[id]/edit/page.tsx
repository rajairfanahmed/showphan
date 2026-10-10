"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { evaluateQualityGate, QualityGateEvaluation } from "@/lib/projects/quality-gate";
import { CoverImageUploader } from "@/components/studio/CoverImageUploader";
import { TechStackPicker, TechnologyItem } from "@/components/studio/TechStackPicker";
import { TagTokenizer } from "@/components/studio/TagTokenizer";
import { StickyActionDock } from "@/components/studio/StickyActionDock";
import { LiveCardPreviewDrawer } from "@/components/studio/LiveCardPreviewDrawer";

interface ProjectLoadedItem {
  id: string;
  title?: string;
  summary?: string;
  coverImageKey?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  sandboxUrl?: string | null;
  sandboxEnabled?: boolean;
  description?: string;
  role?: string;
  learnings?: string;
  tags?: string[];
  technologies?: { technology: TechnologyItem }[];
  slug?: string;
  status?: "DRAFT" | "PUBLISHED";
  updatedAt?: string;
  user?: {
    id: string;
    slug: string;
    name?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
  };
}

interface GithubRepositoryItem {
  id: number | string;
  name: string;
  description?: string | null;
  htmlUrl?: string;
  homepage?: string | null;
  primaryLanguage?: string | null;
  topics?: string[];
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [sandboxUrl, setSandboxUrl] = useState("");
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  // Metadata & System State
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [clientUpdatedAt, setClientUpdatedAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [technologiesCatalog, setTechnologiesCatalog] = useState<TechnologyItem[]>([]);
  const [authorUser, setAuthorUser] = useState<{
    slug: string;
    displayName?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
  }>({
    slug: "creator",
    displayName: "Maker",
  });

  // UI Modals & Drawers
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [descTab, setDescTab] = useState<"write" | "preview">("write");
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GithubRepositoryItem[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [publishSuccessUrl, setPublishSuccessUrl] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // 1. Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load Technologies Catalog
        const techRes = await fetch("/api/technologies");
        if (techRes.ok) {
          const tData = await techRes.json();
          setTechnologiesCatalog(tData.technologies || []);
        }

        // Load Project Details
        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const pData = await projRes.json();
          const p = (pData.projects || []).find((item: ProjectLoadedItem) => item.id === id);
          if (p) {
            setTitle(p.title || "");
            setSummary(p.summary || "");
            setCoverImageKey(p.coverImageKey || null);
            setLiveUrl(p.liveUrl || "");
            setRepoUrl(p.repoUrl || "");
            setSandboxUrl(p.sandboxUrl || "");
            setSandboxEnabled(Boolean(p.sandboxEnabled));
            setDescription(p.description || "");
            setTags(p.tags || []);
            setSelectedTechIds(p.technologies?.map((t: { technology: TechnologyItem }) => t.technology.id) || []);
            setStatus(p.status || "DRAFT");
            setClientUpdatedAt(p.updatedAt || new Date().toISOString());

            if (p.user) {
              setAuthorUser({
                slug: p.user.slug,
                displayName: p.user.displayName,
                name: p.user.name,
                avatarUrl: p.user.avatarUrl,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load project editor data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // 2. Debounced Autosave
  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          coverImageKey,
          liveUrl,
          repoUrl,
          sandboxUrl: sandboxUrl.trim() || null,
          sandboxEnabled,
          description,
          tags,
          technologyIds: selectedTechIds,
          clientUpdatedAt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setClientUpdatedAt(data.project.updatedAt);
        setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.error("Autosave error", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      saveChanges();
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    title,
    summary,
    coverImageKey,
    liveUrl,
    repoUrl,
    sandboxUrl,
    sandboxEnabled,
    description,
    tags,
    selectedTechIds,
  ]);

  // 3. Quality Gate Evaluation (5 Domain Rules)
  const qualityGate: QualityGateEvaluation = useMemo(() => {
    return evaluateQualityGate({
      title,
      summary,
      coverImageKey,
      technologies: selectedTechIds,
      liveUrl,
      repoUrl,
    });
  }, [title, summary, coverImageKey, selectedTechIds, liveUrl, repoUrl]);

  // 4. Publish Handler
  const handlePublish = async () => {
    if (!qualityGate.canPublish) {
      alert(`Cannot publish:\n- ${qualityGate.missingRules.join("\n- ")}`);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}/publish`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStatus("PUBLISHED");
        setPublishSuccessUrl(data.publicUrl || `/${authorUser.slug}/${data.project?.slug || id}`);
      } else {
        const err = await res.json();
        alert(err.error?.message || "Failed to publish project.");
      }
    } catch {
      alert("Publish connection error.");
    }
  };

  // 5. GitHub Auto-Fill Modal
  const openGithubModal = async () => {
    setGithubModalOpen(true);
    setLoadingRepos(true);
    try {
      const res = await fetch("/api/github/repos");
      if (res.ok) {
        const data = await res.json();
        setGithubRepos(data.repositories || []);
      }
    } catch (err) {
      console.error("GitHub repos fetch error", err);
    } finally {
      setLoadingRepos(false);
    }
  };

  const applyGithubRepo = (repo: GithubRepositoryItem) => {
    setTitle(repo.name);
    if (repo.description) setSummary(repo.description.slice(0, 140));
    if (repo.htmlUrl) setRepoUrl(repo.htmlUrl);
    if (repo.homepage) setLiveUrl(repo.homepage);

    // Map repository topics & language to technology catalog
    const matchedIds: string[] = [];
    const searchTerms = [repo.primaryLanguage, ...(repo.topics || [])]
      .filter(Boolean)
      .map((s) => s?.toLowerCase());

    technologiesCatalog.forEach((t) => {
      if (searchTerms.includes(t.slug.toLowerCase()) || searchTerms.includes(t.name.toLowerCase())) {
        matchedIds.push(t.id);
      }
    });

    if (matchedIds.length > 0) {
      setSelectedTechIds(Array.from(new Set([...selectedTechIds, ...matchedIds])).slice(0, 15));
    }

    // Auto-map topics to #tags (up to 5)
    if (repo.topics && repo.topics.length > 0) {
      const formattedTags = repo.topics
        .slice(0, 5)
        .map((t) => `#${t.toLowerCase().replace(/[^a-z0-9_-]/g, "")}`);
      setTags(formattedTags);
    }

    setGithubModalOpen(false);
    setSyncToast(`Synchronized with ${repo.name}!`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // Selected technologies mapped for preview
  const selectedTechObjects = useMemo(() => {
    return selectedTechIds
      .map((tId) => technologiesCatalog.find((t) => t.id === tId))
      .filter((t): t is TechnologyItem => Boolean(t))
      .map((t) => ({ name: t.name, slug: t.slug, iconColor: t.iconColor }));
  }, [selectedTechIds, technologiesCatalog]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-[var(--foreground-muted)]">Loading Showcase Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/25 selection:text-blue-900 dark:selection:text-blue-200">
      {/* Top Breadcrumb & GitHub Sync Bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-xl px-4 sm:px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] truncate min-w-0">
            <Link
              href="/dashboard"
              className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1 font-semibold"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="font-bold text-[var(--foreground)] truncate">
              {title || "Untitled Project"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Auto-fill from GitHub */}
            <button
              type="button"
              onClick={openGithubModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-[#0052ff] dark:text-blue-300 hover:bg-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Auto-fill GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0052ff] text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Single-Column Studio Canvas */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8 pb-32">
        {/* Section 1: Cancelable 16:9 Cover Image Pipeline */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-3">
          <CoverImageUploader
            coverImageKey={coverImageKey}
            onUploadSuccess={(key) => setCoverImageKey(key)}
            onRemoveCover={() => setCoverImageKey(null)}
          />
        </section>

        {/* Section 2: Project Title & Summary */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              Project Title <span className="text-[#0052ff]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bunflare Edge Microservices"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 text-base font-bold transition-all"
            />
          </div>

          {/* Summary with 140-char limit counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[var(--foreground)]">
                Summary <span className="text-[#0052ff]">*</span>
              </label>
              <span
                className={`text-xs font-mono font-medium ${
                  summary.length > 140
                    ? "text-red-500 font-bold"
                    : summary.length >= 120
                    ? "text-amber-500"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {summary.length} / 140
              </span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, 140))}
              rows={2}
              placeholder="One punchy sentence describing what this project does and why it matters."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 text-sm resize-none transition-all"
            />
          </div>
        </section>

        {/* Section 3: Live & Repository Links */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              Application Links <span className="text-[#0052ff]">* (at least 1 required)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-1">
                <span>🌐 Live URL</span>
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://your-app.com"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-xs font-mono placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20"
              />
            </div>

            {/* Repository URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-1">
                <span>📦 Source Repository</span>
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-xs font-mono placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Technologies & Tools Picker */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <TechStackPicker
            selectedTechIds={selectedTechIds}
            onChange={(ids) => setSelectedTechIds(ids)}
          />
        </section>

        {/* Section 5: #Tags Input Engine */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <TagTokenizer
            tags={tags}
            onChange={(newTags) => setTags(newTags)}
            maxTags={5}
          />
        </section>

        {/* Section 6: Long-Form Markdown Description */}
        <section className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              Deep-Dive Description <span className="text-xs text-[var(--foreground-muted)] font-normal">(Markdown supported)</span>
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setDescTab("write")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  descTab === "write" ? "bg-[var(--card)] text-[#0052ff] shadow-sm" : "text-[var(--foreground-muted)]"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setDescTab("preview")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  descTab === "preview" ? "bg-[var(--card)] text-[#0052ff] shadow-sm" : "text-[var(--foreground-muted)]"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {descTab === "write" ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Explain how you built this, key architecture decisions, challenges solved, and performance optimizations..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff]/20 text-sm font-mono leading-relaxed transition-all"
            />
          ) : (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] prose dark:prose-invert max-w-none text-sm min-h-[180px]">
              {description.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {description}
                </ReactMarkdown>
              ) : (
                <p className="text-[var(--foreground-muted)] italic">No description written yet.</p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Sticky Floating Action Dock */}
      <StickyActionDock
        status={status}
        saving={saving}
        lastSavedTime={lastSaved}
        qualityGate={qualityGate}
        onSaveDraft={saveChanges}
        onPublish={handlePublish}
        onTogglePreview={() => setIsPreviewOpen((prev) => !prev)}
        isPreviewOpen={isPreviewOpen}
      />

      {/* Live Card Preview Drawer */}
      <LiveCardPreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        summary={summary}
        coverImageKey={coverImageKey}
        technologies={selectedTechObjects}
        liveUrl={liveUrl}
        repoUrl={repoUrl}
        user={authorUser}
      />

      {/* GitHub Repositories Selector Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                <span>⚡ Auto-fill from GitHub Repository</span>
              </h3>
              <button
                type="button"
                onClick={() => setGithubModalOpen(false)}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            {loadingRepos ? (
              <div className="py-8 text-center text-xs text-[var(--foreground-muted)] flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-[#0052ff] border-t-transparent rounded-full animate-spin" />
                <span>Loading your GitHub repositories...</span>
              </div>
            ) : githubRepos.length > 0 ? (
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {githubRepos.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => applyGithubRepo(repo)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--border)] hover:border-[#0052ff] hover:bg-blue-500/5 transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-xs text-[var(--foreground)] group-hover:text-[#0052ff] truncate">
                      {repo.name}
                    </div>
                    {repo.description && (
                      <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-1 mt-0.5">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-[var(--foreground-muted)]">
                      {repo.primaryLanguage && <span>● {repo.primaryLanguage}</span>}
                      {repo.topics && repo.topics.length > 0 && <span>#{repo.topics.slice(0, 2).join(" #")}</span>}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--foreground-muted)]">
                No repositories found or GitHub account not linked.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish Success Celebration Modal */}
      {publishSuccessUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-[var(--foreground)]">Project is Live!</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Your project satisfied all 5 Quality Gate rules and is now visible on the homepage discovery feed.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={publishSuccessUrl}
                className="w-full py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                View Live Showcase →
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] font-semibold text-xs hover:bg-[var(--surface-glass)] transition-all"
              >
                Go to Homepage Feed
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
