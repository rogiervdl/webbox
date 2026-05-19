## Opdracht

Dit is een oefening op fetch, async/await en API's.

We bouwen een **bibliotheekzoeker**: bij het laden verschijnt een lijst van alle auteurs. Daarnaast kan je op een boek zoeken; het eerste resultaat wordt getoond, of de tekst "Boek niet gevonden" als er niets gevonden werd.

**API-gegevens**

- URL: `https://rvdl.be/bibliotheekAPI`
- Voeg de API key toe als header bij elk verzoek: `X-Api-Key: b3f7a2d9e4c8b1f5a6d3e9c2b7f4a1d8`

1. Declareer constanten `API_URL` en `API_KEY`, en constanten voor alle nodige DOM-elementen.
2. Schrijf een `async` functie `fetchAuteurs()`:
   - doe een `fetch` naar `${API_URL}/authors` met de API key als header
   - geef de array `auteurs` uit het antwoord terug
3. Schrijf een functie `laadAuteurs()` die:
   - `fetchAuteurs()` aanroept
   - de namen in een `<ul>` opbouwt (tip: gebruik `.map()` en `.join('')`) en in `#auteurs` plaatst
4. Schrijf een `async` functie `fetchBoeken(zoekterm)`:
   - gebruik `URLSearchParams` voor de querystring (parameters `search` en `type: 'boek'`)
   - doe een `fetch` naar `${API_URL}/items?${params}` met de API key als header
   - geef de array `items` terug
5. Schrijf een functie `zoekBoek()` die:
   - `fetchBoeken(inpZoek.value)` aanroept
   - bij een leeg resultaat `'Boek niet gevonden.'` toont in `#melding`
   - bij een resultaat het eerste item (titel + auteur) toont in `#uitvoer`
      - maak bij voorkeur gebruik van een hulpfunctie `maakBoekHtml(item)`
6. Koppel een click-event aan de zoekknop en een keydown-event aan het invoerveld (Enter = zoeken).
7. Roep `laadAuteurs()` aan bij het laden van de pagina.

## Tips

Probeer zoveel mogelijk uit te voeren, ook als bepaalde onderdelen niet lukken. Zorg dat je declaraties correct zijn. Koppel alvast de functies aan events, maar laat de body nog leeg. Zet stukken code die niet werken in commentaar. Zorg ervoor dat je code de juiste opbouw heeft en voorzie het van commentaar.

## Screenshot

<img src="img/screenshot.png" alt="" width="400">
