"use client";

import { addCollection } from "@iconify/react/offline";
import iconsBundle from "@/generated/icons.json";

let iconsLoaded = false;

interface IconsBundleShape {
  logos?: Parameters<typeof addCollection>[0];
  simpleIcons?: Parameters<typeof addCollection>[0];
}

export function initOfflineIcons() {
  if (typeof window === "undefined") return;
  if (iconsLoaded) return;
  try {
    const bundle = iconsBundle as unknown as IconsBundleShape;
    if (bundle.logos) {
      addCollection(bundle.logos);
    }
    if (bundle.simpleIcons) {
      addCollection(bundle.simpleIcons);
    }
    iconsLoaded = true;
  } catch (e) {
    console.warn("Failed to initialize offline icons", e);
  }
}
