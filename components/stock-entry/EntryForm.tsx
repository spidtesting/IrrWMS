"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { EntryTimer } from "./EntryTimer";
import { BarcodeInput } from "./BarcodeInput";

const entrySchema = z.object({
  type: z.string().min(1),
  itemId: z.string().min(1),
  warehouseId: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().min(0).optional(),
  referenceNo: z.string().optional(),
  remarks: z.string().max(500).optional(),
  entryMethod: z.enum(["MANUAL", "BARCODE", "RFID", "BULK_IMPORT"]),
});

export type EntryFormValues = z.infer<typeof entrySchema>;

export type EntryFormProps = {
  items?: { id: string; itemCode: string; nameEn: string }[];
  warehouses?: { id: string; nameEn: string }[];
  onSubmit: (
    values: EntryFormValues & {
      entryStartTime?: string;
      entryEndTime?: string;
      entryDuration?: number;
    },
  ) => Promise<void>;
  isSubmitting?: boolean;
};

export function EntryForm({ items = [], warehouses = [], onSubmit, isSubmitting }: EntryFormProps) {
  const t = useTranslations("stockEntry");
  const startTimeRef = useRef<Date>(new Date());
  const [duration, setDuration] = useState(0);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: "STOCK_ADJUSTMENT",
      entryMethod: "MANUAL",
      quantity: 1,
    },
  });

  useEffect(() => {
    startTimeRef.current = new Date();
  }, []);

  async function handleSubmit(values: EntryFormValues) {
    const end = new Date();
    await onSubmit({
      ...values,
      entryStartTime: startTimeRef.current.toISOString(),
      entryEndTime: end.toISOString(),
      entryDuration: duration,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EntryTimer onDurationChange={setDuration} />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("type")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GOODS_RECEIVED">{t("goodsReceived")}</SelectItem>
                    <SelectItem value="GOODS_ISSUED">{t("goodsIssued")}</SelectItem>
                    <SelectItem value="STOCK_ADJUSTMENT">{t("adjustment")}</SelectItem>
                    <SelectItem value="DAMAGED">{t("damaged")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entryMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("method")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MANUAL">{t("manual")}</SelectItem>
                    <SelectItem value="BARCODE">{t("barcode")}</SelectItem>
                    <SelectItem value="RFID">RFID</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch("entryMethod") === "BARCODE" && (
          <BarcodeInput
            onItemFound={(item) => {
              form.setValue("itemId", item.id);
              form.setValue("entryMethod", "BARCODE");
              if (item.warehouseId) {
                form.setValue("warehouseId", item.warehouseId);
              }
              if (item.unitPrice !== undefined && item.unitPrice !== null) {
                form.setValue("unitPrice", Number(item.unitPrice));
              }
            }}
          />
        )}

        <FormField
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("item")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("quantity")}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
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
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("submitEntry")}
        </Button>
      </form>
    </Form>
  );
}
