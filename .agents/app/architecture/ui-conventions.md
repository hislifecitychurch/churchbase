# UI conventions

## Buttons

`Button` defaults to `variant="default"`, the primary action. Use it for the main action on a screen.

| Action                        | Variant                  |
| ----------------------------- | ------------------------ |
| Primary submit or confirm     | `default`                |
| Deliberately brand-emphasized | `branding`, sparingly    |
| Secondary action              | `secondary` or `outline` |
| Tertiary or navigational      | `link` or `ghost`        |
| Destructive                   | `destructive`            |
| Destructive, lower emphasis   | `destructive-outline`    |

Do not use `variant="branding"` by default. Reserve it for an action that should carry the brand. Routine controls such as `Continue` use `default`.

Use `size="lg"` for the primary action on a standalone auth or form screen. `Button` already expands its hit area to 44px on coarse pointers; do not add a separate transparent target.

## Forms

- Compose with `Field`, `FieldLabel`, and `Input` from `@packages/ui-w`.
- Every control keeps an accessible name. A label may be visually hidden with `sr-only` when a placeholder carries the visible hint, but the `FieldLabel` and its `htmlFor` stay in the DOM. A placeholder is not a label because it disappears once the field is filled.
- Use `size="lg"` for fields in a standalone form. Use `nativeInput` when the implementation needs a plain `<input>` element.
- Mark required fields with `required`; do not rely on color or an asterisk alone.
- Give each field an `autoComplete` value (`email`, `current-password`, `new-password`, and similar).

## Tokens and theme

- Use semantic utilities: `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border`, `text-destructive`. Do not use raw hex values or `text-black`/`text-white`.
- Dark is the default theme; light mode is available through the theme provider. Both are driven by a class on `<html>`, so check both when adding a color that is not already tokenized.
- Keep contrast readable at `text-muted-foreground`; do not use it for essential instructions.
- Use the shared radius scale (`rounded-xl` and similar) rather than a new value.

## Verification

Run the smallest relevant checks for App changes:

```sh
bunx prettier --check <changed-files>
cd apps/app && bunx tsc --noEmit
bun run --cwd apps/app build
```

`apps/app` currently has no `lint` or `check-types` script, so call `tsc` directly. For a visual change, also load the route at a phone width and a desktop width and confirm the layout at both.
