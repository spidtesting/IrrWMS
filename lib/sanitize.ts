import sanitizeHtmlLib from "sanitize-html";

const DEFAULT_ALLOWED_TAGS = [
  "b",
  "i",
  "em",
  "strong",
  "a",
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "span",
] as const;

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  span: ["class"],
};

export type SanitizeHtmlOptions = sanitizeHtmlLib.IOptions;

export function sanitizeHtml(input: string, options?: SanitizeHtmlOptions): string {
  return sanitizeHtmlLib(input, {
    allowedTags: [...DEFAULT_ALLOWED_TAGS],
    allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
    ...options,
  });
}

export function sanitizeText(input: string): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeOptionalText(input: string | null | undefined): string | null {
  if (input == null) {
    return null;
  }

  const sanitized = sanitizeText(input);
  return sanitized.length > 0 ? sanitized : null;
}

export function stripHtml(input: string): string {
  return sanitizeHtmlLib(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
