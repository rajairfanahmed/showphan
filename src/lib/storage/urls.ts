export const publicR2Url =
  process.env.NEXT_PUBLIC_R2_URL || "";

export function getCoverImageUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("blob:") ||
    key.startsWith("data:")
  ) {
    return key;
  }
  const cleanKey = key.replace(/^\/+/, "");
  if (publicR2Url) {
    return `${publicR2Url.replace(/\/+$/, "")}/${cleanKey}`;
  }
  return `/api/storage/${cleanKey}`;
}
