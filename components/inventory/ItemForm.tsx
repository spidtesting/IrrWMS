"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUpload } from "@/components/upload/CloudinaryUpload";

const itemFormSchema = z.object({
  itemCode: z.string().min(1).max(50),
  nameEn: z.string().min(1).max(255),
  nameSi: z.string().min(1).max(255),
  categoryId: z.string().min(1),
  warehouseId: z.string().min(1),
  supplierId: z.string().optional(),
  unit: z.string().min(1),
  unitSi: z.string().min(1),
  minStock: z.coerce.number().min(0),
  maxStock: z.coerce.number().min(0),
  reorderLevel: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

export type ItemFormProps = {
  defaultValues?: Partial<ItemFormValues>;
  categories?: { id: string; nameEn: string }[];
  warehouses?: { id: string; nameEn: string }[];
  suppliers?: { id: string; nameEn: string }[];
  onSubmit: (values: ItemFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function ItemForm({
  defaultValues,
  categories = [],
  warehouses = [],
  suppliers = [],
  onSubmit,
  isSubmitting,
}: ItemFormProps) {
  const t = useTranslations("inventory");

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      itemCode: "",
      nameEn: "",
      nameSi: "",
      categoryId: "",
      warehouseId: "",
      unit: "pcs",
      unitSi: "pcs",
      minStock: 0,
      maxStock: 0,
      reorderLevel: 0,
      unitPrice: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="itemCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("itemCode")}</FormLabel>
              <FormControl>
                <Input {...field} className="font-mono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("barcode")}</FormLabel>
              <FormControl>
                <Input {...field} className="font-mono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameEn")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameSi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameSi")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("category")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameEn}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("unitPrice")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reorderLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reorderLevel")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("image")}</FormLabel>
              <FormControl>
                <CloudinaryUpload
                  folder="irrwms/items"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveItem")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
