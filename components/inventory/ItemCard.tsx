"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { formatCurrency } from "@/lib/utils/formatters";
import type { ItemDetail } from "@/types/entities";
import { StockBadge } from "./StockBadge";
import { QRCodeDisplay } from "./QRCodeDisplay";

export type ItemCardProps = {
  item: ItemDetail;
  stock?: number;
  href?: string;
};

export function ItemCard({ item, stock = 0, href }: ItemCardProps) {
  const t = useTranslations("inventory");
  const link = href ?? `/inventory/${item.id}`;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{item.itemCode}</p>
            <BilingualLabel en={item.nameEn} si={item.nameSi} className="mt-1" />
          </div>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.nameEn}
              width={48}
              height={48}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <StockBadge
          current={stock}
          min={item.minStock}
          reorderLevel={item.reorderLevel}
          unit={item.unit}
        />
        <p className="text-sm text-muted-foreground">
          {formatCurrency(Number(item.unitPrice))} / {item.unit}
        </p>
        {item.barcode && <QRCodeDisplay value={item.barcode} size={64} label={item.barcode} />}
      </CardContent>
      <CardFooter>
        <Link href={link} className="text-sm font-medium text-primary hover:underline">
          {t("viewDetails")} →
        </Link>
      </CardFooter>
    </Card>
  );
}
