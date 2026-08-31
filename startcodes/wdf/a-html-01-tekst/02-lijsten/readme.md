## Theorie

De uitgebreide theorie vind je vanaf [https://rogiervdl.github.io/HTML-course/02_tekst.html#ongenummerde-lijsten](https://rogiervdl.github.io/HTML-course/02_tekst.html#ongenummerde-lijsten)

HTML kent drie soorten lijsten. 

### Ongeordende en geordende lijst

Een **ongeordende** lijst `<ul>` gebruik je als de volgorde niet uitmaakt; de browser zet er bolletjes voor. Een **geordende** lijst `<ol>` gebruik je als de volgorde wél telt, zoals bij de stappen van een recept; die wordt genummerd. In beide gevallen is elk item een `<li>`. Kies op *betekenis*, niet op uitzicht: bolletjes en cijfers verander je later met CSS.

Een lijstitem mag zelf een lijst bevatten. Die binnenlijst zet je **binnen** de `<li>`, niet ertussen.

```html
<p>Niet vergeten kopen:</p>
<ul><!-- zonder nummering -->
   <li>melk</li>
   <li>brood</li>
   <li>
      fruit:
      <ul><!-- een geneste lijst -->
         <li>appels</li>
         <li>peren</li>
      </ul>
   </li>
   <li>boter</li>
   <li>...</li>
</ul>

<p>Wie is de slimste van de familie?</p>
<ol><!-- met nummering -->
   <li>homer</li>
   <li>bart</li>
   <li>lisa</li>
   <li>maggie</li>
</ol>
```

Resultaat:

<img src="img/theorie1.png" alt="" width="200">

### Definitielijst

De derde soort is de **definitielijst** `<dl>`: die koppelt telkens een term `<dt>` aan een beschrijving `<dd>`. Gebruik ze voor een woordenlijst, een reeks begrippen of veelgestelde vragen.

```html
<dl>
   <dt>CSS</dt><!-- de term -->
   <dd>Een simpele taal voor layout, kleuren enz...</dd><!-- de beschrijving -->
   <dt>XHTML</dt>
   <dd>Een oude herformulering van HTML in XML</dd>
   <dt>XML</dt>
   <dd>Een flexibele en zelf uitbreidbare eenvoudige markup taal</dd>
</dl>
```

Resultaat:

<img src="img/theorie2.png" alt="" width="350">

## Opdracht

Maak onderstaande pagina naar voorbeeld van de screenshot.

### Screenshot

<img src="img/screenshot.png" alt="" width="500">

### Teksten

Alle teksten van de pagina staan hieronder, zonder opmaak, zodat je ze kan kopiëren.

```
Luikse wafels

Zwaarder dan de Brusselse, met parelsuiker die tijdens het bakken karamelliseert. Reken op een halve dag: het deeg moet rijzen.

Ingrediënten

500 g bloem
25 g verse gist
2 eieren
250 g boter
200 g parelsuiker
naar keuze erbij:
gesmolten chocolade
slagroom

Bereiding

Los de gist op in lauwe melk en laat tien minuten staan.
Meng de bloem, de eieren en de boter tot een soepel deeg.
Laat het deeg een uur rijzen op een warme plaats.
Meng er de parelsuiker onder en verdeel het deeg in bollen.
Bak elke bol drie minuten in een heet wafelijzer.

Woordenlijst

parelsuiker
Grove suikerkorrels die smelten tot karamel in plaats van op te lossen.
rijzen
Het deeg laten rusten zodat de gist het volume doet toenemen.
wafelijzer
Twee verwarmde platen met een ruitpatroon waartussen de wafel bakt.
```
