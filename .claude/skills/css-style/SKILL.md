---
name: css-style
description: Enforces a strict CSS style guide for all CSS output — file structure, property ordering, naming, variables, formatting, and more. Use this skill by default whenever writing, generating, editing, reviewing, or organizing CSS for any web project, website, or web application. This includes HTML files that might need CSS, React components with styling, landing pages, dashboards, or any task where CSS will be produced. Even if the user doesn't mention CSS explicitly, consult this skill whenever the output will contain CSS code.
---

# CSS Style Guide

Follow these rules whenever writing CSS. They are non-negotiable unless the user explicitly overrides them.

## File structure

Organize CSS files like this:

```
project-root/
├── index.html
├── about.html
├── styles.css              ← only @import rules, nothing else
└── css/
    ├── general.css          ← reset, element styles, general classes, layout
    ├── header.css
    ├── footer.css
    ├── forms.css
    ├── nav.css
    ├── themes/
    │   └── default.css      ← CSS custom properties only (:root { ... })
    └── pages/
        ├── index.css        ← page-specific styles for index.html
        ├── about.css        ← page-specific styles for about.html
        └── ...
```

Key rules:
- `styles.css` lives in the project root (next to the HTML files), not inside `css/`.
- `styles.css` contains **only** `@import` statements. No actual style rules.
- The theme file (`css/themes/default.css`) holds all CSS custom properties — colors, fonts, spacing tokens, etc.
- Each HTML page gets its own CSS file under `css/pages/`.
- Add component files (e.g., `cards.css`, `modal.css`) in `css/` as needed.
- Try to keep individual CSS files under ~300 lines. If a file grows larger, split it into logical parts.

Example `styles.css`:
```css
@import url('css/themes/default.css');
@import url('css/general.css');
@import url('css/header.css');
@import url('css/nav.css');
@import url('css/footer.css');
@import url('css/forms.css');
@import url('css/pages/index.css');
```

## No inline or internal CSS

Never use inline styles (`style="..."`) or internal stylesheets (`<style>` blocks inside HTML). All CSS goes in external `.css` files.

## Formatting

- Use **3 spaces** for indentation (not tabs, not 2 or 4 spaces).
- One blank line between rule blocks.
- Opening brace on the same line as the selector.
- Closing brace on its own line.
- One property per line.
- Always end properties with a semicolon.

```css
.card {
   background-color: white;
   border-radius: 4px;
   padding: 15px;
}

.card__title {
   font-size: 24px;
   font-weight: 500;
}
```

## Property ordering

Sort all properties **alphabetically** within each rule block:

```css
/* correct */
.example {
   align-items: center;
   background-color: var(--color-primary);
   display: flex;
   font-size: 16px;
   padding: 10px 20px;
}
```

## Selector ordering within a file

Order selectors by specificity, from low to high:
1. Element selectors (`body`, `h1`, `a`, ...)
2. Class selectors (`.wrapper`, `.card`, ...)
3. ID selectors (`#main`, ...)

## Naming convention: BEM

Use BEM (Block Element Modifier) as the primary naming convention:

```css
.card { }
.card__header { }
.card__footer { }
.card--featured { }
```

Other selectors (ID, contextual, pseudo-classes) are fine when they make sense — BEM is the default, not a rigid law.

## CSS custom properties (variables)

Colors, font families, and other design tokens belong in `css/themes/default.css` as CSS custom properties on `:root`:

```css
:root {
   --color-green: #3bb54a;
   --color-links-main: #3bb54a;
   --color-normal: #333;
   --color-titles: #111;
   --font-primary: Karla, Rubik, Arial;
}
```

Then reference them in other files:
```css
body {
   color: var(--color-normal);
   font-family: var(--font-primary);
}
```

Never hard-code colors or font families directly in component CSS if they could be theme variables.

## Color notation

Use **modern rgba/rgb notation** (space-separated, with `/` for alpha):

```css
/* correct */
border: 1px solid rgba(151 151 151 / 35%);
box-shadow: 0 2px 2px 0 rgba(0 0 0 / 14%);

/* wrong — legacy comma notation */
border: 1px solid rgba(151, 151, 151, 0.35);
box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14);
```

## Units

Prefer `px`, `em`, and `%`. Use `rem` only when explicitly requested.

## CSS nesting

Native CSS nesting is allowed and encouraged where it improves readability:

```css
.card {
   background-color: white;
   padding: 15px;

   &__header {
      font-size: 28px;
   }

   &:hover {
      box-shadow: 0 4px 8px rgba(0 0 0 / 20%);
   }
}
```

## Media queries

- Group media queries at the **bottom** of each CSS file.
- Use mobile-first approach: only `@media (width >= ...)`, never `max-width`.
- Sort breakpoints from small to large.

```css
/* -- all component styles above -- */

/* media queries */

@media (width >= 576px) {
   .wrapper {
      padding: 0 40px;
   }
}

@media (width >= 768px) {
   .wrapper {
      padding: 0 50px;
   }
}

@media (width >= 1200px) {
   .wrapper {
      max-width: 1300px;
   }
}
```

## Comments

Use `/* section name */` comments to separate logical sections within a file:

```css
/* elements */

* {
   box-sizing: border-box;
   margin: 0;
   padding: 0;
}

body {
   background-color: #f9f9f9;
   color: var(--color-normal);
   font-size: 18px;
}

/* classes */

.wrapper {
   margin: 0 auto;
   max-width: 1300px;
}

/* buttons */

.button {
   background-color: var(--color-green);
   cursor: pointer;
   padding: 15px 25px;
}
```

Use a file header comment at the top of each CSS file:
```css
/*
 * General styles
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */
```

## Reset

Include a minimal reset in `general.css`:

```css
* {
   box-sizing: border-box;
   margin: 0;
   padding: 0;
}
```

Additional resets (like `img { max-width: 100%; }`, list resets, etc.) can be added as element styles in `general.css`, but keep it light.

## Reference example

For a complete example of a well-formatted CSS file following these rules, see `references/example-general.css`.
