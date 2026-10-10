# 05: Sticky Floating Action Dock & Quality Gate Publishing Engine

**What to build:** A viewport-anchored frosted glass dock (`sticky bottom-6` / mobile dock) with continuous autosave feedback ("Saving...", "Saved at 12:45 PM"), a manual "Save Draft" button, and a primary "Publish" button with a real-time Quality Gate indicator (`3/5 Ready`) that transitions projects from `Draft` to `Published` upon meeting all 5 validation rules.

**Blocked by:** 04: Upload Project Studio Canvas & Live Card Preview Drawer

**Status:** ready-for-agent

- [x] Sticky bottom floating glass dock (`backdrop-blur-xl`, border glass, shadow-2xl)
- [x] Auto-save engine debounce with timestamp indicator
- [x] Manual "Save Draft" trigger with optimistic state update
- [x] Real-time Quality Gate checklist counter (`x/5 Ready`)
- [x] Quality Gate requirements popover detailing missing rules on click/hover
- [x] Primary "Publish" button active only when 5/5 satisfied
- [x] Successful publish transitions project status and redirects with toast feedback
