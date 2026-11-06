# Spacing

Churchbase does not define a custom spacing scale. Spacing comes from Tailwind's default scale, where one unit is `0.25rem` (4px). The number in the class multiplied by 4 gives pixels.

## Scale

| Class | Px  | Class | Px  |
| ----- | --- | ----- | --- |
| `0.5` | 2   | `6`   | 24  |
| `1`   | 4   | `8`   | 32  |
| `1.5` | 6   | `10`  | 40  |
| `2`   | 8   | `12`  | 48  |
| `2.5` | 10  | `16`  | 64  |
| `3`   | 12  | `20`  | 80  |
| `3.5` | 14  | `24`  | 96  |
| `4`   | 16  |       |     |
| `5`   | 20  |       |     |

The same numbers apply to every spacing property: `gap-*`, `p*`, `m*`, `space-*`, and `size-*`.

## House defaults

`gap-2` (8px) and `gap-4` (16px) carry most of `packages/ui-w/`. Use them first:

- `gap-2` for label-to-control, icon-to-text, and button groups.
- `gap-4` for stacks of fields, list items, and card grids.

The scale is continuous at 4px, but the house rhythm is 8px-based. `gap-5` (20px) and `gap-7` (28px) are valid Tailwind steps and off that rhythm; use them only for a deliberate value, never as a default. `gap-2` and `gap-4` cover nearly all shared-library and App spacing.

## Rhythm by context

| Context                      | Class                  | Px    |
| ---------------------------- | ---------------------- | ----- |
| Label to control             | `gap-2`                | 8     |
| Between form fields          | `gap-4`                | 16    |
| Last field to primary action | `gap-5` / `gap-6`      | 20–24 |
| Primary action to link       | `gap-3` / `gap-4`      | 12–16 |
| Icon to text                 | `gap-1.5` / `gap-2`    | 6–8   |
| Button group / toolbar       | `gap-2`                | 8     |
| Card padding                 | `p-4` → `p-6`          | 16–24 |
| Card grid                    | `gap-4 sm:gap-6`       | 16–24 |
| Section rhythm               | `py-12 sm:py-20`       | 48–80 |
| Page gutter                  | `px-4 sm:px-6`         | 16–24 |
| Touch target                 | `min-h-11` / `size-11` | 44    |

## Rules

- Use Tailwind spacing classes. Do not add arbitrary values such as `mt-[18px]`, inline styles, or one-off CSS when a scale step exists.
- Start mobile-first and add a `sm:` step for gutters and section padding; do not carry a desktop-only value down to a phone.
- Prefer `gap-*` on a flex or grid container over `space-y-*`. Use `flex flex-col gap-4` rather than `space-y-4`.
- Keep margin use directional and intentional (`mt-2`, `mb-4`). Avoid using margins to fake a container gap.
- Keep one vertical rhythm per screen. Do not alternate 12px and 20px between the same kind of element.
- Keep a visual group to roughly three spacing values so the eye can read the hierarchy.
- Use `max-w-xs` (320px) to `max-w-sm` (384px) for a single-column form, and give it a centered container.
- Reserve at least `min-h-11` (44px) for interactive controls on coarse pointers. `packages/ui-w` primitives expose this through `pointer-coarse`; custom clickable elements must add it themselves.
- Do not rely on spacing alone to separate destructive actions from safe ones. Use a variant, a divider, or a confirmation step.

## Verification

Check the rendered page at a phone width (390px) and a desktop width (1440px). Confirm:

- Gutters and section padding step up at `sm`.
- Field stacks and action gaps read as one rhythm.
- No interactive target falls below 44px on touch.
- No arbitrary spacing values were introduced.
