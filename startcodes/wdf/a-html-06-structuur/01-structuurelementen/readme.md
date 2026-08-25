## Theorie

Met structuurelementen deel je een pagina op in logische delen. De browser en hulpsoftware (zoals schermlezers) begrijpen zo hoe de pagina in elkaar zit.

- `<header>` – de paginakop (logo, titel, hoofdmenu) – één keer, bovenaan de `<body>`
- `<nav>` – het hoofdmenu met de navigatielinks
- `<main>` – de eigenlijke pagina-inhoud – precies één per pagina
- `<section>` – een afgebakend onderdeel binnen de inhoud, meestal met een eigen titel
- `<aside>` – zijinhoud die niet tot de hoofdlijn hoort (nieuws, tips…), binnen de `<main>`
- `<footer>` – de paginavoet (contact, copyright) – één keer, onderaan de `<body>`
- `<div>` – hulpelement zonder betekenis, om iets te groeperen (bv. voor layout)
- `<span>` – hulpelement zonder betekenis om een stukje *tekst* af te bakenen

`<article>` gebruik je in dit vak **niet**.

## Opdracht

De inhoud staat er al: jij plaatst er enkel de structuurelementen rond. Elk element krijgt via de CSS een eigen achtergrondkleur en een labeltje, zodat je meteen ziet of je goed gestructureerd hebt.

1. Zet de titel *Studio Lumen* en het menu samen in een `<header>`.
2. Zet het menu (de `<ul>` met links) in een `<nav>`.
3. Zet alle inhoud tussen de header en de contactgegevens in één `<main>`.
4. Zet *Welkom* en *Onze diensten* elk in een eigen `<section>`.
5. Groepeer de twee diensten (Branding en Webdesign) elk in een `<div>`.
6. Zet *Nieuws* in een `<aside>`, binnen de `<main>`.
7. Zet de contactregel en de copyrightregel samen in een `<footer>`.
8. Zet in de welkomsttekst de naam *Studio Lumen* in een `<span>`.
9. Gebruik nergens `<article>`.

Klopt je structuur? Dan kleuren alle delen mooi in en staat het juiste labeltje bij elk element.

## Te bereiken structuur

```
┌ header ────────────────────┐
│  Studio Lumen              │
│  ┌ nav ──────────────────┐ │
│  │  Home  Werk  Contact  │ │
│  └───────────────────────┘ │
└────────────────────────────┘
┌ main ──────────────────────┐
│  ┌ section ──────────────┐ │
│  │  Welkom               │ │
│  └───────────────────────┘ │
│  ┌ section ──────────────┐ │
│  │  Onze diensten        │ │
│  │  ┌ div ┐  ┌ div ┐     │ │
│  │  │Brand│  │ Web │     │ │
│  │  └─────┘  └─────┘     │ │
│  └───────────────────────┘ │
│  ┌ aside ────────────────┐ │
│  │  Nieuws               │ │
│  └───────────────────────┘ │
└────────────────────────────┘
┌ footer ────────────────────┐
│  contact · © 2026          │
└────────────────────────────┘
```
