## Opdracht

Maak een grap-zoeker met de [icanhazdadjoke API](https://icanhazdadjoke.com/api):

1. schrijf een asynchrone functie `fetchGrappen(term)` die grappen opvraagt; gebruik `URLSearchParams` met parameters `term` en `limit: 5`; stuur `Accept: application/json` als request header
2. toon de resultaten als een lijst bij klik op de knop
3. laad automatisch bij het opstarten van de app (standaard zoekterm naar keuze)

Gebruik `fetch`, `async/await`, `URLSearchParams` en request headers.
