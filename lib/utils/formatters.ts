import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

const LKR_FORMATTER = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-LK", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const PERCENT_FORMATTER = new Intl.NumberFormat("en-LK", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(
  value: number | string | { toString(): string },
  locale = "en-LK",
): string {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(num)) return "LKR 0.00";
  if (locale === "si-LK") {
    return `රු. ${NUMBER_FORMATTER.format(num)}`;
  }
  return LKR_FORMATTER.format(num);
}

export function formatQuantity(value: number, unit?: string): string {
  const formatted = NUMBER_FORMATTER.format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatPercent(value: number, decimals = 1): string {
  if (decimals === 1) return PERCENT_FORMATTER.format(value / 100);
  return new Intl.NumberFormat("en-LK", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string | null | undefined,
  pattern = "dd MMM yyyy",
): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, pattern);
}

export function formatDateTime(
  date: Date | string | null | undefined,
  pattern = "dd MMM yyyy HH:mm",
): string {
  return formatDate(date, pattern);
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function formatDurationSeconds(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  if (minutes < 60) return `${minutes}m ${remaining}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function formatDocumentNo(prefix: string, sequence: number, padLength = 5): string {
  return `${prefix}-${String(sequence).padStart(padLength, "0")}`;
}

export function formatBilingual(
  nameEn: string,
  nameSi: string,
  locale: "en" | "si" = "en",
): string {
  return locale === "si" ? nameSi : nameEn;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function formatEmployeeId(id: string): string {
  return id.toUpperCase();
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}
