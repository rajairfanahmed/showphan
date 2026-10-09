import { NextResponse } from "next/server";

export async function GET() {
  const fallbackStars = 142;

  try {
    const res = await fetch("https://api.github.com/repos/rajairfanahmed/showphan", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Showphan-App",
      },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const data = await res.json();
      const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : fallbackStars;
      return NextResponse.json(
        {
          stars,
          formatted: stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : `${stars}`,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
          },
        }
      );
    }
  } catch {}

  return NextResponse.json(
    {
      stars: fallbackStars,
      formatted: `${fallbackStars}`,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  );
}
