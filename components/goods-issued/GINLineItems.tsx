"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { GINFormValues } from "./GINForm";

export type GINLineItemsProps = {
  fields: FieldArrayWithId<GINFormValues, "lines", "id">[];
  items: { id: string; itemCode: string; nameEn: string }[];
  form: UseFormReturn<GINFormValues>;
  onRemove: (index: number) => void;
};

export function GINLineItems({ fields, items, form, onRemove }: GINLineItemsProps) {
  const t = useTranslations("goodsIssued");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{t("lineItems")}</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name={`lines.${index}.itemId`}
            render={({ field: f }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("item")}</FormLabel>
                <Select onValueChange={f.onChange} value={f.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectItem")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.itemCode} — {item.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`lines.${index}.issuedQty`}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{t("issuedQty")}</FormLabel>
                <FormControl>
                  <Input type="number" {...f} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={fields.length <= 1}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
