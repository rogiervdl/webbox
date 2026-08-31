## Theorie

Een achtergrondafbeelding is zelden precies even groot als het element. Met **background-size** bepaal je hoe ze geschaald wordt en met **background-position** waar ze staat.

```css
.pattern {
   background-size: 100% 50%; /* horizontaal 100%, verticaal 50% */
   background-position: center bottom; /* midden onder */
}
```

De belangrijkste waarden voor `background-size` zijn `cover` (schaal op tot het element helemaal bedekt is, desnoods valt er iets buiten beeld) en `contain` (schaal tot de hele afbeelding past, desnoods blijft er ruimte over). Bij `background-position` geef je eerst de horizontale en dan de verticale positie: `left`, `center` of `right`, gevolgd door `top`, `center` of `bottom`.

## Opdracht

De banner heeft al een achtergrondafbeelding; positioneer ze en stel de grootte in.

1. Stel de achtergrondgrootte van de banner in op `cover`.
2. Positioneer de achtergrond horizontaal en verticaal in het midden.

## Screenshot

<img src="img/screenshot.jpg" alt="" width="800">
