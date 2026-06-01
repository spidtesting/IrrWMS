import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

let configured = false;

function ensureCloudinaryConfig(): boolean {
  if (configured) return true;
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  return true;
}

export type UploadOptions = {
  folder?: string;
  publicId?: string;
  tags?: string[];
  resourceType?: "image" | "raw" | "auto";
};

export type UploadResult = {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
};

export async function uploadFile(
  file: Buffer | string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  if (!ensureCloudinaryConfig()) {
    throw new Error("Cloudinary is not configured");
  }
  const folder = options.folder ?? "irrwms";
  const resourceType = options.resourceType ?? "auto";

  try {
    const result = await cloudinary.uploader.upload(
      typeof file === "string"
        ? file
        : `data:application/octet-stream;base64,${file.toString("base64")}`,
      {
        folder,
        public_id: options.publicId,
        tags: options.tags,
        resource_type: resourceType,
      },
    );

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    logger.error({ err: error, folder }, "Cloudinary upload failed");
    throw error;
  }
}

export async function uploadImage(
  file: Buffer | string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  return uploadFile(file, { ...options, resourceType: "image" });
}

export async function deleteFile(publicId: string): Promise<void> {
  if (!ensureCloudinaryConfig()) {
    throw new Error("Cloudinary is not configured");
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error({ err: error, publicId }, "Cloudinary delete failed");
    throw error;
  }
}

export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  },
): string {
  if (!ensureCloudinaryConfig()) {
    return publicId;
  }
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: options?.crop ?? "limit",
        quality: options?.quality ?? "auto",
        fetch_format: options?.format ?? "auto",
      },
    ],
  });
}

export function getThumbnailUrl(publicId: string, size = 150): string {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
  });
}

export async function uploadDamageReportImages(
  files: Array<Buffer | string>,
  reportId: string,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index]!;
    const result = await uploadImage(file, {
      folder: `irrwms/damage-reports/${reportId}`,
      publicId: `${reportId}_${index + 1}`,
      tags: ["damage-report", reportId],
    });
    results.push(result);
  }

  return results;
}
