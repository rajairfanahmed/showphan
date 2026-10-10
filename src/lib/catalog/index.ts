import { prisma } from "@/lib/prisma";
import { CATALOG_TECHNOLOGIES } from "./technologies";

export * from "./technologies";
export * from "./icons";

export async function getTechnologies() {
  try {
    const list = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });
    // If database has 0 or fewer than our catalog, merge or return our rich catalog
    if (list.length >= CATALOG_TECHNOLOGIES.length) {
      return list;
    }
    // Return CATALOG_TECHNOLOGIES which has 115+ verified developer icons
    return CATALOG_TECHNOLOGIES;
  } catch {
    return CATALOG_TECHNOLOGIES;
  }
}
