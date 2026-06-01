import type { jsPDF } from "jspdf";

export const PDF_FONTS = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  italic: "Helvetica-Oblique",
  mono: "Courier",
} as const;

export const PDF_COLORS = {
  primary: [0, 102, 51] as [number, number, number],
  secondary: [51, 51, 51] as [number, number, number],
  muted: [128, 128, 128] as [number, number, number],
  border: [200, 200, 200] as [number, number, number],
  headerBg: [240, 248, 244] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
} as const;

export const PDF_MARGINS = {
  top: 20,
  right: 15,
  bottom: 20,
  left: 15,
} as const;

export const PDF_PAGE = {
  width: 210,
  height: 297,
} as const;

export function applyDefaultFont(doc: jsPDF, variant: keyof typeof PDF_FONTS = "regular"): void {
  doc.setFont(PDF_FONTS[variant], variant === "bold" ? "bold" : "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.secondary);
}

export function setPrimaryColor(doc: jsPDF): void {
  doc.setTextColor(...PDF_COLORS.primary);
}

export function drawHorizontalRule(doc: jsPDF, y: number): void {
  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(PDF_MARGINS.left, y, PDF_PAGE.width - PDF_MARGINS.right, y);
}

export function getContentWidth(): number {
  return PDF_PAGE.width - PDF_MARGINS.left - PDF_MARGINS.right;
}

export function truncateForPdf(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1)}…`;
}

export const ORGANIZATION = {
  nameEn: "Department of Irrigation — Sri Lanka",
  nameSi: "සංවර්ධන ජල සම්පත් හා ජලාපවහන දепාර්තමේන්තුව",
  address: "No. 11, Rajamalwatta Road, Battaramulla, Sri Lanka",
  phone: "+94 11 288 5861",
  email: "info@irrigation.gov.lk",
  website: "www.irrigation.gov.lk",
} as const;
