"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { evaluateQualityGate, QualityGateEvaluation } from "@/lib/projects/quality-gate";
import { getCoverImageUrl } from "@/lib/storage/urls";
import { TechBadge } from "@/components/TechBadge";

interface Technology {
  id: string;
  name: string;
  slug: string;
  iconColor: string;
  iconMono: string;
}

interface ProjectLoadedItem {
  id: string;
  title?: string;
  summary?: string;
  coverImageKey?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  description?: string;
  role?: string;
  learnings?: string;
  tags?: string[];
  technologies?: { technology: { id: string } }[];
  slug?: string;
  status?: "DRAFT" | "PUBLISHED";
  updatedAt?: string;
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
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [isPrivateCode, setIsPrivateCode] = useState(false);
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [learnings, setLearnings] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);

  // Metadata & System State
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [clientUpdatedAt, setClientUpdatedAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Available Technologies
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [techSearch, setTechSearch] = useState("");

  // UI Tabs & Modals
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [descTab, setDescTab] = useState<"write" | "preview">("write");
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GithubRepositoryItem[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [publishSuccessUrl, setPublishSuccessUrl] = useState<string | null>(null);

  // 1. Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load Tech Catalog
        const techRes = await fetch("/api/technologies");
        if (techRes.ok) {
          const tData = await techRes.json();
          setTechnologies(tData.technologies || []);
        }

        // Load Projects to find this one
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
            setIsPrivateCode(!p.repoUrl && Boolean(p.liveUrl));
            setDescription(p.description || "");
            setRole(p.role || "");
            setLearnings(p.learnings || "");
            setTags(p.tags || []);
            setSelectedTechIds(p.technologies?.map((t: { technology: { id: string } }) => t.technology.id) || []);
            setStatus(p.status || "DRAFT");
            setClientUpdatedAt(p.updatedAt || new Date().toISOString());
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
          description,
          role,
          learnings,
          tags,
          technologyIds: selectedTechIds,
          clientUpdatedAt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setClientUpdatedAt(data.project.updatedAt);
        setLastSaved(new Date().toLocaleTimeString());
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
    description,
    role,
    learnings,
    tags,
    selectedTechIds,
  ]);

  // 3. Image Upload & Canvas Resizing
  const handleImageFile = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG, and WebP images are accepted.");
      return;
    }

    setUploadingImage(true);
    setImageWarning(null);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = async () => {
      if (img.width < 1000) {
        setImageWarning("Image is narrower than 1000px. Text in screenshots may look soft.");
      }

      // Resize & compress to WebP
      const canvas = document.createElement("canvas");
      const maxW = 1600;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setUploadingImage(false);
            return;
          }

          try {
            // Get Presigned PUT URL
            const presignRes = await fetch("/api/uploads/cover", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mimeType: "image/webp",
                fileSize: blob.size,
              }),
            });

            if (!presignRes.ok) {
              const err = await presignRes.json();
              alert(err.error?.message || "Upload presign failed.");
              setUploadingImage(false);
              return;
            }

            const { uploadUrl, key } = await presignRes.json();

            // Direct PUT to R2
            const uploadRes = await fetch(uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": "image/webp" },
              body: blob,
            });

            if (uploadRes.ok) {
              setCoverImageKey(key);
            } else {
              alert("Direct upload to storage failed. Please retry.");
            }
          } catch {
            alert("Upload error.");
          } finally {
            setUploadingImage(false);
          }
        },
        "image/webp",
        0.85
      );
    };

    reader.readAsDataURL(file);
  };

  // 4. Tags handler
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // 5. Tech stack handler
  const toggleTech = (techId: string) => {
    if (selectedTechIds.includes(techId)) {
      setSelectedTechIds(selectedTechIds.filter((t) => t !== techId));
    } else {
      if (selectedTechIds.length >= 15) {
        alert("Maximum limit of 15 technologies allowed.");
        return;
      }
      setSelectedTechIds([...selectedTechIds, techId]);
    }
  };

  // Custom Technology Creator
  const handleCreateCustomTech = async () => {
    const name = techSearch.trim();
    if (!name) return;
    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        const newTech: Technology = data.technology;
        if (!technologies.some((t) => t.id === newTech.id)) {
          setTechnologies((prev) => [...prev, newTech]);
        }
        if (!selectedTechIds.includes(newTech.id) && selectedTechIds.length < 15) {
          setSelectedTechIds((prev) => [...prev, newTech.id]);
        }
        setTechSearch("");
      }
    } catch (err) {
      console.error("Failed to create custom technology", err);
    }
  };

  // 6. GitHub Import
  const [syncToast, setSyncToast] = useState<string | null>(null);

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
      console.error(err);
    } finally {
      setLoadingRepos(false);
    }
  };

  const applyGithubRepo = (repo: GithubRepositoryItem) => {
    setTitle(repo.name);
    if (repo.description) setSummary(repo.description.slice(0, 140));
    if (repo.htmlUrl) setRepoUrl(repo.htmlUrl);
    if (repo.homepage) setLiveUrl(repo.homepage);

    // Map language & topics
    const matchedIds: string[] = [];
    const searchTerms = [repo.primaryLanguage, ...(repo.topics || [])].map((s) =>
      s?.toLowerCase()
    );

    technologies.forEach((t) => {
      if (searchTerms.includes(t.slug) || searchTerms.includes(t.name.toLowerCase())) {
        matchedIds.push(t.id);
      }
    });

    if (matchedIds.length > 0) {
      setSelectedTechIds(Array.from(new Set([...selectedTechIds, ...matchedIds])).slice(0, 15));
    }

    setGithubModalOpen(false);
    setSyncToast(`Synchronized with ${repo.name}!`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  // 7. Quality Gate Checklist
  const qualityGate: QualityGateEvaluation = evaluateQualityGate({
    title,
    summary,
    coverImageKey,
    technologies: selectedTechIds,
    liveUrl,
    repoUrl,
  });

  // 8. Publish Handler
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
        setPublishSuccessUrl(data.publicUrl);
      } else {
        const err = await res.json();
        alert(err.error?.message || "Failed to publish.");
      }
    } catch {
      alert("Publish error.");
    }
  };

  const selectedTechObjects = technologies.filter((t) => selectedTechIds.includes(t.id));
  const coverUrl = getCoverImageUrl(coverImageKey);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      {/* Top Action Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-16 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ← Back to Dashboard
          </button>
          <span className="text-zinc-600">|</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]">
            {status}
          </span>
          {/* Quality HUD Mini-Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                qualityGate.canPublish
                  ? "bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"
                  : "bg-amber-400"
              }`}
            />
            <span className="font-mono text-[11px] font-semibold text-[var(--foreground)]">
              {qualityGate.satisfiedCount}/5 Quality Standards
            </span>
          </div>
          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
            {saving ? "Saving..." : lastSaved ? `Saved at ${lastSaved}` : "Auto-saved"}
          </span>
          {syncToast && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md animate-fade-in">
              ✓ {syncToast}
            </span>
          )}
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center rounded-lg border border-[var(--border)] bg-[var(--muted)] p-0.5 text-xs">
          <button
            onClick={() => setMobileTab("edit")}
            className={`px-3 py-1 rounded-md font-medium ${
              mobileTab === "edit" ? "bg-[var(--card)] text-[var(--foreground)] shadow" : "text-[var(--muted-foreground)]"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1 rounded-md font-medium ${
              mobileTab === "preview" ? "bg-[var(--card)] text-[var(--foreground)] shadow" : "text-[var(--muted-foreground)]"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openGithubModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 text-xs font-semibold hover:bg-amber-500/20 text-amber-400 transition-colors"
          >
            <span>⚡ Sync from GitHub</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={!qualityGate.canPublish}
            className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold text-xs shadow-md transition-all min-touch"
            title={
              !qualityGate.canPublish
                ? `Missing: ${qualityGate.missingRules.join(", ")}`
                : "Publish project to live profile"
            }
          >
            {status === "PUBLISHED" ? "Update Live" : "Publish"}
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
        {/* Left Column: Form Fields */}
        <div
          className={`p-6 sm:p-8 space-y-8 overflow-y-auto max-w-2xl mx-auto w-full ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* 1. Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              Project Title <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Cache Engine"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:ring-2 focus:ring-amber-500/50 outline-none text-base font-semibold"
            />
          </div>

          {/* 2. Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[var(--foreground)]">
                Summary <span className="text-amber-500">*</span>
              </label>
              <span className={`text-xs ${summary.length > 140 ? "text-red-400" : "text-[var(--muted-foreground)]"}`}>
                {summary.length} / 140
              </span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, 140))}
              rows={2}
              placeholder="One punchy sentence describing what this project does."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:ring-2 focus:ring-amber-500/50 outline-none text-sm resize-none"
            />
          </div>

          {/* 3. Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[var(--foreground)]">
              16:9 Cover Image <span className="text-amber-500">*</span>
            </label>
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center hover:border-amber-500/50 transition-colors bg-[var(--card)] relative">
              {coverUrl ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-[var(--border)] relative">
                    <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)] cursor-pointer text-[var(--foreground)]">
                    <span>Replace Cover</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block py-6 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-lg">
                    📁
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    {uploadingImage ? "Processing & Uploading to R2..." : "Click or drag 16:9 cover image"}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">WebP, PNG, or JPG up to 1MB</p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={uploadingImage}
                    onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {imageWarning && <p className="text-xs text-amber-400 font-medium">{imageWarning}</p>}
          </div>

          {/* 4. Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-[var(--foreground)]">
                Live & Repository Links <span className="text-amber-500">* (at least one)</span>
              </label>
              <button
                type="button"
                onClick={openGithubModal}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>⚡ Auto-fill from GitHub</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block mb-1">Live Site URL</span>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {!isPrivateCode && (
                <div>
                  <span className="text-xs text-[var(--muted-foreground)] block mb-1">Repository URL</span>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPrivateCode}
                  onChange={(e) => {
                    setIsPrivateCode(e.target.checked);
                    if (e.target.checked) setRepoUrl("");
                  }}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs text-[var(--muted-foreground)]">
                  Source code is private or closed-source
                </span>
              </label>
            </div>
          </div>

          {/* 5. Tech Stack */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[var(--foreground)]">
                Technologies Used <span className="text-amber-500">*</span>
              </label>
              <span className="text-xs text-[var(--muted-foreground)]">
                {selectedTechIds.length} / 15
              </span>
            </div>

            {/* Selected Pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              {selectedTechObjects.length === 0 ? (
                <span className="text-xs text-[var(--muted-foreground)] py-0.5">
                  Select technologies below...
                </span>
              ) : (
                selectedTechObjects.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTech(t.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20"
                  >
                    <span>{t.name}</span>
                    <span className="text-zinc-500 hover:text-red-400">×</span>
                  </button>
                ))
              )}
            </div>

            {/* Search and Picker */}
            <input
              type="text"
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              placeholder="Search technologies or type custom (e.g. Bun, LangChain)..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none focus:ring-2 focus:ring-amber-500/50"
            />

            <div className="max-h-36 overflow-y-auto p-2 rounded-lg border border-[var(--border)] bg-[var(--card)]/50 flex flex-wrap gap-1.5">
              {techSearch.trim() &&
                !technologies.some(
                  (t) => t.name.toLowerCase() === techSearch.trim().toLowerCase()
                ) && (
                  <button
                    type="button"
                    onClick={handleCreateCustomTech}
                    className="text-xs px-2.5 py-1 rounded border border-dashed border-amber-500/60 bg-amber-500/10 text-amber-400 font-semibold hover:bg-amber-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>+ Add &quot;{techSearch.trim()}&quot; (Custom)</span>
                  </button>
                )}
              {technologies
                .filter((t) => t.name.toLowerCase().includes(techSearch.toLowerCase()))
                .map((t) => {
                  const isSelected = selectedTechIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTech(t.id)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-500/20 text-amber-300 font-bold"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-zinc-500"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 6. Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[var(--foreground)]">Free Tags (up to 5)</label>
              <span className="text-xs text-[var(--muted-foreground)]">{tags.length} / 5</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="e.g. open-source, full-stack, solo"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 5 || !tagInput.trim()}
                className="px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)] disabled:opacity-30"
              >
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)]"
                  >
                    <span>#{t}</span>
                    <button onClick={() => removeTag(t)} className="hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 7. Markdown Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[var(--foreground)]">Project Description (Markdown)</label>
              <div className="flex rounded-md border border-[var(--border)] bg-[var(--card)] text-xs p-0.5">
                <button
                  type="button"
                  onClick={() => setDescTab("write")}
                  className={`px-2.5 py-0.5 rounded ${descTab === "write" ? "bg-[var(--muted)] font-bold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab("preview")}
                  className={`px-2.5 py-0.5 rounded ${descTab === "preview" ? "bg-[var(--muted)] font-bold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {descTab === "write" ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Explain the architectural decisions, challenges, and implementation details using Markdown."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono text-xs focus:ring-2 focus:ring-amber-500/50 outline-none"
              />
            ) : (
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] min-h-[140px] prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {description || "*No description yet.*"}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* 8. Role and Learnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--foreground)]">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Architect & Developer"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--foreground)]">What You Learned</label>
              <input
                type="text"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="e.g. Raft consensus & distributed lock patterns"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] outline-none"
              />
            </div>
          </div>

          {/* Real-Time 5-Rule Quality HUD Panel */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-sm">🎯</span>
                <h4 className="text-sm font-bold text-[var(--foreground)]">Quality Gate HUD</h4>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
                  qualityGate.canPublish
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}
              >
                {qualityGate.satisfiedCount} of 5 Passed
              </span>
            </div>

            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  qualityGate.canPublish
                    ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                    : "bg-amber-500"
                }`}
                style={{ width: `${(qualityGate.satisfiedCount / 5) * 100}%` }}
              />
            </div>

            <ul className="text-xs space-y-2.5">
              {[
                { rule: qualityGate.rules.title, label: "Project Title specified" },
                { rule: qualityGate.rules.summary, label: "Summary under 140 characters" },
                { rule: qualityGate.rules.coverImage, label: "16:9 Cover Image stored in R2" },
                { rule: qualityGate.rules.technologies, label: "At least one technology tagged" },
                { rule: qualityGate.rules.links, label: "Live Site URL or Repository URL specified" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2.5 transition-colors duration-200 ${
                    item.rule ? "text-emerald-400 font-medium" : "text-zinc-500"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                      item.rule
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 scale-105 shadow-sm shadow-emerald-500/20"
                        : "bg-zinc-800 text-zinc-600 border border-zinc-700 scale-95"
                    }`}
                  >
                    ✓
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            {qualityGate.canPublish && (
              <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span>🚀</span>
                <span>All 5 standards met! Ready to publish to live profile.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Card & Page Preview */}
        <div
          className={`p-6 sm:p-8 space-y-8 bg-[var(--card)]/30 overflow-y-auto ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-mono text-amber-500 font-bold">
              Live Card Preview (As Seen on Profile Grid)
            </span>

            {/* Live Project Card */}
            <div className="max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-lg group">
              <div className="aspect-video w-full bg-zinc-900 border-b border-[var(--border)] flex items-center justify-center relative overflow-hidden">
                {coverUrl ? (
                  <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-500 font-mono">16:9 Cover Image Placeholder</span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-lg text-[var(--foreground)]">
                  {title || "Untitled Project"}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                  {summary || "Your summary will appear here."}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedTechObjects.slice(0, 3).map((t) => (
                    <TechBadge key={t.id} name={t.name} iconName={t.iconColor} size="sm" />
                  ))}
                  {selectedTechObjects.length > 3 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
                      +{selectedTechObjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Page Preview */}
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <span className="text-xs uppercase tracking-wider font-mono text-amber-500 font-bold">
              Live Detail Page Preview
            </span>
            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
                  {title || "Untitled Project"}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">{summary}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {liveUrl && (
                    <span className="text-xs px-3 py-1.5 rounded-md bg-amber-500 text-black font-bold">
                      Live Site ↗
                    </span>
                  )}
                  {repoUrl ? (
                    <span className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--foreground)] font-medium">
                      Source Code ↗
                    </span>
                  ) : isPrivateCode ? (
                    <span className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-400 font-medium">
                      Source code is private
                    </span>
                  ) : null}
                </div>
              </div>

              {selectedTechObjects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTechObjects.map((t) => (
                      <TechBadge key={t.id} name={t.name} iconName={t.iconColor} size="sm" />
                    ))}
                  </div>
                </div>
              )}

              {description && (
                <div className="space-y-2 border-t border-[var(--border)] pt-4">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Description</h4>
                  <div className="prose prose-invert prose-xs max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {description}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Import Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="text-base font-bold text-[var(--foreground)]">Import from Public GitHub Repos</h3>
              <button onClick={() => setGithubModalOpen(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {loadingRepos ? (
                <p className="text-center text-sm text-[var(--muted-foreground)] py-8">Loading repositories...</p>
              ) : githubRepos.length === 0 ? (
                <p className="text-center text-sm text-[var(--muted-foreground)] py-8">No public repositories found.</p>
              ) : (
                githubRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => applyGithubRepo(repo)}
                    className="p-3 rounded-lg border border-[var(--border)] hover:border-amber-500/50 hover:bg-[var(--muted)] cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--foreground)]">{repo.name}</span>
                      {repo.primaryLanguage && (
                        <span className="text-[11px] text-amber-400 font-mono">{repo.primaryLanguage}</span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{repo.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* First-Publish Success Modal */}
      {publishSuccessUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-xl border border-amber-500/30 bg-[var(--card)] p-6 space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[var(--foreground)]">Project is Live!</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Your project passed the Quality Gate and is now publicly visible.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-xs font-mono text-amber-400 break-all select-all">
              {publishSuccessUrl}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishSuccessUrl);
                  alert("Link copied!");
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs shadow-md"
              >
                Copy Link
              </button>
              <button
                onClick={() => setPublishSuccessUrl(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--foreground)]"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
