## Theorie

Deze pseudo classes selecteren op **positie** binnen de parent: `:first-child` het eerste kind, `:last-child` het laatste.

```css
li:first-child { /* het eerste lijstitem van elke lijst */
   font-style: italic;
}
```

Lees ze letterlijk: `p:first-child` betekent "een paragraaf die het eerste kind van zijn parent is", en dus niet "de eerste paragraaf".

## Opdracht

Selecteer elementen op basis van hun positie binnen de parent.

1. Geef het eerste list-item een groene achtergrond met `background-color: #90ee90`.
2. Geef het laatste list-item een blauwe achtergrond met `background-color: #9090ee`.
