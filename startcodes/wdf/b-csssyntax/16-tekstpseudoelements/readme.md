## Theorie

Met deze pseudo elements maak je een **deel van een tekst** op, zonder er een tag rond te zetten:

- `::first-letter` &ndash; de eerste letter, bijvoorbeeld voor een initiaal
- `::first-line` &ndash; de eerste regel zoals die op het scherm valt; wordt het venster smaller, dan verandert die regel mee
- `::selection` &ndash; de tekst die de bezoeker met de muis selecteert

```css
p::first-letter {
   font-size: 28px;
}

p::first-line {
   font-weight: bold;
}

::selection {
   background-color: #ff0;
}
```

Niet elke property werkt op deze pseudo elements: op `::first-line` kan je bijvoorbeeld wel het lettertype en de kleur zetten, maar geen marges.

## Opdracht

Style specifieke delen van een tekst.

1. Maak de eerste letter van elke paragraaf groot met `font-size: 28px`, donkerrood met `color: #900` en stel het lettertype in met `font-family: Georgia, serif`.
2. Maak de eerste regel van elke paragraaf vet met `font-weight: bold`.
3. Geef geselecteerde tekst een gele achtergrond met `background-color: #ff0` en een donkerrode tekst met `color: #900`.
