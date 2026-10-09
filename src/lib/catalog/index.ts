import { prisma } from "@/lib/prisma";

export async function getTechnologies() {
  return prisma.technology.findMany({
    orderBy: { name: "asc" },
  });
}
