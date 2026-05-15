# Agent instructions

Deze instructies gelden voor het cursusmateriaal in dit project.

## Context
- **Doelgroep**: eerstejaarsstudenten professionele bachelor Toegepaste Informatica (HTML, CSS, JavaScript).
- Dit is **studiemateriaal**; oplossingen en uitleg moeten aansluiten bij het niveau en de leerstof van die cursussen.

## Cursusmateriaal (enige bron)
Studenten mogen in principe **niets gebruiken wat niet in deze online cursussen staat**:
- **HTML**: https://rogiervdl.github.io/HTML-course/
- **CSS**: https://rogiervdl.github.io/CSS-course/
- **JavaScript**: https://rogiervdl.github.io/JS-course/

Bij code, voorbeelden en oefeningen alleen concepten en syntax gebruiken die in deze cursussen aan bod komen.

## JavaScript
- **Geen** `alert()`, `prompt()` of `confirm()`.
- **Hongaarse notatie voor DOM-elementen**: variabelen die een DOM-element bevatten krijgen een prefix naar type: `btn` (button), `img` (image), `par` (paragraph), `txt` (textarea/input text), `sel` (select), `lnk` (link), enz. Voorbeelden: `btnVolgende`, `parBestandsnaam`, `imgAttribuut`.
- **innerText vs innerHTML**: gebruik altijd **innerText** voor tekstinhoud, tenzij je bewust HTML wilt invoegen (dan innerHTML). Zo vermijd je per ongeluk HTML in strings en blijft de code veiliger.

## CSS
- **Properties**: sorteer alle CSS properties binnen een regel **alfabetisch** (a–z). Dit houdt stylesheets consistent en vindbaar.
- **Oefeningen**: gebruik altijd **scoped CSS** per oefening, d.w.z. regels nesten onder het id van de demo-box (bijv. <code>#ex1 { ... }</code>, <code>#ex2 { ... }</code>, <code>#ex3 { img { ... } }</code>). Zo blijven oefening-stijlen lokaal en conflicteren ze niet met de rest van de pagina.

## Taal
- **Variabelen, functienamen, comments, en vergelijkbare teksten**: bij voorkeur **Nederlands**, zodat het verschil met de programmeertaal (HTML, CSS, JS) voor de studenten duidelijker is.
- Documentatie en instructies in het cursusmateriaal: Nederlands.

## Bij twijfel
- Eenvoud en leesbaarheid boven slimme of geavanceerde oplossingen.
- Blijf binnen de scope van de drie cursussen; verwijs niet naar technieken die daar niet in staan.
