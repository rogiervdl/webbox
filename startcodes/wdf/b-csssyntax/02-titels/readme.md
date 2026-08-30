## Theorie

HTML heeft zes kopniveaus, `<h1>` tot en met `<h6>`. Elk niveau is een aparte tag, en dus ook een aparte tagselector: er bestaat geen selector die alle titels tegelijk pakt.

```css
h1 { /* selecteert enkel de h1 */
   text-decoration: underline;
}

h2 { /* selecteert enkel de h2 */
   letter-spacing: 2px;
}
```

Wil je verschillende niveaus toch samen opmaken, dan groepeer je de selectoren met een komma. Dat komt verderop aan bod.

## Opdracht

Selecteer de verschillende kopniveaus.

1. Maak de &lt;h1&gt;-titel grasgroen met `color: #080`.
2. Stel de lettergrootte van alle &lt;h3&gt;-titels in met `font-size: 20px`, en het lettergewicht met `font-weight: 400`.
