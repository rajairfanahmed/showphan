"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");
  const [searchVisible, setSearchVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
      return;
    }
    if (session?.user) {
      let isMounted = true;
      fetch("/api/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.user) {
            setDisplayName(data.user.displayName || data.user.name || "");
            setBio(data.user.bio || "");
            setSlug(data.user.slug || "");
            setSearchVisible(data.user.searchVisible ?? true);
          }
        })
        .catch((err) => console.error(err));
      return () => {
        isMounted = false;
      };
    }
  }, [isPending, session, router]);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          searchVisible,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        alert("Failed to save settings.");
      }
    } catch {
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== slug) {
      alert("Entered username does not match your slug.");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (res.ok) {
        await signOut();
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to delete account.");
      }
    } catch {
      alert("Error deleting account.");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-[var(--muted)] rounded w-1/3" />
        <div className="h-64 bg-[var(--muted)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
      <div className="pb-4 border-b border-[var(--border)]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Customize your profile details, manage theme, and configure search engine visibility.
        </p>
      </div>

      {/* Profile Details Section */}
      <section className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Profile Information</h2>

        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--foreground)]">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--foreground)]">Short Bio</label>
              <span className="text-xs text-[var(--muted-foreground)]">{bio.length} / 160</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              rows={3}
              placeholder="Tell visitors about your background, what you build, and what you're looking for."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Profile Slug (Read-Only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--foreground)]">Profile URL</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[var(--border)] bg-zinc-900/50 text-sm font-mono text-zinc-400 select-all">
              <span>https://showphan.vercel.app/</span>
              <span className="text-amber-400 font-bold">{slug}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Your profile slug is permanent to ensure shared links on resumes and social posts never break.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold text-sm shadow-md transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {savedSuccess && <span className="text-xs text-emerald-400 font-medium">Saved successfully! ✓</span>}
        </div>
      </section>

      {/* Preferences Section */}
      <section className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Preferences</h2>

        {/* Search Engine Switch */}
        <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
          <div className="space-y-0.5 max-w-md">
            <label className="text-sm font-semibold text-[var(--foreground)] block">
              Show my profile in search engines
            </label>
            <p className="text-xs text-[var(--muted-foreground)]">
              When switched off, your profile and projects will carry noindex tags and be excluded from sitemaps.
            </p>
          </div>
          <input
            type="checkbox"
            checked={searchVisible}
            onChange={(e) => setSearchVisible(e.target.checked)}
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-[var(--foreground)] block">Theme Selection</span>
            <p className="text-xs text-[var(--muted-foreground)]">Toggle between Dark, Light, or System default.</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Danger Zone: Account Deletion */}
      <section className="p-6 rounded-xl border border-red-900/40 bg-red-950/10 space-y-4">
        <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Deleting your account will permanently remove all your project entries, database records, and stored cover images from Cloudflare R2. This action cannot be undone.
        </p>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="px-4 py-2 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
        >
          Delete Account
        </button>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-[var(--card)] p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Permanently delete account?</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Please type your username <strong className="text-amber-400">&quot;{slug}&quot;</strong> to confirm account deletion.
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={slug}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== slug || deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white text-xs font-bold shadow-md"
              >
                {deleting ? "Deleting..." : "Confirm & Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
