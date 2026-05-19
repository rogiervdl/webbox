// DECLARATIES
// ===========

// constanten
const API_URL = 'https://rvdl.be/bibliotheekAPI';
const API_KEY = 'b3f7a2d9e4c8b1f5a6d3e9c2b7f4a1d8';

// DOM
const btnZoek = document.querySelector('#btn-zoek');
const inpZoek = document.querySelector('#inp-zoek');
const divUitvoer = document.querySelector('#uitvoer');

// FUNCTIES
// ========

// Zoekt boeken op basis van een zoekterm en return een lijst van items
async function fetchEersteBoek(zoekterm) {
   const params = new URLSearchParams({ 
      search: zoekterm, 
      type: 'boek' 
   });
   const resp = await fetch(`${API_URL}/items?${params}`, {
      headers: { 
         'X-Api-Key': API_KEY 
      }
   });
   const data = await resp.json();
   return data.items[0];
}

// event handlers
function handleBtnZoekClick() {
   // wis vorige resultaten
   divUitvoer.innerHTML = '';

   // haal boeken op en toon eerste resultaat of melding
   const boeken = await fetchEersteBoek(inpZoek.value);
   if (boek == null) {
      divUitvoer.textContent = 'Boek niet gevonden.';
   } else {
      divUitvoer.innerHTML = `<p><strong>${boek.titel}</strong><br>${boek.auteur}</p>`;
   }
}

// EVENTS
// ======

btnZoek.addEventListener('click', handleBtnZoekClick);
