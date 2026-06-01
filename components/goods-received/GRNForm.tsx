"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRNLineItems } from "./GRNLineItems";

const grnFormSchema = z.object({
  supplierId: z.string().min(1),
  warehouseId: z.string().min(1),
  poId: z.string().optional(),
  receivedDate: z.string().optional(),
  remarks: z.string().max(500).optional(),
  lines: z
    .array(
      z.object({
        itemId: z.string().min(1),
        orderedQty: z.coerce.number().min(0),
        receivedQty: z.coerce.number().positive(),
        unitPrice: z.coerce.number().min(0),
      }),
    )
    .min(1),
});

export type GRNFormValues = z.infer<typeof grnFormSchema>;

export type GRNFormProps = {
  suppliers?: { id: string; nameEn: string }[];
  warehouses?: { id: string; nameEn: string }[];
  items?: { id: string; itemCode: string; nameEn: string }[];
  onSubmit: (values: GRNFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function GRNForm({
  suppliers = [],
  warehouses = [],
  items = [],
  onSubmit,
  isSubmitting,
}: GRNFormProps) {
  const t = useTranslations("goodsReceived");

  const form = useForm<GRNFormValues>({
    resolver: zodResolver(grnFormSchema),
    defaultValues: {
      lines: [{ itemId: "", orderedQty: 0, receivedQty: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("supplier")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSupplier")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nameEn}
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
            name="warehouseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("warehouse")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectWarehouse")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("remarks")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <GRNLineItems fields={fields} items={items} form={form} onRemove={remove} />

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ itemId: "", orderedQty: 0, receivedQty: 1, unitPrice: 0 })}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("addLine")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("createGRN")}
        </Button>
      </form>
    </Form>
  );
}
