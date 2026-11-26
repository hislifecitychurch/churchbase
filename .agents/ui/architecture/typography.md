# Typography

## Families

Churchbase uses one type family by default: Geist Sans. Hierarchy comes from size, spacing, and color, not from switching families.

| Token            | Utility        | Family      | Use                                        |
| ---------------- | -------------- | ----------- | ------------------------------------------ |
| `--font-sans`    | `font-sans`    | Geist Sans  | Everything by default                      |
| `--font-heading` | `font-heading` | Geist Sans  | Headings that need an explicit family      |
| `--font-serif`   | `font-serif`   | Geist Serif | Deliberate accent only, such as a wordmark |
| `--font-mono`    | `font-mono`    | Geist Mono  | Code, identifiers, and aligned figures     |

`--font-sans` and `--font-heading` both resolve to Geist Sans. The serif face is loaded for deliberate display moments; do not use it as the default heading family. Geist Mono is for code and tabular alignment only, not for emphasis.

Do not set `font-family` in a component. Use the utilities above.

## Weight

Use `font-normal` (400) as the default and `font-medium` (500) as the maximum.

Never use `font-semibold` (600), `font-bold` (700), `font-extrabold` (800), `font-black` (900), or an arbitrary weight. This ceiling applies to headings, labels, buttons, and body copy alike.

Build hierarchy with size and color instead of weight:

```tsx
<h1 className="text-foreground text-2xl font-normal">Churchbase</h1>
<p className="text-muted-foreground text-sm">A shared foundation for church teams.</p>
```

## Sizes

| Utility     | Px  | Use                                      |
| ----------- | --- | ---------------------------------------- |
| `text-xs`   | 12  | Metadata, captions, dense helper text    |
| `text-sm`   | 14  | Default UI copy, labels, supporting text |
| `text-base` | 16  | Prose and touch-first form controls      |
| `text-lg`   | 18  | Section headings and emphasized copy     |
| `text-xl`   | 20  | Page headings                            |
| `text-2xl`  | 24  | Auth and marketing wordmarks             |
| `text-3xl`  | 30  | Rare display headings                    |

Keep body copy at `text-sm` in dense application UI and `text-base` for reading prose. Do not go below `text-xs`.

## Tracking and wrapping

- The root layout applies `tracking-tight` to `<body>`, so every screen inherits it. Do not re-add `tracking-tight` in individual components.
- Do not tighten display serif or large headings further; negative tracking closes up serif letterforms.
- Use `text-balance` on headings and short paragraphs so line breaks stay even.
- Use `text-pretty` on longer body copy to avoid orphans.
- Keep prose near 65 characters per line with `max-w-prose` or a narrower column.

## Document titles

`createMetadata` in `packages/metadata` sets the template `%s · Churchbase`, using a middle dot with spaces. A page provides only its own name:

```ts
export const metadata: Metadata = {
  title: "Log in",
}
```

This renders `Log in · Churchbase`. Do not include the product name in a page title, and do not replace the separator with a hyphen, pipe, or em dash.

## Verification

- Headings use `font-normal` or `font-medium` only.
- Supporting copy uses `text-muted-foreground`, not a lighter weight.
- No component overrides the font family.
- Page titles rely on the shared template and read `Page · Churchbase`.
