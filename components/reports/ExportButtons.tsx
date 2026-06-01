"use client";

import { useTranslations } from "next-intl";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  downloadBlob,
  exportToCsv,
  exportToExcelBuffer,
  buildExportFileName,
  type ExportColumn,
} from "@/lib/utils/export";

export type ExportButtonsProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: ExportColumn<T>[];
  filePrefix: string;
  onPrint?: () => void;
};

export function ExportButtons<T extends Record<string, unknown>>({
  data,
  columns,
  filePrefix,
  onPrint,
}: ExportButtonsProps<T>) {
  const t = useTranslations("reports");

  function handleCsv() {
    const csv = exportToCsv(data, columns);
    downloadBlob(csv, buildExportFileName(filePrefix, "csv"), "text/csv");
  }

  function handleExcel() {
    const buffer = exportToExcelBuffer(data, columns);
    downloadBlob(
      new Uint8Array(buffer),
      buildExportFileName(filePrefix, "xlsx"),
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  }

  function handlePrint() {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleCsv}>
        <Download className="mr-2 h-4 w-4" />
        {t("exportCsv")}
      </Button>
      <Button variant="outline" size="sm" onClick={handleExcel}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        {t("exportExcel")}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        {t("print")}
      </Button>
    </div>
  );
}
