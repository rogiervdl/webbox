## Theorie

Een element kan meerdere classes hebben, gescheiden door een spatie. De stijlen van al die classes worden dan gecombineerd. Schrijf je in de CSS twee classes **tegen elkaar**, zonder spatie, dan selecteer je enkel de elementen die ze **allebei** hebben.

```html
<p class="info groter">deze paragraaf heeft twee classes</p>
```

```css
.info { /* elk element met class "info" */
   border: 1px solid #888;
}

.groter { /* elk element met class "groter" */
   font-size: 18px;
}

.info.groter { /* enkel de elementen met class "info" én "groter" */
   color: #009;
}
```

Let op het verschil met `.info .groter` (mét spatie): dat selecteert een element met class `groter` binnen een element met class `info`.

## Opdracht

Selecteer elementen op basis van een combinatie van classes.

1. Geef de ja-knop een blauwe achtergrond met `background-color: #0d6efd`, en de nee-knop een rode met `background-color: #dc3545`. De twee links eronder mogen niet mee veranderen.
