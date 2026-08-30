## Theorie

Een **class** gebruik je om een groep elementen te selecteren die dezelfde stijl moeten krijgen, ongeacht hun tag. In de HTML zet je het class-attribuut op de elementen, in de CSS schrijf je de naam met een **punt** ervoor.

```html
<p class="accent">een paragraaf</p>
<li class="accent">een lijstitem</li>
```

```css
.accent { /* selecteert alle elementen met class="accent" */
   font-style: italic;
   padding: 6px;
}
```

Dezelfde class mag zo vaak voorkomen als je wil. Kies een naam die zegt wát iets is, niet hoe het eruitziet: `.waarschuwing` is beter dan `.rood`.

## Opdracht

Selecteer elementen op basis van hun class attribuut.

1. Geef de items met class `highlight` een oranje achtergrondkleur met `background-color: #ffa600`, en zet ze schuin met `font-style: italic`.
