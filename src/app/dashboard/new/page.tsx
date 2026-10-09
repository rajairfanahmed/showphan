"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function createDraft() {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Untitled Project" }),
        });
        if (res.ok) {
          const data = await res.json();
          router.replace(`/dashboard/project/${data.project.id}/edit`);
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      }
    }
    createDraft();
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--muted-foreground)]">Initializing new project draft...</p>
      </div>
    </div>
  );
}
