"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadSignature } from "@/hooks/api/use-settings";

export type CloudinaryUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  className?: string;
};

export function CloudinaryUpload({
  value,
  onChange,
  folder = "irrwms/uploads",
  accept = "image/*",
  className,
}: CloudinaryUploadProps) {
  const t = useTranslations("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getSignature = useUploadSignature();

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const sig = await getSignature.mutateAsync({ folder });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.apiKey);
        formData.append("timestamp", String(sig.timestamp));
        formData.append("signature", sig.signature);
        formData.append("folder", folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          { method: "POST", body: formData },
        );

        if (!response.ok) throw new Error("Upload failed");

        const result = (await response.json()) as { secure_url: string };
        onChange(result.secure_url);
      } catch {
        setError(t("uploadFailed"));
      } finally {
        setUploading(false);
      }
    },
    [folder, getSignature, onChange, t],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Uploaded"
            width={120}
            height={120}
            className="rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-8 transition hover:border-primary/50 hover:bg-muted/50">
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">{t("clickToUpload")}</span>
            </>
          )}
        </label>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
