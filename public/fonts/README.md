# Noto Sans Sinhala Font

IrrWMS uses **Noto Sans Sinhala** for proper Sinhala (සිංහල) text rendering in PDF reports and the UI.

## Download

1. Visit [Google Fonts — Noto Sans Sinhala](https://fonts.google.com/noto/specimen/Noto+Sans+Sinhala)
2. Download the font family (Regular 400, Medium 500, SemiBold 600, Bold 700)
3. Place the `.woff2` files in this directory:

```
public/fonts/
  NotoSansSinhala-Regular.woff2
  NotoSansSinhala-Medium.woff2
  NotoSansSinhala-SemiBold.woff2
  NotoSansSinhala-Bold.woff2
```

## Alternative (npm)

```bash
npm install @fontsource/noto-sans-sinhala
```

Then import in `app/globals.css`:

```css
@import "@fontsource/noto-sans-sinhala/400.css";
@import "@fontsource/noto-sans-sinhala/700.css";
```

## Usage

Fonts are referenced in `lib/pdf/fonts.ts` for jsPDF report generation and via Tailwind `font-sinhala` in `tailwind.config.ts`.

## License

Noto Sans Sinhala is licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).
