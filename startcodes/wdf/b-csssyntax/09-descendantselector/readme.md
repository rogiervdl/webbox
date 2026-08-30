## Theorie

Zet je twee selectoren met een **spatie** na elkaar, dan selecteer je enkel de elementen die ergens **binnen** het eerste element staan, hoe diep genest ook. Zo maak je dezelfde tag anders op naargelang waar hij staat.

```css
article span { /* elke span ergens in een article */
   text-transform: uppercase;
}

.product p { /* elke paragraaf ergens in .product */
   margin-top: 6px;
}

.product p a { /* elke link in een paragraaf in .product */
   color: #a22;
}
```

Het laatste stuk van de selector is telkens het element dat je opmaakt; wat ervoor staat beperkt waar het mag staan.

## Opdracht

Selecteer elementen die ergens binnen een ander element staan.

1. Stel voor de paragraaf in de header de lettergrootte in met `font-size: 13px` en zet hem schuin met `font-style: italic`.
2. Stel voor de paragrafen in het element met class `main` de marge in met `margin: 14px 0` (14px boven/onder, 0 links/rechts).
3. Geef de links in de nav een witte kleur met `color: white` en een lettergrootte van `font-size: 12px`.
4. Maak de links in de paragrafen van `main` roodbruin met `color: #a22` en vet met `font-weight: bold`.
5. Geef de link in de footer een gele kleur met `color: #ee6`.
