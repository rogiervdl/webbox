## Opdracht

Dit is een oefening op fetch, async/await en API's. De API met documentatie en de nodige API key vind je op 

We bouwen een **boekzoeker**: het eerste resultaat wordt getoond, of de tekst "Boek niet gevonden" als er niets gevonden werd.

**API-gegevens**

- API url en documentatie: [https://rvdl.be/bibliotheekAPI/](https://rvdl.be/bibliotheekAPI/)
- De API key vind je daar ook terug; voeg het toe als header bij elk verzoek

1. Declareer constante n voor de API url en API key
2. Declareer constanten voor alle nodige DOM-elementen.
3. Schrijf een asynchrone functie `fetchEersteBoek(zoekterm)` die het eerste boek teruggeeft op basis van een zoekterm (gebruik parameters `search` en `type`)
4. Koppel een click-event aan de zoekknop:
   - roep de functie `fetchEersteBoek()` aan
   - indien boek gevonden: toon titel + auteur in de uitvoer; zoniet toon de melding `Boek niet gevonden`

## Screenshot

<img src="img/screenshot.png" alt="" width="400">
