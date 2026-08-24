## Opdracht

We maken een eenvoudige todo lijst waar je items kan toevoegen en verwijderen.

- **declaraties**: maak constanten voor het invoerveld, de lijst, de sleutel voor localStorage
- **taak toevoegen aan de lijst**:
  - koppel een `keydown` event handler aan het invoerveld
  - als de gebruiker op `Enter` drukt, voeg de nieuwe taak toe aan de lijst, en wis het veld
  - bewaar tenslotte de lijst in localStorage met de functie `saveLijst()`
- **functie `saveLijst()`**:
  - haal alle `li`-elementen uit de lijst op
  - zet de lijst om naar een array van teksten met `map()`
  - zet de array om naar een string met `JSON.stringify()`
  - sla de string op in localStorage
- **verwijderen van een taak**:
  - koppel een `click` event handler aan de hele lijst
  - gebruik `e.target` om het geklikte element te vinden
  - controleer eerst met `e.target.tagName` of het geklikte element een `LI` is
  - verwijder het item met `remove()`
  - bewaar tenslotte de lijst in localStorage met `saveLijst()`
- **schrijf een functie `loadLijst()`** die de lijst laadt bij het laden van de pagina:
  - vraag de data op uit localStorage met `localStorage.getItem()`
  - zet de string om naar een array met `JSON.parse()`
  - bouw de lijst op met `innerHTML`
  - roep `loadLijst()` aan onderaan je code
