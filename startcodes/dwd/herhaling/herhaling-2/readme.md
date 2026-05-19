## Opdracht

Bouw een factorspel:

- oorspronkelijk bedrag: 100
- gewonnen als het bedrag ≥ 1000 is, verloren als het 0 is
- vijf opties; de speler weet niet welke factor erachter zit

1. Declareer alle DOM-elementen met `querySelector` en `querySelectorAll`
2. Koppel met `forEach` een `click`-event aan elke knop
3. Bij klik op een knop (gebruik `e.currentTarget`):
   - zoek het bijbehorende paneel via `dataset.target` en open het via `classList.add('open')` (het CSS-schuifeffect werkt dan automatisch)
   - markeer de knop als gebruikt via `classList.add('gebruikt')` en zet `disabled` op `true`
   - lees de factor uit via `dataset.factor`, vermenigvuldig het bedrag ermee en rond het resultaat af
   - werk de voortgangsbalk bij: stel `style.width` (0–100%) en `style.backgroundColor` (rood→geel→groen) in op basis van het bedrag
   - toon het nieuwe bedrag en controleer of gewonnen of verloren
4. Koppel een `keydown`-event aan het `document`: de cijfertoetsen `1`–`5` activeren de corresponderende knop

## Screenshot

<img src="img/screenshot.png" alt="" width="450">
