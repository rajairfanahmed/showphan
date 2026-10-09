export const publicR2Url =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.CLOUDFLARE_R2_PUBLIC_URL ||
  "https://pub-7951652fb9484b909e8f3989e79f7111.r2.dev";

export function getCoverImageUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  const baseUrl = publicR2Url.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${baseUrl}/${cleanKey}`;
}
