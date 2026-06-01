"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GINDetail } from "@/components/goods-issued/GINDetail";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useGIN, useUpdateGINStatus } from "@/hooks/api/use-gin";
import { Button } from "@/components/ui/button";

export default function GINDetailPage() {
  const t = useTranslations("goodsIssued");
  const params = useParams();
  const id = params.id as string;
  const { data: gin, isLoading } = useGIN(id);
  const updateStatus = useUpdateGINStatus(id);

  if (isLoading) return <LoadingSkeleton rows={6} columns={4} />;
  if (!gin) return <p>{t("notFound")}</p>;

  return (
    <div>
      <PageHeader
        title={gin.ginNo}
        breadcrumbs={[{ label: t("title"), href: "/goods-issued" }, { label: gin.ginNo }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/goods-issued">{t("back")}</Link>
          </Button>
        }
      />
      <GINDetail
        gin={gin}
        isUpdating={updateStatus.isPending}
        onApprove={() =>
          updateStatus.mutate(
            { status: "APPROVED" },
            { onSuccess: () => toast.success(t("approved")) },
          )
        }
        onReject={() =>
          updateStatus.mutate(
            { status: "REJECTED" },
            { onSuccess: () => toast.success(t("rejected")) },
          )
        }
      />
    </div>
  );
}
