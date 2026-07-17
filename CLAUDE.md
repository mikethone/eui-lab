# EUI Lab — Claude Instructions

This is a React + Vite learning lab for Elastic UI (EUI) v113 with the Borealis theme and a custom PM brand theme. All UI work should use EUI components and PM theme tokens. Do not introduce custom components, utility CSS classes, or new colors when an EUI equivalent exists.

---

## Two zones — target state vs. faithful mirror

This repo has two distinct kinds of code. Know which zone a file is in before editing:

1. **Target-state pages (default zone)** — everything outside `src/proxies/`. This is idiomatic EUI: all the rules below apply. This is "what good looks like."
2. **Proxy zone (`src/proxies/`)** — faithful mirrors of production `Pm*` components from `../propertymeld`, built for design examination on the Component Proxies page (`/proxies`). **The idiom rules below DO NOT apply here.** Proxies intentionally reproduce prod's actual choices — inline styles, hardcoded colors/spacing, non-idiomatic patterns, even shipped bugs — because their job is to show what prod really renders, not to be correct EUI. Do not "fix" a proxy to comply with lab rules; that would make it lie about the source. Each proxy's header comment logs what was removed (dependency noise) and which rule deviations are faithful-to-prod. Mirrored prod tokens live in `src/proxies/_pmSourceTokens.js` and must not leak into target-state pages.

**Theme isolation.** Proxy specimens must render in *prod's* theme, not the lab's. Prod runs `<EuiProvider theme={EuiThemeBorealis} modify={overrides}>` (theme-overrides.ts); the lab runs `modify={pmTheme}` (euiTheme.js) — near-twins that drift. `src/proxies/_pmProdTheme.js` mirrors prod's `overrides` verbatim and is applied via a nested `<EuiThemeProvider modify={pmProdTheme}>` wrapped around each proxy's **live render only** on the Component Proxies page. Keep `_pmProdTheme.js` in sync with prod's theme-overrides.ts, NOT with euiTheme.js. Prod's `<GlobalStyles/>` is Chakra-compat CSS and is irrelevant to `Pm*` rendering — do not mirror it.

The value of the repo is the **diff** between these two zones — current state next to target state — for understanding the `Pm*` layer and influencing it toward EUI adoption.

---

## Stack

- **EUI**: `@elastic/eui` v113, Borealis theme (default — no `theme` prop needed on `EuiProvider`)
- **Theme override**: `src/theme/euiTheme.js` — `pmTheme` passed to `<EuiProvider modify={pmTheme}>`
- **Application tokens**: `src/theme/tokens.js` — `priorityColors`, `badgeColors`, `GenericStatusBadgeProps`, layout constants
- **Framework**: React (JSX), Vite, no TypeScript
- **Styling**: Emotion via EUI's `css` prop + `useEuiTheme()` hook — no Tailwind, no CSS modules, no raw `style` objects except for one-off layout values

---

## Component hierarchy — check these before writing custom JSX

When building UI, resolve ambiguity by reaching for EUI components in this order:

### Page structure
- `EuiPageTemplate` with `.Header`, `.Section`, `.Sidebar` sub-components
- `EuiPageTemplate.Section grow={false}` to prevent flex-expanding sections
- `BackNav` (`src/components/BackNav.jsx`) for breadcrumb navigation at the top of every page
- `EuiBottomBar` for bulk actions that appear conditionally (place after closing `</EuiPageTemplate>` in a fragment)

### Layout
- `EuiFlexGroup` + `EuiFlexItem` for horizontal and vertical flex layouts
- `EuiFlexGrid columns={n}` for fixed-column grids (home page cards, token swatches)
- `EuiSpacer` for vertical rhythm — never use margin on EUI components directly
- `EuiHorizontalRule` for section dividers

### Content
- `EuiText` for body copy — use `size` prop (`xs`, `s`, `m`) instead of custom font sizes
- `EuiTitle` for headings — always wrap a semantic element: `<EuiTitle size="m"><h2>...</h2></EuiTitle>`
- `EuiPanel` with `hasBorder` or `color` prop for content cards
- `EuiCard` for navigable/actionable card tiles (home page pattern)
- `EuiDescriptionList` for key/value pairs
- `EuiBadge` for status and label chips

### Forms
- `EuiForm` + `EuiFormRow` for all form fields — never omit `EuiFormRow` labels
- `EuiDescribedFormGroup` for sectioned forms with left-side descriptions
- Field components: `EuiFieldText`, `EuiFieldNumber`, `EuiFieldSearch`, `EuiSelect`, `EuiComboBox`, `EuiTextArea`, `EuiRadioGroup`, `EuiSwitch`, `EuiDatePicker`
- `EuiSwitch` state should show/hide related fields — see `MeldFormPage` for the pattern

### Tables and lists
- `EuiBasicTable` for data tables — define `columns` array with `render` functions
- `EuiListGroup` for menu-style vertical lists with `isActive` and `toolTipText`
- Bulk selection: checkbox column in `EuiBasicTable`, count shown in `EuiBottomBar`

### Filtering and search
- `EuiFilterGroup` + `EuiFilterButton` for toggle-style filters
- `EuiPopover` + `EuiPopoverTitle` + `EuiPopoverFooter` for multi-field filter panels
- `EuiFieldSearch` for text search
- `EuiSuperDatePicker` for date range selection
- Deferred-commit pattern: maintain `draftFilters` / `appliedFilters` state pairs so the popover can be edited without live-filtering until Apply is clicked — see `MeldsListPage`

### Controls
- `EuiButton` (fill, default, empty variants) — use `color` prop, never custom background
- `EuiButtonEmpty` for low-emphasis actions
- `EuiButtonGroup` for segmented controls
- `EuiButtonIcon` for icon-only actions

---

## Color rules — no new colors

**Never introduce a hex value that isn't already in `euiTheme.js` or `tokens.js`.**

Resolve colors through `useEuiTheme()`:

```js
const { euiTheme } = useEuiTheme();
```

| Use case | Token |
|---|---|
| Page / panel background | `euiTheme.colors.emptyShade` |
| Subdued background | `euiTheme.colors.backgroundBaseSubdued` |
| Primary tint background | `euiTheme.colors.backgroundBasePrimary` |
| Default border | `euiTheme.colors.borderBasePlain` |
| Primary border | `euiTheme.colors.borderStrongPrimary` |
| Body text | `euiTheme.colors.textParagraph` |
| Subdued text | `euiTheme.colors.textSubdued` |
| Heading text | `euiTheme.colors.textHeading` |
| Primary text / links | `euiTheme.colors.textPrimary` |
| Success / danger / warning | `euiTheme.colors.success` / `.danger` / `.warning` |
| Priority colors | `priorityColors.low/medium/high/emergency` from `tokens.js` |
| Badge colors | `badgeColors.light.*` or `badgeColors.dark.*` from `tokens.js` |
| Status badge presets | `GenericStatusBadgeProps.*` from `tokens.js` |

If a design uses a color that doesn't map to any of the above, ask before adding a new token — it is almost always a mapping question, not a new color.

---

## Typography rules

- Font family is set globally via `pmTheme` — do not set `fontFamily` in component styles
- Use `EuiText size="xs|s|m"` for body copy — do not set `fontSize` manually
- Use `EuiTitle size="xxxs|xxs|xs|s|m|l"` for headings
- When you must set font size manually (e.g. a swatch label), derive it from the theme: `euiTheme.font.scale[key] * euiTheme.base`
- Line height formula when needed: `Math.floor(Math.round(sizePx * multiplier) / 4) * 4` where multiplier = `1.5` for sizes ≤ 16px, `1.5 × 0.833` for sizes > 16px

---

## Spacing rules

- Use `EuiSpacer size="xs|s|m|l|xl|xxl"` between vertical elements
- Use `gutterSize` prop on `EuiFlexGroup` / `EuiFlexGrid` for gaps
- Use `paddingSize` prop on `EuiPanel`, `EuiPopover`, `EuiPageTemplate.Section`
- If you must use a numeric spacing value, derive it from `euiTheme.size.*` (base unit is 16px)
- Never hardcode pixel values for margin or padding in `style` props

---

## Ambiguity resolution — the 15% rule

When a design is close to but not exactly matching an EUI component:

1. **Use the EUI component.** Do not create a custom component to achieve pixel-perfect fidelity with a design that is 15% or less off from an EUI pattern.
2. **Use the nearest theme token.** Do not add a new color or spacing value to match a design exactly — map it to the closest existing token.
3. **Flag it, don't fix it.** If a design genuinely requires something outside EUI's vocabulary, note it explicitly rather than silently introducing a one-off. The right resolution is a conversation, not a workaround.

---

## Existing archetypes — reference before inventing

| Pattern | File |
|---|---|
| List page with filters, sort, bulk actions | `src/pages/MeldsListPage.jsx` |
| Form page with conditional fields | `src/pages/MeldFormPage.jsx` |
| Home page with card grid | `src/App.jsx` |
| Breadcrumb nav component | `src/components/BackNav.jsx` |
| Design token showcase | `src/pages/TokensPage.jsx` |

When building a new page, identify which archetype it most resembles and extend that pattern rather than starting from scratch.

---

## What to avoid

- `className` strings with custom CSS — use `css` prop with Emotion instead
- Inline `style` objects for anything other than one-off layout overrides
- Raw `<div>` or `<span>` when an EUI layout primitive exists
- Hardcoded colors, font sizes, or spacing values
- New files in `src/theme/` without discussion — the token surface is intentionally stable
- `!important` in any style
