---
name: js-style
description: Enforces a strict JavaScript style guide for all JS output — file structure, formatting, naming, variables, functions, DOM manipulation, events, and more. Use this skill by default whenever writing, generating, editing, reviewing, or organizing JavaScript for any web project, website, or web application. This includes HTML files with inline scripts (move them to external files), vanilla JS DOM manipulation, and any task where JavaScript will be produced. Even if the user doesn't mention JavaScript explicitly, consult this skill whenever the output will contain JS code.
---

# JavaScript Style Guide

Follow these rules whenever writing JavaScript. They are non-negotiable unless the user explicitly overrides them.

## File structure

Organize JavaScript files like this:

```
project-root/
├── index.html
├── about.html
├── styles.css
├── css/
│   └── ...
└── js/
    ├── main.js              ← shared logic, loaded on every page
    ├── utils.js             ← reusable helper functions
    └── pages/
        ├── index.js         ← page-specific logic for index.html
        ├── about.js         ← page-specific logic for about.html
        └── ...
```

Key rules:
- All JavaScript lives in the `js/` folder, never inline in HTML.
- `main.js` contains logic shared across all pages (e.g. navigation, theme).
- Each HTML page loads its own `js/pages/<page>.js` for page-specific behavior.
- Reference scripts at the bottom of `<body>`, with `defer` or just before `</body>`.
- Add component files (e.g. `js/carousel.js`, `js/modal.js`) as needed.
- Try to keep individual JS files under ~200 lines. Split into logical parts if larger.

Example script tags in HTML:
```html
<script src="js/main.js"></script>
<script src="js/pages/index.js"></script>
```

## Script file layout

Every script file follows this fixed order:

1. **Regular declarations** — constants and variables
2. **DOM declarations** — references to HTML elements
3. **Regular functions** — non-handler logic
4. **Event handler functions** — functions called by event listeners
5. **Event bindings** — the `addEventListener` calls

Use uppercase section headers with a separator line:

```js
/*
 * Page script
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

// constanten en variabelen
const MAX_ATTEMPTS = 3;
let score = 0;
let answers = [];

// DOM
const frm1 = document.querySelector('...');
const lnkFilter = document.querySelector('...');
const btnAdd = document.querySelector('...');

// FUNCTIES
// ========

// gewone functies
function calculateScore(answ) {
   ...
}

function generateNumbers() {
   ...
}

// event handlers
function handleFormSubmit(e) {
   // ...code handling form submit
}

function handleLnkFilterClick(e) {
   // ...code handling link click
}

function handleBtnAddClick(e) {
   // ...code handling button click
}

// EVENTS
// ======

frm1.addEventListener('submit', handleFormSubmit);
lnkFilter.addEventListener('click', handleLnkFilterClick);
btnAdd.addEventListener('click', handleBtnAddClick);
```

Name event handlers `handle` + element name + event: `handleBtnAddClick`, `handleFrm1Submit`, `handleInpNameChange`.

## No inline or internal JavaScript

Never use inline event handlers (`onclick="..."`) or internal scripts (`<script>` blocks in HTML). All JavaScript goes in external `.js` files.

## Formatting

- Use **3 spaces** for indentation (not tabs, not 2 or 4 spaces).
- Always end statements with a **semicolon**.
- Maximum **one statement per line**.
- One blank line between logical blocks or function definitions. Never two consecutive blank lines.
- Opening brace on the same line as the statement.
- Closing brace on its own line.
- **Always write braces**, even for single-line blocks.
- Spaces before and after operators (`+`, `-`, `=`, `===`, `>`, etc.).
- No space before a semicolon or inside parentheses.

```js
// correct
function showMessage(name) {
   const greeting = 'Hello, ' + name;
   console.log(greeting);
}

// wrong — missing braces, missing spaces around operator
if (x>0) console.log(x);

// correct
if (x > 0) {
   console.log(x);
}
```

## Quotes

Use **single quotes** for strings:

```js
// correct
const name = 'Alice';
const selector = '.card__title';

// wrong
const name = "Alice";
```

Use **template literals** (backticks) whenever a string contains a variable or expression. Never use `+` for string concatenation:

```js
// correct
const message = `Hello, ${name}!`;
const url = `${baseUrl}/users/${id}`;
el.textContent = `Score: ${score} / ${max}`;

// wrong — no + concatenation
const message = 'Hello, ' + name + '!';
const url = baseUrl + '/users/' + id;
```

Use single quotes only for plain string literals with no interpolation:

```js
// correct
const label = 'Submit';
const selector = '.card__title';
```

## Variables

Always use `const` or `let`. Never use `var`:

```js
// correct
const MAX_RETRIES = 3;
let count = 0;

// wrong
var count = 0;
```

Prefer `const` by default. Only use `let` when the value will be reassigned:

```js
const button = document.querySelector('.button');   // won't be reassigned → const
let isOpen = false;                                  // will be toggled → let
```

## Naming conventions

| What | Convention | Example |
|---|---|---|
| Variables and functions | camelCase | `getUserName`, `berekenGemiddelde` |
| Classes | PascalCase | `UserCard`, `ModalDialog` |
| Constants (fixed values) | UPPER_SNAKE_CASE | `MAX_WIDTH`, `API_URL` |
| HTML element references | Hungarian + camelCase | `btnOk`, `lblBericht`, `inpName` |
| Private class fields | `#camelCase` | `#isOpen`, `#data` |
| Files | kebab-case | `user-card.js`, `modal-dialog.js` |

Common Hungarian prefixes for HTML element references:

| Prefix | Element |
|---|---|
| `btn` | `<button>` |
| `inp` | `<input>` |
| `sel` | `<select>` |
| `txt` | `<textarea>` |
| `lbl` | `<label>` |
| `frm` | `<form>` |
| `img` | `<img>` |
| `lnk` | `<a>` |
| `sld` | `<input type="range">` |

```js
// correct
const btnSubmit = document.querySelector('#btn-submit');
const inpEmail = document.querySelector('#inp-email');
const selLanguage = document.querySelector('#sel-language');

// wrong — no prefix, unclear what type of element it is
const submit = document.querySelector('#btn-submit');
const email = document.querySelector('#inp-email');
```

Functions and methods start with a **verb**:

```js
// correct
function berekenGemiddelde(values) { ... }
function drukMenu() { ... }
function showError(msg) { ... }

// wrong — not a verb
function gemiddelde(values) { ... }
function menu() { ... }
```

Boolean variables and functions start with a verb form that implies true/false:

```js
// correct
let isVisible = true;
let bevatKlinker = false;
function isEven(n) { ... }
function hasChildren(el) { ... }

// wrong
let visible = true;
function even(n) { ... }
```

**Choose one language** (English or Dutch) and use it consistently throughout the entire file. Don't mix.

## Operators

Always use **strict equality** (`===` and `!==`). Never use loose equality (`==` or `!=`):

```js
// correct
if (count === 0) { ... }
if (name !== '') { ... }

// wrong — loose equality ignores type
if (count == 0) { ... }
if (name != '') { ... }
```

Never compare against `true` or `false` explicitly — use the value directly:

```js
// correct
if (isValid) { ... }
if (!isValid) { ... }

// wrong
if (isValid == true) { ... }
if (isValid === false) { ... }
```

Use the **ternary operator** instead of `if/else` when the result is a single value being assigned or returned:

```js
// correct
parMessage.textContent = success ? 'gelukt' : 'mislukt';
const label = isLoggedIn ? 'Afmelden' : 'Aanmelden';
return count > 0 ? count : 0;

// wrong — if/else just to assign one value
if (success == true) {
   parMessage.textContent = 'gelukt';
} else {
   parMessage.textContent = 'mislukt';
}
```

Use `if/else` when the branches contain multiple statements or side effects.

## Magic numbers

Never use unexplained numeric literals in logic. Extract them as named constants:

```js
// correct
const MAX_ATTEMPTS = 3;
const ANIMATION_MS = 300;

if (attempts > MAX_ATTEMPTS) { ... }
setTimeout(hide, ANIMATION_MS);

// wrong — what do 3 and 300 mean here?
if (attempts > 3) { ... }
setTimeout(hide, 300);
```

## Functions

Use **regular function declarations** for named top-level functions:

```js
// correct
function toggleMenu() {
   ...
}
```

Use **arrow functions** for callbacks (e.g. `forEach`, `map`, `filter`):

```js
// correct
items.forEach(item => {
   item.classList.add('active');
});

const doubles = numbers.map(n => n * 2);
```

Avoid arrow functions as top-level declarations unless there is a specific reason:

```js
// avoid for named top-level functions
const toggleMenu = () => { ... };
```

## Pure functions

Regular functions (everything except event handlers) should be as **pure** as possible: they receive data through parameters and return a result. They do not read from or write to the DOM directly.

```js
// correct — pure: input via parameter, output via return value
function formatQuote(text) {
   return text.trim();
}

function filterByCategory(items, category) {
   return items.filter(item => item.category === category);
}

// wrong — impure: reads and writes DOM directly
function showFilteredItems() {
   const category = selCats.value;              // DOM read
   const filtered = items.filter(...);
   lstItems.innerHTML = filtered.map(...);      // DOM write
}
```

The event handler is the only place where DOM values are read and passed into pure functions, and where return values are handed off to display logic:

```js
// correct — handler bridges DOM and pure functions
async function handleBtnGoClick() {
   const quote = await fetchRandom(selCats.value);   // read DOM here, pass as argument
   displayQuote(quote);                               // receive result, write to DOM here
}
```

**API functions in particular must always be pure.** They take parameters, fetch data, and return it — nothing else. They never touch the DOM:

```js
// correct — fetches data, returns it, no DOM
async function fetchRandom(category) {
   const url = category
      ? `https://api.example.com/jokes/random?category=${category}`
      : 'https://api.example.com/jokes/random';
   try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.value;
   } catch {
      return null;
   }
}

// wrong — API function writes to DOM
async function fetchAndShowRandom(category) {
   const resp = await fetch(`https://api.example.com/jokes/random?category=${category}`);
   const data = await resp.json();
   spnQuote.textContent = data.value;    // DOM write — never in an API function
}
```

Keeping functions pure makes them easy to move into separate files (`api.js`, `utils.js`) and later into modules.

## Async / await

Always use `async`/`await` for asynchronous code. Never use `.then()`, `.catch()`, or `.finally()`:

```js
// correct
async function fetchRandom(category) {
   try {
      const resp = await fetch(url);
      const data = await resp.json();
      return data.value;
   } catch {
      return null;
   }
}

// wrong — no promise chains
function fetchRandom(category) {
   return fetch(url)
      .then(resp => resp.json())
      .then(data => data.value)
      .catch(() => null);
}
```

## Nesting

Avoid excessive nesting. Use early returns and guard clauses to keep the happy path at the lowest indentation level:

```js
// correct — early return eliminates nesting
function processOrder(order) {
   if (!order) return;
   if (!order.items.length) return;

   const total = calculateTotal(order.items);
   submitOrder(total);
}

// wrong — unnecessary deep nesting
function processOrder(order) {
   if (order) {
      if (order.items.length) {
         const total = calculateTotal(order.items);
         submitOrder(total);
      }
   }
}
```

## DOM selection

Use **only** `querySelector` and `querySelectorAll` for selecting elements. Never use `getElementById`, `getElementsByClassName`, `getElementsByTagName`, or any other selector method:

```js
// correct
const nav = document.querySelector('.nav');
const cards = document.querySelectorAll('.card');
const form = document.querySelector('#contact-form');

// wrong
const form = document.getElementById('contact-form');
const cards = document.getElementsByClassName('card');
const items = document.getElementsByTagName('li');
```

Cache DOM references in `const` variables at the top of your scope — don't query the DOM repeatedly:

```js
// correct
const btnNavToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

function handleBtnNavToggleClick() {
   navMenu.classList.toggle('nav__menu--open');
}

btnNavToggle.addEventListener('click', handleBtnNavToggleClick);

// wrong — querying inside the handler on every click
document.querySelector('.nav__toggle').addEventListener('click', handleBtnNavToggleClick);
```

## DOM manipulation

Use CSS classes and `classList` to apply or remove styles. Never manipulate `el.style` directly unless the value is dynamic and continuous (e.g. a slider position, a calculated pixel value):

```js
// correct — toggle a class defined in CSS
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('open');
el.classList.contains('disabled');

// correct — continuous value from a slider, no class can represent this
el.style.width = `${sldRange.value}px`;

// wrong — hardcoded styles belong in CSS, not JS
el.style.color = 'red';
el.style.display = 'none';
el.style.fontWeight = 'bold';

// wrong — never assign className directly
el.className = 'active';
```

Use `textContent` for plain text, `innerHTML` only when HTML markup is required:

```js
// correct — plain text
title.textContent = 'New title';

// correct — markup needed
container.innerHTML = '<strong>Important</strong>';

// wrong — security risk, use textContent when no markup is needed
title.innerHTML = userInput;
```

## Navigation

Never use `history.back()`. It depends on the browser history and breaks when the user navigates directly to the page. Use an explicit URL instead:

```js
// wrong
history.back();

// correct
location.href = 'index.html';
```

## Dialogs

Never use `alert`, `prompt`, or `confirm`. They block the browser and are not styleable. Use DOM-based alternatives (custom modals, inline messages, form validation feedback) instead:

```js
// wrong — never
alert('Opgeslagen!');
const name = prompt('Jouw naam?');
if (confirm('Verwijderen?')) { ... }

// correct — update the DOM instead
lblStatus.textContent = 'Opgeslagen!';
```

## Event handling

Always use `addEventListener` with a **separate named handler function**. Never pass an inline arrow function or anonymous function as the handler:

```js
// correct
btnToggle.addEventListener('click', handleBtnToggleClick);

// wrong — never inline
btnToggle.addEventListener('click', () => {
   ...
});
```

Name handler functions `handle` + element name (PascalCase) + event name (PascalCase):

```js
// correct
function handleBtnToggleClick() { ... }
function handleFrm1Submit(e) { ... }
function handleInpNameChange(e) { ... }
function handleSldVolumeInput(e) { ... }

// wrong — missing "handle", wrong casing, or event name omitted
function toggle() { ... }
function onSubmit() { ... }
function btnClick() { ... }
```

Never use deprecated APIs or events. When in doubt, check MDN. Common examples to avoid:

| Deprecated | Use instead |
|---|---|
| `keypress` event | `keydown` or `keyup` |
| `document.write()` | DOM manipulation |
| `XMLHttpRequest` | `fetch` |
| `substr()` | `slice()` or `substring()` |
| `eval()` | — (no alternative, redesign the logic) |

```js
// correct
el.addEventListener('keydown', handleElKeydown);
const text = str.slice(2, 5);
const resp = await fetch(url);

// wrong
el.addEventListener('keypress', handleElKeypress);
const text = str.substr(2, 3);
const xhr = new XMLHttpRequest();
```

Never use inline handlers or `on*` properties:

```js
// wrong
btnToggle.onclick = handleBtnToggleClick;
btnToggle.setAttribute('onclick', 'handleBtnToggleClick()');
```

## Preventing default behavior

Call `e.preventDefault()` to suppress the browser's default action for forms and links when you handle them yourself:

```js
// correct — prevent form submission and page reload
function handleFrm1Submit(e) {
   e.preventDefault();
   // handle form data manually
}

// correct — prevent link navigation
function handleLnkMoreClick(e) {
   e.preventDefault();
   toggleDetails();
}
```

Always place `e.preventDefault()` at the very top of the handler, before any other logic.

## data-* attributes

Use `data-*` attributes to store metadata on HTML elements. Always read and write them via `dataset`, never via `getAttribute` or `setAttribute`:

```html
<button class="btn-delete" data-id="42" data-confirm="true">Verwijder</button>
```

```js
// correct
function handleBtnDeleteClick(e) {
   const id = e.currentTarget.dataset.id;
   const needsConfirm = e.currentTarget.dataset.confirm === 'true';
}

// wrong
function handleBtnDeleteClick(e) {
   const id = e.currentTarget.getAttribute('data-id');
   const needsConfirm = e.currentTarget.getAttribute('data-confirm') === 'true';
}
```

Don't store state in global variables when it belongs on the element itself.

## console.log

Remove all `console.log` calls before submitting or publishing code. Use them freely during development, but treat them as temporary scaffolding:

```js
// wrong — never leave these in finished code
console.log('score:', score);
console.log(e);
```

## Comments

Use `//` for single-line comments. Use `/* ... */` only for multi-line blocks or file headers.

Write inline comments only when the **why** is non-obvious — a hidden constraint, a workaround, or surprising behavior. Don't describe what the code clearly does on its own.

Use **JSDoc** to document all non-trivial functions:

```js
/**
 * Calculates the average of an array of numbers.
 *
 * @param {number[]} values - Array of numeric values
 * @returns {number} The arithmetic mean, or 0 for an empty array
 */
function berekenGemiddelde(values) {
   if (values.length === 0) return 0;
   return values.reduce((sum, v) => sum + v, 0) / values.length;
}
```

Use a file header comment at the top of each JS file:

```js
/*
 * Main script
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */
```

Use section comments to separate logical blocks within a file:

```js
/* event listeners */

button.addEventListener('click', handleClick);

/* helpers */

function handleClick(e) {
   ...
}
```

## API calls

Always use `URLSearchParams` to build query strings, never manual string concatenation:

```js
// correct
const params = new URLSearchParams({ category: 'food', limit: 10 });
const resp = await fetch(`${BASE_URL}/jokes?${params}`);

// wrong
const resp = await fetch(`${BASE_URL}/jokes?category=food&limit=10`);
const resp = await fetch(`${BASE_URL}/jokes?category=${category}&limit=${limit}`);
```

For authentication, prefer a **bearer token** over an API key, and pass it in the **request header** rather than as a query parameter:

```js
// correct — bearer token in header
const resp = await fetch(url, {
   headers: {
      Authorization: `Bearer ${token}`,
   },
});

// acceptable if the API only supports API keys — still prefer header
const resp = await fetch(url, {
   headers: {
      'X-Api-Key': apiKey,
   },
});

// wrong — credentials in query string (visible in logs and browser history)
const resp = await fetch(`${url}?api_key=${apiKey}`);
```

## Error handling

Only add `try/catch` at system boundaries: `fetch`, `JSON.parse`, `localStorage`, or other external APIs. Don't wrap internal logic in try/catch.

```js
// correct
async function loadData(url) {
   try {
      const response = await fetch(url);
      return await response.json();
   } catch (error) {
      console.error('Failed to load data:', error);
   }
}

// wrong — internal logic doesn't need try/catch
function calculateTotal(items) {
   try {
      return items.reduce((sum, item) => sum + item.price, 0);
   } catch (error) {
      console.error(error);
   }
}
```

## Reference examples

- `references/example-main.js` — complete script file with declarations, functions, handlers and event bindings
- `references/example-api.js` — pure API functions: fetch data, return it, no DOM access
