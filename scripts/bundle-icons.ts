import fs from "node:fs";
import path from "node:path";
import type { IconifyJSON } from "@iconify/types";
import { getIcons, minifyIconSet } from "@iconify/utils";
import logosJson from "@iconify-json/logos/icons.json";
import simpleIconsJson from "@iconify-json/simple-icons/icons.json";
import { CATALOG_TECHNOLOGIES } from "../src/lib/catalog/technologies";

function bundleIcons() {
  console.log("📦 Extracting offline Iconify SVG bundle...");

  const logoNames = new Set<string>();
  const simpleIconNames = new Set<string>();

  for (const tech of CATALOG_TECHNOLOGIES) {
    if (tech.iconColor && tech.iconColor.startsWith("logos:")) {
      logoNames.add(tech.iconColor.replace("logos:", ""));
    } else if (tech.iconColor && tech.iconColor.startsWith("simple-icons:")) {
      simpleIconNames.add(tech.iconColor.replace("simple-icons:", ""));
    }
    if (tech.iconMono && tech.iconMono.startsWith("simple-icons:")) {
      simpleIconNames.add(tech.iconMono.replace("simple-icons:", ""));
    }
  }

  // Extract from logos
  const extractedLogos = getIcons(logosJson as unknown as IconifyJSON, Array.from(logoNames));
  if (extractedLogos) minifyIconSet(extractedLogos);

  // Extract from simple-icons
  const extractedSimple = getIcons(simpleIconsJson as unknown as IconifyJSON, Array.from(simpleIconNames));
  if (extractedSimple) minifyIconSet(extractedSimple);

  const bundle = {
    logos: extractedLogos,
    simpleIcons: extractedSimple,
  };

  const outputDir = path.resolve(process.cwd(), "src/generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "icons.json");
  fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2), "utf8");

  const fileSizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`✅ Offline icon bundle created at src/generated/icons.json (${fileSizeKb} KB)`);
}

bundleIcons();
