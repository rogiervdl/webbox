/*
 * Herhaling: Web API's
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

const MAX_GRAPPEN = 5;
const STANDAARD_ZOEKTERM = 'cat';

// DOM
const inpZoek = document.querySelector('#inp-zoek');
const btnZoek = document.querySelector('#btn-zoek');
const ulResultaten = document.querySelector('#resultaten');

// FUNCTIES
// ========

/**
 * Fetches dad jokes matching the given search term.
 *
 * @param {string} term - The search term
 * @returns {Object[]|null} Array of joke objects, or null on error
 */
async function fetchGrappen(term) {
   try {
      const params = new URLSearchParams({ term, limit: MAX_GRAPPEN });
      const url = `https://icanhazdadjoke.com/search?${params}`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await response.json();
      return data.results;
   } catch {
      return null;
   }
}

/**
 * Builds the HTML for a list of jokes.
 *
 * @param {Object[]|null} grappen - Array of joke objects or null
 * @returns {string} HTML string with list items
 */
function maakGrappenHtml(grappen) {
   if (!grappen) return '<li>Fout bij het laden van grappen.</li>';
   if (grappen.length === 0) return '<li>Geen resultaten gevonden.</li>';
   return grappen.map(g => `<li>${g.joke}</li>`).join('');
}

// event handlers
async function handleBtnZoekClick() {
   ulResultaten.innerHTML = '<li>Laden...</li>';
   const grappen = await fetchGrappen(inpZoek.value || STANDAARD_ZOEKTERM);
   ulResultaten.innerHTML = maakGrappenHtml(grappen);
}

// EVENTS
// ======

btnZoek.addEventListener('click', handleBtnZoekClick);

handleBtnZoekClick();
