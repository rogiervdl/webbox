---
name: html-style
description: Enforces a strict HTML style guide for all HTML output — file structure, formatting, semantics, forms, accessibility, and attribute ordering. Use this skill by default whenever writing, generating, editing, reviewing, or organizing HTML for any web project, website, or web application. Even if the user doesn't mention HTML explicitly, consult this skill whenever the output will contain HTML code.
---

# HTML Style Guide

Follow these rules whenever writing HTML. They are non-negotiable unless the user explicitly overrides them.

## Grouping related content

Content that belongs together must share a common parent element. Never leave related content floating outside its logical container:

```html
<!-- wrong — notice outside the form it belongs to -->
<p>Velden met een * zijn verplicht</p>
<form>
   ...
   <button type="submit">Registreren</button>
</form>

<!-- correct — notice inside the form -->
<form>
   <p>Velden met een * zijn verplicht</p>
   ...
   <button type="submit">Registreren</button>
</form>
```

## Nesting rules

Always respect HTML content models — only nest elements that are allowed inside their parent. Invalid nesting causes validation errors and unpredictable browser behaviour. When in doubt, check MDN.

Common mistakes:

```html
<!-- wrong — block elements inside <p> -->
<p><h3>Titel</h3></p>
<p><div>inhoud</div></p>
<p><ul><li>item</li></ul></p>

<!-- wrong — <a> inside <a> -->
<a href="page.html"><a href="other.html">link</a></a>

<!-- wrong — interactive elements inside <a> -->
<a href="page.html"><button>Klik hier</button></a>

<!-- wrong — <li> outside <ul> or <ol> -->
<li>item</li>
```

## Validation

All HTML must validate without errors according to the W3C validator at **validator.w3.org**. Write HTML that passes validation from the start — don't fix it afterwards.

## File structure

Organize project files like this:

```
project-root/
├── index.html
├── about.html
├── styles.css              ← only @import rules
├── css/
│   ├── general.css
│   ├── header.css
│   ├── nav.css
│   ├── footer.css
│   ├── themes/
│   │   └── default.css
│   └── pages/
│       ├── index.css
│       └── about.css
├── js/
│   ├── main.js
│   └── pages/
│       ├── index.js
│       └── about.js
└── img/
    └── ...
```

## Document structure

Every HTML file starts with this structure:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Paginatitel — Sitenaam</title>
   <link rel="stylesheet" href="styles.css">
</head>
<body>

   <header>...</header>
   <nav>...</nav>

   <main>
      ...
   </main>

   <footer>...</footer>

   <script src="js/main.js"></script>
   <script src="js/pages/index.js"></script>
</body>
</html>
```

Key rules:
- `<html>` contains exactly two children: `<head>` followed by `<body>`. Nothing else.
- Always include `<!DOCTYPE html>`.
- Always set `lang` on `<html>` with the correct language code — never leave it empty or as a placeholder. Common values: `nl` (Dutch), `en` (English), `fr` (French), `de` (German).
- Always include `meta charset` and `meta viewport`.
- CSS goes in `<head>`, JavaScript goes at the bottom of `<body>`.
- Never place text or inline content directly inside `<body>`, `<section>`, `<header>`, `<footer>`, or `<div>`. Always wrap it in a block element (`<p>`, `<h1>`–`<h6>`, `<ul>`, etc.).
- Never use `<style>` blocks or `style="..."` attributes.
- Never use `<script>` in `<head>` unless `defer` is added.

## Formatting

- Use **3 spaces** for indentation (not tabs, not 2 or 4 spaces).
- One blank line between major sections (`<header>`, `<main>`, `<footer>`, etc.).
- Two layouts are allowed — **no mix**:
  - Short content on one line: `<tag>content</tag>`
  - Multi-line content: opening and closing tag each on their own line, content indented

```html
<!-- correct — one line -->
<li><a href="index.html">Home</a></li>
<p>Een korte zin.</p>

<!-- correct — multi-line -->
<ul>
   <li>Item 1</li>
   <li>Item 2</li>
</ul>

<section>
   <h2>Titel</h2>
   <p>Inhoud van de sectie.</p>
</section>

<!-- wrong — hybrid: opening tag inline, closing tag on own line -->
<p>Een korte zin.
</p>
<ul><li>Item 1</li>
   <li>Item 2</li>
</ul>
```
- Void elements have **no closing slash**: `<br>`, `<img>`, `<input>`, `<meta>`, `<link>`, `<hr>`.
- All attribute values in **double quotes**.
- All tag names and attributes in **lowercase**.

```html
<!-- correct -->
<ul>
   <li><a href="index.html">Home</a></li>
   <li><a href="about.html">Over ons</a></li>
</ul>

<!-- wrong — uppercase, no quotes, self-closing slash -->
<UL>
   <LI><A HREF=index.html>Home</A></LI>
</UL>
<br />
<img src=foto.jpg />
```

## Attribute ordering

Use this fixed order for attributes:

1. `id`
2. `class`
3. `name`
4. `type`
5. `for` / `href` / `src` / `action` / `method`
6. `value` / `placeholder` / `alt` / `title`
7. `required` / `disabled` / `readonly` / `checked` / `selected` / `multiple`
8. `data-*`
9. `aria-*`

```html
<!-- correct -->
<input id="inp-email" class="input" name="email" type="email" placeholder="jouw@email.be" required>
<a id="lnk-more" class="button" href="about.html">Meer info</a>

<!-- wrong — random order -->
<input required placeholder="jouw@email.be" type="email" name="email" class="input" id="inp-email">
```

## Semantics

Always use the most meaningful element available. Only fall back to `<div>` or `<span>` when no semantic element fits. When in doubt, check MDN.

Common elements that are often replaced incorrectly by `<div>`, `<p>`, or `<span>`:

| Element | Use for |
|---|---|
| `<address>` | Contact information |
| `<mark>` | Highlighted or search-result text |
| `<time>` | Dates and times |
| `<abbr>` | Abbreviations |
| `<code>` | Inline code |
| `<pre>` | Preformatted / multiline code blocks |
| `<kbd>` | Keyboard input |
| `<cite>` | Title of a creative work |
| `<blockquote>` | Longer quotations |
| `<figure>` + `<figcaption>` | Image with caption |
| `<details>` + `<summary>` | Collapsible content |
| `<progress>` | Progress indicator |
| `<meter>` | Scalar measurement within a range |

```html
<!-- wrong — generic elements -->
<div>Rogier van der Linde, rogier@bitmatters.be</div>
<span class="highlight">zoekterm</span>
<span>15 mei 2026</span>

<!-- correct — semantic elements -->
<address>Rogier van der Linde, <a href="mailto:rogier@bitmatters.be">rogier@bitmatters.be</a></address>
<mark>zoekterm</mark>
<time datetime="2026-05-15">15 mei 2026</time>
```

### Page structure

A page is **structured** when it contains at least one structural element (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`, `<aside>`, `<div>`). Once structured, all of the following rules apply:

**Body children** — `<body>` contains only `<header>`, `<main>`, and `<footer>`, in that order. `<header>` and `<footer>` are shared across pages; `<main>` holds the page-specific content. Two optional extras are allowed:
- A `<div>` (banner) or `<nav>` (main menu) may appear directly after `<header>`
- A `<div>` (deurmat / doormat) may appear directly before `<footer>`

```html
<body>
   <header>...</header>
   <nav>...</nav>          <!-- optional: main navigation -->
   <div class="banner">...</div>  <!-- optional: banner -->

   <main>...</main>

   <div class="deurmat">...</div>  <!-- optional: doormat -->
   <footer>...</footer>
</body>
```

**Rules per element:**

| Element | Rule |
|---|---|
| `<header>` | Used exactly once, as a direct child of `<body>` |
| `<footer>` | Used exactly once, as a direct child of `<body>` |
| `<main>` | Used exactly once, as a direct child of `<body>` |
| `<nav>` | Used exactly once, for the main menu (if present) |
| `<aside>` | Used at most once, inside `<main>` |
| `<article>` | Never used |
| `<section>` | For the primary subdivision of `<header>`, `<main>`, or `<footer>`; further subdivisions may use `<section>` or `<div>` — nesting is allowed |
| `<div>` | Helper element only: wrappers, columns, layout groups without semantic meaning |

```html
<!-- correct -->
<main>
   <section class="hero">...</section>
   <section class="services">
      <div class="services__grid">   <!-- div for layout, not section -->
         <div class="card">...</div>
         <div class="card">...</div>
      </div>
   </section>
   <aside>...</aside>
</main>

<!-- wrong — aside outside main, nav used twice -->
<nav>...</nav>
<main>
   <section class="services">
      <section class="card">...</section>   <!-- fine: nested section is allowed -->
   </section>
</main>
<aside>...</aside>   <!-- aside must be inside main -->
<nav>...</nav>       <!-- nav used twice -->
```

### Headings

The lower the number, the more important the heading. Never skip levels.

| Level | Use |
|---|---|
| `<h1>` | Page title — **maximum one per page**, may be absent |
| `<h2>` | Main sections of the page (`<main>`, `<section>`) |
| `<h3>`, `<h4>` | Further subdivisions within a section |
| `<h4>`, `<h5>`, `<h6>` | Headings inside `<footer>`, sidebars, secondary blocks |

```html
<!-- correct -->
<main>
   <h1>Onze diensten</h1>
   <section>
      <h2>Webdesign</h2>
      <h3>Responsive design</h3>
      <h3>E-commerce</h3>
   </section>
   <section>
      <h2>Hosting</h2>
   </section>
</main>
<footer>
   <h4>Contacteer ons</h4>
   <h4>Volg ons</h4>
</footer>

<!-- wrong — skips levels, uses h2 in footer -->
<main>
   <h1>Onze diensten</h1>
   <h3>Webdesign</h3>
</main>
<footer>
   <h2>Contacteer ons</h2>
</footer>
```

### Tables

Use `<table>` only for tabular data — rows and columns of related information. Never use it for page layout; use CSS grid or flexbox instead:

Every `<th>` must have a `scope` attribute: `scope="col"` for column headers, `scope="row"` for row headers.

```html
<!-- correct — tabular data -->
<table>
   <thead>
      <tr>
         <th scope="col">Naam</th>
         <th scope="col">Prijs</th>
         <th scope="col">Voorraad</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>Product A</td>
         <td>€ 9,95</td>
         <td>42</td>
      </tr>
   </tbody>
</table>

<!-- wrong — table used for layout -->
<table>
   <tr>
      <td><nav>...</nav></td>
      <td><main>...</main></td>
   </tr>
</table>
```

### Lists

Use `<ul>` for unordered items, `<ol>` for ordered steps, `<dl>` for term/definition pairs:

```html
<ul>
   <li>Appels</li>
   <li>Peren</li>
</ul>

<ol>
   <li>Verwarm de oven voor op 180°C.</li>
   <li>Meng de ingrediënten.</li>
</ol>

<dl>
   <dt>HTML</dt>
   <dd>HyperText Markup Language</dd>
</dl>
```

Always prefer `<ul>` or `<ol>` for groups of similar elements — navigation, social links, cards, icon rows. Never use a `<p>` or `<div>` as a bare container for a group of repeated elements:

```html
<!-- wrong — group of similar links in a paragraph -->
<p>
   <a href="#" title="like ons op facebook"><img src="img/icn_fb.png" alt="facebook icon"></a>
   <a href="#" title="volg ons"><img src="img/icn_tw.png" alt="twitter icon"></a>
   <a href="#" title="bekijk ons"><img src="img/icn_yt.png" alt="youtube icon"></a>
</p>

<!-- correct — list of similar items -->
<ul>
   <li><a href="#" title="like ons op facebook"><img src="img/icn_fb.png" alt="facebook icon"></a></li>
   <li><a href="#" title="volg ons"><img src="img/icn_tw.png" alt="twitter icon"></a></li>
   <li><a href="#" title="bekijk ons"><img src="img/icn_yt.png" alt="youtube icon"></a></li>
</ul>
```

All items in a `<ul>` or `<ol>` must be of the same type — never mix linked and plain items, or items with different structures:

```html
<!-- wrong — mixed linked and plain items -->
<ul>
   <li><a href="index.html">Home</a></li>
   <li><a href="about.html">Over ons</a></li>
   <li>Contact</li>
</ul>

<!-- correct — all items have the same structure -->
<ul>
   <li><a href="index.html">Home</a></li>
   <li><a href="about.html">Over ons</a></li>
   <li><a href="contact.html">Contact</a></li>
</ul>
```

Always use `<ul>` (with CSS reset) for navigation menus.

### Links

All links and paths must be **relative**, except external links to CDNs or other websites which use `https://`. The following are never allowed:

- Absolute paths starting with `/` — e.g. `/about.html`
- `http://` links — always use `https://`
- Local file paths — e.g. `file:///C:/project/index.html` or `C:/...`

Every link must resolve correctly — no 404 errors.

```html
<!-- correct -->
<a href="about.html">Over ons</a>
<a href="../index.html">Home</a>
<img src="../img/logo.svg" alt="Logo">
<link rel="stylesheet" href="https://cdn.example.com/style.css">

<!-- wrong -->
<a href="/about.html">Over ons</a>
<a href="http://example.com">Externe site</a>
<img src="file:///C:/project/img/logo.svg" alt="Logo">
<img src="C:/project/img/logo.svg" alt="Logo">
```

Every `id` referenced by `for`, `aria-labelledby`, `aria-describedby`, or any other attribute must exist in the same document:

```html
<!-- correct — id exists -->
<label for="inp-email">E-mail</label>
<input id="inp-email" type="email">

<!-- wrong — id missing -->
<label for="inp-email">E-mail</label>
<input type="email">
```

When a project has multiple HTML pages, all references to other pages in the text must be actual links — never plain text:

```html
<!-- wrong -->
<p>Meer info vind je op de contactpagina.</p>

<!-- correct -->
<p>Meer info vind je op de <a href="contact.html">contactpagina</a>.</p>
```

Always link email addresses and phone numbers:

```html
<!-- correct -->
<a href="mailto:info@bitmatters.be">info@bitmatters.be</a>
<a href="tel:+3292345678">09 234 56 78</a>

<!-- wrong — plain text, not clickable -->
<p>info@bitmatters.be</p>
<p>09 234 56 78</p>
```

### Buttons

Always use `<button>` instead of `<input type="button">`, `<input type="submit">`, or `<input type="reset">`. `<button>` can contain HTML (icons, spans) and is easier to style:

```html
<!-- correct -->
<button type="submit">Verstuur</button>
<button type="button">Annuleer</button>

<!-- wrong -->
<input type="submit" value="Verstuur">
<input type="button" value="Annuleer">
```

### Buttons vs links

- Use `<button>` **only inside a form**, for `type="submit"` or `type="reset"`.
- Use `<a href="...">` for everything else — navigation, toggling, triggering JS actions. Style it as a button with CSS if needed.
- Never use `<button>` for navigation. Never use `<a>` without a `href`.
- `href="#"` and `href=""` are allowed as placeholders during development.

```html
<!-- correct — button inside a form -->
<form>
   ...
   <button type="submit">Verstuur</button>
</form>

<!-- correct — navigation and JS-triggered actions use <a> -->
<a href="about.html">Over ons</a>
<a href="about.html" class="button">Meer info</a>

<!-- wrong — button outside a form -->
<button type="button">Toon meer</button>

<!-- wrong — link without destination -->
<a href="#">Toon meer</a>
<a>Toon meer</a>
```

### Text

Use `<strong>` and `<em>` to mark **one or a few words** within a sentence — never a whole sentence. Never use `<b>`, `<i>`, or `<u>` — not even for styling purposes:

```html
<!-- wrong -->
<b>Belangrijk</b>
<i>cursief</i>
<u>onderstreept</u>

<!-- correct -->
<strong>Belangrijk</strong>
<em>benadrukt</em>
```

Font Awesome generates icons via `<i>` tags in its documentation — always replace these with `<span>`:

```html
<!-- wrong — Font Awesome default -->
<i class="fa-solid fa-house"></i>

<!-- correct -->
<span class="fa-solid fa-house"></span>
```

- `<strong>`: the word is spoken **louder** (important, urgent)
- `<em>`: the word is spoken **slower** (stressed, nuanced)

```html
<!-- correct -->
<p>Vergeet <strong>niet</strong> je identiteitskaart mee te brengen.</p>
<p>Ik wil <em>dit</em> boek, niet dat ene.</p>

<!-- wrong — wrapping the entire sentence -->
<strong>Vergeet niet je identiteitskaart mee te brengen.</strong>
<em>Lees de instructies zorgvuldig voor je begint.</em>
```

Use `<p>` for paragraphs. Never use `<br>` to fake paragraph spacing — use separate `<p>` elements instead. Never leave a `<p>` empty:

```html
<!-- wrong — double <br> used as paragraph separator -->
tekst
<br><br>
tekst

<!-- wrong — empty paragraph -->
<p></p>

<!-- correct -->
<p>tekst</p>
<p>tekst</p>
```

`<br>` is only allowed for line breaks that are part of the content itself, such as in poems, addresses, or lyrics.

Use `<small>` only for legal text, copyright notices, and fine print — the "small print" typically found at the bottom of the page. Use it **at most once per page**:

```html
<footer>
   <small>&copy; 2026 Bitmatters bvba — Alle rechten voorbehouden</small>
</footer>
```

Never use `<small>` just to make text visually smaller — that is a job for CSS.

Use `<address>` for the primary contact information of the site. Use it **at most once per page**, typically in `<footer>`:

```html
<footer>
   <address>
      <p>Bitmatters bvba</p>
      <p>Kerkstraat 1, 9000 Gent</p>
      <p><a href="mailto:info@bitmatters.be">info@bitmatters.be</a></p>
   </address>
</footer>
```

Use `<cite>` for the **title of a creative work** (book, painting, film, album, ...). Never use it for the name of the author or artist:

```html
<!-- correct — title of the work -->
<p><cite>De Avonden</cite> is een roman van Gerard Reve.</p>

<blockquote>
   <p>Simplicity is the ultimate sophistication.</p>
   <footer><cite>Leonardo da Vinci</cite></footer>
</blockquote>

<!-- wrong — name of the artist, not a title -->
<p>Een roman van <cite>Gerard Reve</cite>.</p>
```

Use `<blockquote>` for longer quotations — something someone said, a written excerpt, or a pull quote:

```html
<blockquote>
   <p>Design is not just what it looks like and feels like. Design is how it works.</p>
   <footer>Steve Jobs</footer>
</blockquote>
```

## Characters

Prefer literal UTF-8 characters over HTML entities. Named entities like `&reg;` are acceptable but the literal character is better. Numeric codes (`&#169;`, `&#xA9;`, ...) are never allowed:

```html
<!-- correct — literal character -->
© 2026 Bitmatters
® Bitmatters
€ 49,95
→ Meer info
😀

<!-- acceptable — named entity -->
&copy; 2026 Bitmatters
&reg; Bitmatters
&euro; 49,95

<!-- wrong — numeric codes -->
&#169; 2026 Bitmatters
&#xA9; 2026 Bitmatters
&#8364; 49,95
```

Exception: `&amp;`, `&lt;`, `&gt;`, `&quot;` must always be used when the character would otherwise be interpreted as HTML syntax.

## Forms

Only add a `name` attribute to form controls when the form submits to a real server-side script (i.e. `action` points to a `.php` or similar file). If the form is handled by JavaScript (`action=""`, `action="#"`, or no action), omit `name`:

```html
<!-- correct — server-side action, name needed -->
<form action="submit.php" method="post">
   <input id="inp-email" name="email" type="email">
</form>

<!-- correct — JS-handled form, no name -->
<form id="frm-contact">
   <input id="inp-email" type="email">
</form>

<!-- wrong — name on a JS-handled form -->
<form id="frm-contact">
   <input id="inp-email" name="email" type="email">
</form>
```

Exception: radio buttons always need `name` to group them, regardless of whether the form has a server-side action:

```html
<form id="frm-quiz">
   <input id="inp-yes" name="answer" type="radio" value="yes">
   <label for="inp-yes">Ja</label>
   <input id="inp-no" name="answer" type="radio" value="no">
   <label for="inp-no">Nee</label>
</form>
```

Every input must have a `<label>`. Two linking methods, depending on the input type:

**Regular controls** (`text`, `email`, `select`, `textarea`, ...) — link with `for` and `id`:

```html
<!-- correct -->
<label for="inp-email">E-mailadres</label>
<input id="inp-email" type="email" required>

<!-- wrong — no label, unlinked, or nested -->
<input type="email">
<label>E-mailadres</label><input type="email">
```

**Checkboxes and radio buttons** — nest the input inside the label (no `for`/`id` needed):

```html
<!-- correct -->
<label><input type="checkbox"> HTML</label>
<label><input type="checkbox"> CSS</label>

<label><input type="radio" name="gender" value="m"> Man</label>
<label><input type="radio" name="gender" value="f"> Vrouw</label>

<!-- wrong — for/id linking for checkbox or radio -->
<label for="inp-html">HTML</label>
<input id="inp-html" type="checkbox">
```

Always use the most specific `type` for inputs. `type="text"` is only allowed when no more specific type exists:

| Type | Use for |
|---|---|
| `email` | E-mailadressen |
| `tel` | Telefoonnummers |
| `url` | Weblinks |
| `number` | Numerieke waarden |
| `date` | Datums |
| `password` | Wachtwoorden |
| `search` | Zoekvelden |
| `range` | Sliders — always include `min`, `max`, and `value` |
| `checkbox` | Meerkeuze (aan/uit) |
| `radio` | Enkelvoudige keuze uit een groep |
| `file` | Bestandsupload |

```html
<!-- correct -->
<input type="email" id="inp-email">
<input type="tel" id="inp-tel">
<input type="date" id="inp-date">
<input type="range" id="sld-volume" min="0" max="100" value="50">

<!-- wrong — type="text" used where a specific type exists -->
<input type="text" id="inp-email">
<input type="text" id="inp-tel">
```

Use `<fieldset>` and `<legend>` to group related inputs:

```html
<fieldset>
   <legend>Adresgegevens</legend>
   <label for="inp-street">Straat</label>
   <input id="inp-street" name="street" type="text">
   <label for="inp-city">Stad</label>
   <input id="inp-city" name="city" type="text">
</fieldset>
```

Use native HTML attributes where appropriate — don't replicate in JavaScript what HTML already handles:

| Attribute | Use when |
|---|---|
| `required` | The field must be filled in before submitting |
| `autofocus` | The field should receive focus on page load (use once per page) |
| `placeholder` | A short hint about the expected value |
| `disabled` | The field is not interactive |
| `checked` | A checkbox or radio is selected by default |
| `selected` | An `<option>` is selected by default |
| `min` / `max` | Numeric or date bounds |
| `minlength` / `maxlength` | Text length bounds |
| `pattern` | Input must match a regular expression |

```html
<input type="email" id="inp-email" placeholder="jan@voorbeeld.be" required autofocus>
<input type="number" id="inp-age" min="0" max="120" required>

<label><input type="checkbox" checked> Nieuwsbrief ontvangen</label>

<select id="sel-country">
   <option value="">Kies een land...</option>
   <option value="be" selected>België</option>
   <option value="nl">Nederland</option>
</select>
```

In **HTML/CSS-only** work, every form — however small — must be wrapped in a `<form>` element. Form controls (`<input>`, `<select>`, `<textarea>`, `<button>`) must never appear outside a `<form>`:

```html
<!-- wrong — search input outside a form -->
<input type="search" id="search" placeholder="Zoeken...">
<button type="submit">Go</button>

<!-- correct -->
<form>
   <div>
      <label for="search">Zoeken</label>
      <input type="search" id="search" placeholder="Zoeken...">
   </div>
   <button type="submit">Go</button>
</form>
```

In **JavaScript-focused** work, this rule may be relaxed: a `<button>` may be used as a standalone action trigger without a `<form>`, and `<input>` may appear outside a `<form>` where appropriate.

Every `<form>` must have at least one `<button type="submit">`.

Form buttons:
- `<button type="submit">` to submit a form.
- `<button type="button">` for any other action inside a form (prevents accidental submit).
- `<button type="reset">` only when a reset is truly useful.

```html
<form action="..." method="post">
   ...
   <button type="submit">Verstuur</button>
   <button type="button">Annuleer</button>
</form>
```

## Accessibility

All images must be stored in an `img/` subfolder. Never reference images from the project root or other folders:

```html
<!-- correct -->
<img src="img/team.jpg" alt="Het team">
<img src="../img/logo.svg" alt="Logo">

<!-- wrong -->
<img src="team.jpg" alt="Het team">
<img src="photos/team.jpg" alt="Het team">
```

Keep image file sizes **under 2 MB**. Compress and resize images before adding them to the project — never use raw photos straight from a camera or phone.

Only use `<img>` for images that are part of the **content** — photos, illustrations, logos, diagrams. Images that serve a purely visual or decorative purpose (backgrounds, textures, dividers, icons used as decoration) belong in CSS as `background-image`:

```html
<!-- correct — content image -->
<img src="img/team.jpg" alt="Het team van Bitmatters">

<!-- wrong — decorative background in HTML -->
<img src="img/background-pattern.jpg" alt="">
```

```css
/* correct — decorative image in CSS */
.hero {
   background-image: url('../img/background-pattern.jpg');
}
```

When an image has a caption, wrap both in `<figure>` and `<figcaption>`:

```html
<figure>
   <img src="img/schaakstukken.jpg" alt="Staunton schaakstukken, 1852 Morphy serie">
   <figcaption>© Rogier van der Linde, 2020</figcaption>
</figure>
```

Never use a bare `<p>` or `<span>` as a caption next to an image.

Every `<img>` must have an `alt` attribute — always, without exception. Use a descriptive value for informative images, an empty `alt=""` for decorative ones:

```html
<!-- correct — informative image -->
<img src="img/team.jpg" alt="Het team van Bitmatters op kantoor">

<!-- correct — decorative image -->
<img src="img/divider.png" alt="">

<!-- wrong — missing alt, or meaningless value -->
<img src="img/team.jpg">
<img src="img/team.jpg" alt="afbeelding">
```

When a link contains only an image and no visible text, the link must have an accessible name. Two correct approaches:

```html
<!-- option 1 — descriptive alt on the image (simplest) -->
<a href="index.html"><img src="img/logo.svg" alt="Naar de homepage"></a>

<!-- option 2 — aria-label on the link, empty alt on the image -->
<a href="index.html" aria-label="Naar de homepage"><img src="img/logo.svg" alt=""></a>

<!-- wrong — title is not reliably announced by screen readers -->
<a href="index.html" title="Naar de homepage"><img src="img/logo.svg" alt="logo"></a>

<!-- wrong — no accessible name at all -->
<a href="index.html"><img src="img/logo.svg" alt=""></a>
```

Every form input must have an explicit `<label>` in the HTML — always, even if it is not visually shown. A `<label>` must never be empty. A `placeholder` is never a substitute for a label. If the design has no visible label, add the `<label>` anyway and hide it with CSS.

Each label/input pair is wrapped in a `<div>`. Every form has a submit button:

```html
<!-- correct -->
<form>
   <div>
      <label for="search">Zoeken</label>
      <input type="search" id="search" placeholder="Waar ben je naar op zoek?">
   </div>
   <button type="submit">Go</button>
</form>

<!-- wrong — no label, no submit button, no wrapping div -->
<form>
   <input type="search" id="search" placeholder="Waar ben je naar op zoek?">
</form>
```

Use `aria-*` attributes only when no native HTML element or attribute provides the same semantics:

```html
<!-- correct — native element handles semantics -->
<button type="button">Menu</button>

<!-- correct — aria needed for dynamic state -->
<button type="button" aria-expanded="false">Menu</button>

<!-- wrong — div pretending to be a button -->
<div role="button" aria-label="Menu">Menu</div>
```

## Classes and IDs

Never add `class` or `id` attributes that are not used anywhere — not in CSS, not in JavaScript. Every class and id must serve a purpose:

```html
<!-- wrong — class and id that are never used -->
<section id="section1" class="content">
   <h2 class="title">Onze diensten</h2>
</section>

<!-- correct — only add class/id when CSS or JS actually uses it -->
<section>
   <h2>Onze diensten</h2>
</section>
```

## Comments

Use comments to mark major sections in longer HTML files:

```html
<!-- header -->
<header>
   ...
</header>

<!-- navigation -->
<nav>
   ...
</nav>

<!-- main content -->
<main>
   ...
</main>
```

Don't comment obvious markup. Keep comments short.

## Reference examples

- `references/example.html` — contact page with form, labels, fieldsets, and semantic structure
- `references/example-layout.html` — classic blog layout demonstrating full page structure: wrapper div, header, nav, main with nested sections and aside, footer
