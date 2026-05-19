## Opdracht

Dit is een oefening op fetch, async/await en API's.

We bouwen een **boekzoeker**: het eerste resultaat wordt getoond, of de tekst "Boek niet gevonden" als er niets gevonden werd.

**API-gegevens**

- URL: `https://rvdl.be/bibliotheekAPI`
- Voeg de API key toe als header bij elk verzoek

1. Declareer constanten `API_URL` en `API_KEY`
2. Declareer constanten voor alle nodige DOM-elementen.
3. Schrijf een asynchrone functie `fetchEersteBoek(zoekterm)` die het eerste boek teruggeeft op basis van een zoekterm (gebruik parameters `search` en `type`)
4. Koppel een click-event aan de zoekknop:
   - roep de functie `fetchEersteBoek()` aan
   - indien boek gevonden: toon titel + auteur in de uitvoer; zoniet toon de melding `Boek niet gevonden`

## Screenshot

<img src="img/screenshot.png" alt="" width="400">
