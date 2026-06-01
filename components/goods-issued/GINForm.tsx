"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GINLineItems } from "./GINLineItems";

const ginFormSchema = z.object({
  warehouseId: z.string().min(1),
  issuedToId: z.string().min(1),
  remarks: z.string().max(500).optional(),
  lines: z
    .array(
      z.object({
        itemId: z.string().min(1),
        requestedQty: z.coerce.number().min(0),
        issuedQty: z.coerce.number().positive(),
      }),
    )
    .min(1),
});

export type GINFormValues = z.infer<typeof ginFormSchema>;

export type GINFormProps = {
  warehouses?: { id: string; nameEn: string }[];
  staff?: { id: string; fullNameEn: string }[];
  items?: { id: string; itemCode: string; nameEn: string }[];
  onSubmit: (values: GINFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function GINForm({
  warehouses = [],
  staff = [],
  items = [],
  onSubmit,
  isSubmitting,
}: GINFormProps) {
  const t = useTranslations("goodsIssued");

  const form = useForm<GINFormValues>({
    resolver: zodResolver(ginFormSchema),
    defaultValues: {
      lines: [{ itemId: "", requestedQty: 0, issuedQty: 1 }],
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

          <FormField
            control={form.control}
            name="issuedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("issuedTo")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStaff")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.fullNameEn}
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

        <GINLineItems fields={fields} items={items} form={form} onRemove={remove} />

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ itemId: "", requestedQty: 0, issuedQty: 1 })}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("addLine")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("createGIN")}
        </Button>
      </form>
    </Form>
  );
}
