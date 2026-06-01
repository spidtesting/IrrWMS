"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GRNDetail } from "@/components/goods-received/GRNDetail";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useGRN, useUpdateGRNStatus } from "@/hooks/api/use-grn";
import { Button } from "@/components/ui/button";

export default function GRNDetailPage() {
  const t = useTranslations("goodsReceived");
  const params = useParams();
  const id = params.id as string;
  const { data: grn, isLoading } = useGRN(id);
  const updateStatus = useUpdateGRNStatus(id);

  if (isLoading) return <LoadingSkeleton rows={6} columns={4} />;
  if (!grn) return <p>{t("notFound")}</p>;

  return (
    <div>
      <PageHeader
        title={grn.grnNo}
        breadcrumbs={[{ label: t("title"), href: "/goods-received" }, { label: grn.grnNo }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/goods-received">{t("back")}</Link>
          </Button>
        }
      />
      <GRNDetail
        grn={grn}
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
