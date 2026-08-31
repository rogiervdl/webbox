## Theorie

De uitgebreide uitleg vind je op [https://rogiervdl.github.io/HTML-course/02_tekst.html#karakters](https://rogiervdl.github.io/HTML-course/02_tekst.html#karakters)

- **Karaktercodering** – `<`, `>` en `&` noteer je als `&lt;`, `&gt;` en `&amp;` om verwarring met HTML code te vermijden
- **Speciale tekens** – karakters met accenten, symbolen enz... (é, ©, €, →) kan je gewoon typen, coderen (bv. `&reg;` wordt ®) of van het Internet kopiëren
- **Emoji's** – tekens als 😀🦄💣 kan je gewoon typen (Windows-sneltoets: `Win` + `.`) of kopiëren van het internet
- **Icon fonts** – dit zijn gratis of commerciële iconensets die je kan importeren en gebruiken in je pagina

De bekendste icon fonts zijn **Google Icons** en **FontAwesome**. Om ze te kunnen gebruiken, moet je ze in je pagina **importeren**, zie de [uitleg in de online HTML cursus](https://rogiervdl.github.io/HTML-course/02_tekst.html#google-icon). In deze WebBox omgeving is het importeren al gebeurd, en kan je ze rechtstreeks gebruiken.

Codevoorbeeld:

```html
<p>5 &lt; 10 &amp; 10 &gt; 5</p><!-- gecodeerde karakters -->
<p>© 2026 — café — 49,95 €</p><!-- speciale tekens getypt -->
<p>&copy; 2026 &mdash; caf&eacute; &mdash; 49,95 &euro;</p><!-- speciale tekens gecodeerd -->
<p>welke film is dit: 🚢🧊💕</p><!-- emoji's getypt -->
<p>
   Google icons:
   <span class="material-symbols-outlined">home</span><!-- Google Icons: naam in de inhoud -->
   <span class="material-symbols-outlined">shopping_cart</span>
</p>
<p>
   Font Awesome icons:
   <span class="fa-solid fa-house"></span><!-- FontAwesome: naam in de class -->
   <span class="fa-brands fa-github"></span><!-- fa-brands: logo's van merken -->
</p>
```

Resultaat:

<img src="img/theorie.png" alt="" width="200">

## Opdracht

Schrijf de HTML naar voorbeeld van de screenshot. De iconen zijn van Google Icons, enkel de iconen onderaan zijn van FontAwesome. In deze startcode zijn beide icon sets al gekoppeld (bovenaan `styles.css`), dus je kan ze gewoon opzoeken en gebruiken via [fonts.google.com/icons](https://fonts.google.com/icons) en [fontawesome.com/search](https://fontawesome.com/search).

### Screenshot

<img src="img/screenshot.png" alt="" width="700">

### Teksten

Alle teksten van de pagina staan hieronder, zonder opmaak, zodat je ze kan kopiëren. De iconen staan er niet bij: die zoek je zelf op.

```
Café &mpersand

"Bij ons duurt een kop koffie zo lang als het gesprek."

Onze naam komt van het teken &. Het staat voor verbinding, en dus voor alles wat bij elkaar hoort: koffie, taart, werk en ontspanning, jij & de mensen aan de tafel naast je. Een ampersand verbindt twee dingen zonder er een van de twee belangrijker te maken, en dat is precies wat we hier proberen te doen.

Op de kaart

Koffie — 2,80 €
Espresso, cappuccino of filterkoffie met onze eigen melange Ampersand Blend®, gezet volgens de slow bar-methode: traag en per kopje.
Verse soep — 4,50 €
Elke dag een andere, met een sneetje desembrood erbij.
Dagschotel — 14,00 €
Wisselend gerecht met seizoensgroenten, ook vegetarisch.

Elke zondag brunch.

Over ons

Vind ons

@cafeampersand
@cafeampersandgent
@ampersandkoffie

Contacteer ons

Café Ampersand
09 234 56 78
hallo@cafeampersand.be

© 2026 Café Ampersand
```
