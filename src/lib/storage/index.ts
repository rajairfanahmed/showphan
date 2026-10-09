import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { publicR2Url, getCoverImageUrl } from "./urls";

export { publicR2Url, getCoverImageUrl };

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

export async function createPresignedCoverUpload(
  userId: string,
  mimeType: string,
  fileSize: number
) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(mimeType)) {
    throw new Error("INVALID_FILE_TYPE: Only WebP, PNG, and JPEG images are allowed.");
  }

  if (fileSize > 1048576) {
    throw new Error("FILE_TOO_LARGE: Cover image must be smaller than 1MB.");
  }

  const timestamp = Date.now();
  const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "webp";
  const key = `covers/${userId}/${timestamp}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  return { uploadUrl, key };
}

export async function deleteCoverImageFromR2(key: string) {
  if (!key) return;
  try {
    const cleanKey = key.replace(/^https?:\/\/[^/]+\//, "");
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error(`Failed to delete R2 object with key ${key}:`, error);
  }
}
