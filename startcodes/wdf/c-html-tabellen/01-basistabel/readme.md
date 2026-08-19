## Theorie

Een tabel maak je met `<table>`. Daarbinnen is elke rij een `<tr>` (*table row*) en elke cel in die rij een `<td>` (*table data*). Het aantal cellen per rij bepaalt dus het aantal kolommen. Gebruik een tabel **enkel voor tabulaire data**: gegevens waarvan de betekenis afhangt van de rij én de kolom. Nooit voor layout!

```html
<table border="1" cellspacing="0">
   <!-- eerste rij -->
   <tr>
      <td>Appel</td>
      <td>&euro; 0,50</td>
   </tr>
   <!-- tweede rij -->
   <tr>
      <td>Peer</td>
      <td>&euro; 0,60</td>
   </tr>
</table>
```

Resultaat:

<img src="img/theorie.png" alt="" width="109">

**Opgelet:** de `<table>`-attributen `border="1"` en `cellspacing="0"` staan hier enkel om de randen van de tabel zichtbaar te maken. Ze zijn **verouderd** en we vervangen ze later door CSS.

## Opdracht

Maak een tabel naar voorbeeld van deze screenshot:

<img src="img/screenshot.png" alt="" width="352">
