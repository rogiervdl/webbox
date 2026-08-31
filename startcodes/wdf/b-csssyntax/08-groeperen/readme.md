## Theorie

Moeten verschillende selectoren dezelfde stijl krijgen, dan zet je ze met een **komma** achter elkaar in plaats van de stijlregel te kopiëren. Zet elke selector op een eigen regel: dat leest een pak makkelijker.

```css
header,
footer { /* de stijlen gelden voor header én footer */
   background-color: #009;
   padding: 10px;
}
```

Je mag alle soorten selectoren door elkaar groeperen, dus ook een tag samen met een class.

## Opdracht

Pas dezelfde stijl toe op meerdere selectoren tegelijk.

1. Maak alle &lt;h3&gt;, &lt;h4&gt; en alle elementen met class `gekleurd` donkerpaars met `color: #6610f2` en wat vetter met `font-weight: 500`.

## Screenshot

<img src="img/screenshot.png" alt="" width="800">
