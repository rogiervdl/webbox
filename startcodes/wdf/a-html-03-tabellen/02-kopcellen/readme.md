## Theorie

De uitgebreide uitleg vind je op [https://rogiervdl.github.io/HTML-course/04_tabellen.html#bijschrift-met-caption-en-koppen-met-th-scope](https://rogiervdl.github.io/HTML-course/04_tabellen.html#bijschrift-met-caption-en-koppen-met-th-scope)

`<caption>` geeft de tabel een bijschrift en staat altijd als **eerste kind** van `<table>`. Een titelcel is geen `<td>` maar een `<th>` (*table header*); browsers tonen die vet en gecentreerd. Met `scope` zeg je erbij wat de kop beschrijft: `scope="col"` voor een kolomtitel, `scope="row"` voor een rijtitel. Screenreaders lezen bij elke cel de bijhorende koppen voor, zodat een blinde gebruiker weet waar hij zit.

```html
<table border="1" cellspacing="0">
   <caption>Prijslijst</caption><!-- bijschrift -->
   <tr>
      <th scope="col">Product</th><!-- kolomkop -->
      <th scope="col">Prijs</th><!-- kolomkop -->
   </tr>
   <tr>
      <th scope="row">Appel</th><!-- rijkop -->
      <td>&euro; 0,50</td>
   </tr>
   <tr>
      <th scope="row">Peer</th>
      <td>&euro; 0,60</td>
   </tr>
</table>
```

Resultaat:

<img src="img/theorie.png" alt="" width="128">

**Opgelet:** de `<table>`-attributen `border="1"` en `cellspacing="0"` staan hier enkel om de randen van de tabel zichtbaar te maken. Ze zijn **verouderd** en we vervangen ze later door CSS.

## Opdracht

Maak een tabel naar voorbeeld van de screenshot. Denk ook aan de `scope`-attributen: die zie je niet op de screenshot.

### Screenshot

<img src="img/screenshot.png" alt="" width="303">

### Teksten

Alle teksten van de tabel staan hieronder, zonder opmaak, zodat je ze kan kopiëren. Elke regel is één rij; de eerste regel is het bijschrift.

```
Verkochte stuks eerste kwartaal

Productgroep   januari   februari   maart
Laptops   128   96   141
Schermen   64   72   58
Toetsenborden   210   185   233
```
