import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { env } from "@/config/env";
import { successResponse } from "@/lib/api-response";
import { AppError } from "@/lib/error-handler";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";
import { uploadFile } from "@/lib/cloudinary";

const signedUploadQuerySchema = z.object({
  folder: z.string().max(100).optional(),
  publicId: z.string().max(100).optional(),
});

const uploadBodySchema = z.object({
  file: z.string().min(1),
  folder: z.string().max(100).optional(),
  publicId: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  resourceType: z.enum(["image", "raw", "auto"]).optional(),
});

function requireCloudinaryConfig() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError("Cloudinary is not configured", {
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE",
    });
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  };
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { cloudName, apiKey, apiSecret } = requireCloudinaryConfig();
    const { searchParams } = request.nextUrl;
    const query = signedUploadQuerySchema.parse({
      folder: searchParams.get("folder") ?? undefined,
      publicId: searchParams.get("publicId") ?? undefined,
    });

    const timestamp = Math.round(Date.now() / 1000);
    const folder = query.folder ?? "irrwms";
    const params: Record<string, string | number> = {
      timestamp,
      folder,
    };

    if (query.publicId) {
      params.public_id = query.publicId;
    }

    const signature = cloudinary.utils.api_sign_request(params, apiSecret);

    return successResponse({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder,
      ...(query.publicId ? { publicId: query.publicId } : {}),
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    requireCloudinaryConfig();
    const body = uploadBodySchema.parse(await request.json());

    const result = await uploadFile(body.file, {
      folder: body.folder ?? `irrwms/users/${user.id}`,
      publicId: body.publicId,
      tags: body.tags,
      resourceType: body.resourceType,
    });

    return successResponse(result, { status: 201, message: "File uploaded" });
  } catch (error) {
    return handleApiError(error);
  }
}
