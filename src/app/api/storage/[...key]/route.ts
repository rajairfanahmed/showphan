import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const accountId =
  process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
const accessKeyId =
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
const bucketName =
  process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.R2_BUCKET || "showphan";

const s3Client = new S3Client({
  region: "auto",
  endpoint: accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : "https://dummy.r2.cloudflarestorage.com",
  credentials:
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyParts } = await params;
    if (!keyParts || keyParts.length === 0) {
      return new NextResponse("Key required", { status: 400 });
    }

    const key = keyParts.join("/");

    // 1. Try local disk fallback first (development or local uploads)
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const localFilePath = path.join(process.cwd(), "public", key);
      const fileData = await fs.readFile(localFilePath);
      const ext = path.extname(key).toLowerCase();
      const mime =
        ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".png"
          ? "image/png"
          : "image/webp";

      return new NextResponse(fileData, {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Not on local disk, proceed to R2
    }

    // 2. Fetch from Cloudflare R2 bucket if credentials exist
    if (accessKeyId && secretAccessKey && !accessKeyId.includes("your-")) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (response.Body) {
        const byteArray = await response.Body.transformToByteArray();
        return new NextResponse(Buffer.from(byteArray), {
          headers: {
            "Content-Type": response.ContentType || "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
            ...(response.ETag && { ETag: response.ETag }),
          },
        });
      }
    }

    return new NextResponse("Image not found", { status: 404 });
  } catch (err: unknown) {
    logger.warn("Failed to retrieve image from storage", { error: err });
    return new NextResponse("Image not found", { status: 404 });
  }
}
