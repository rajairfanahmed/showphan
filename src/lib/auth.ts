import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "https://showphan.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://showphan.vercel.app",
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_SITE_URL || "",
  ].filter(Boolean),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      mapProfileToUser: (profile) => {
        const cleanSlug = (profile.login || "")
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "");
        return {
          slug: cleanSlug || `user-${Date.now().toString(36)}`,
          githubId: String(profile.id),
          displayName: profile.name || profile.login,
          bio: profile.bio ? profile.bio.slice(0, 160) : undefined,
          avatarUrl: profile.avatar_url,
        };
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userAny = user as { slug?: string; name?: string; email?: string };
          const existingSlug = userAny.slug;
          // Clean slug derived without inserting dashes between words in name
          const nameClean = (user.name || "dev")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          const emailClean = user.email
            ? user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "")
            : "";
          const fallbackSlug = nameClean || emailClean || `dev-${Date.now().toString(36)}`;
          return {
            data: {
              ...user,
              slug: existingSlug || fallbackSlug,
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      githubId: {
        type: "string",
        required: false,
        input: false,
      },
      slug: {
        type: "string",
        required: false,
        input: false,
      },
      displayName: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
      avatarUrl: {
        type: "string",
        required: false,
        input: false,
      },
      searchVisible: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
  },
});
