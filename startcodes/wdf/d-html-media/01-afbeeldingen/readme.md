## Theorie

Een afbeelding voeg je toe met `<img>`. In `src` staat het pad naar het bestand: **relatief** (`img/kust.jpg`) voor een afbeelding op je eigen site, **absoluut** (`https://...`) voor een afbeelding die elders staat (dit heet *hot linken*: doe dit niet zonder toestemming).

Het `alt` attribuut is **verplicht**: het beschrijft de afbeelding voor wie ze niet ziet en voor zoekmachines. Geef een zinvolle beschrijving, nooit de bestandsnaam. Een **decoratieve** afbeelding voegt geen informatie toe en krijgt `alt=""`: een screenreader slaat ze dan over.

Staat de afbeelding **in een link**, dan wordt haar `alt` de linktekst. Beschrijf daar dus waar de link naartoe gaat, niet hoe de afbeelding eruitziet.

```html
<img src="img/kust.jpg" alt="De Belgische kust bij zonsondergang">
<img src="img/versiering.png" alt=""><!-- decoratief: geen beschrijving -->
<a href="https://www.mijnbedrijf.com">
   <img src="img/mijnlogo.png" alt="bezoek de website van Mijn Bedrijf"><!-- de alt is de linktekst -->
</a>
```

## Opdracht

Maak onderstaande pagina. Gebruik voor de titels `<h3>` en `<h4>`.

1. de decoratieve band heet `vlagband.png` en staat in een submap `img/`
2. foto hoofdgerecht heet `moules-frites.jpg` en staat in een submap `img/gerechten/`
3. foto dessert is te vinden op *https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Li%C3%A8ge_waffles_on_a_plate.jpg/330px-Li%C3%A8ge_waffles_on_a_plate.jpg*
4. link onderaan een youtube icoon `img/youtube.png` naar *https://www.youtube.com/c/NJAMhetKOOKKANAAL*
5. geef elke afbeelding een alt-attribuut; vul enkel in waar nodig

## Screenshot

<img src="img/screenshot.png" alt="" width="367">
