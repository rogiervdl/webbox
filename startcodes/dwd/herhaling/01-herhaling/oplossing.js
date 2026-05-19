/*
 * Herhaling 1: productbeoordelaar — modeloplossing
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

// DECLARATIES
// ===========

// constanten
const AANTAL_STERREN = 5;
const MIN_COMMENTAAR_LENGTE = 10;

// variabelen
let geselecteerdeSter = 0;

// DOM
const btnVerstuur = document.querySelector('#btn-verstuur');
const divUitvoer = document.querySelector('#uitvoer');
const parMelding = document.querySelector('.melding');
const sterren = document.querySelectorAll('.ster');
const txtCommentaar = document.querySelector('textarea');

// FUNCTIES
// ========

/**
 * Bouwt de HTML-samenvatting op voor de beoordeling.
 *
 * @param {number} waarde - de sterwaarde (1–5)
 * @param {string} commentaar - de ingevoerde tekst
 * @returns {string} HTML-string met de samenvatting
 */
function maakSamenvattingHtml(waarde, commentaar) {
   // bouw de sterrenrij op
   const gevuld = '★'.repeat(waarde);
   const leeg = '☆'.repeat(AANTAL_STERREN - waarde);

   // geef de samenvatting terug als HTML
   return `<p><strong>Beoordeling:</strong> ${gevuld}${leeg}</p>
           <p><strong>Commentaar:</strong> ${commentaar}</p>`;
}

// event handlers

function handleSterClick(e) {
   // lees de waarde van de geklikte ster en sla op
   geselecteerdeSter = parseInt(e.target.id.split('-')[1]);

   // wis de eventuele foutmelding en highlight de sterren
   parMelding.textContent = '';

   // voeg class 'actief' toe aan sterren t.e.m. waarde, verwijder bij de rest
   sterren.forEach(ster => {
      ster.classList.toggle('actief', ster.id.split('-')[1] <= geselecteerdeSter);
   });
}

function handleBtnVerstuurClick() {
   // reset meldingen en uitvoer
   parMelding.innerHTML = '';
   divUitvoer.innerHTML = '';

   // valideer: ster geselecteerd?
   let isGeldig = true;
   if (geselecteerdeSter === 0) {
      parMelding.innerHTML += 'Kies een beoordeling<br>';
      isGeldig = false;
   }

   // valideer: commentaar lang genoeg?
   const commentaar = txtCommentaar.value.trim();
   if (commentaar.length < MIN_COMMENTAAR_LENGTE) {
      parMelding.innerHTML += `Schrijf minstens ${MIN_COMMENTAAR_LENGTE} tekens.<br>`;
      isGeldig = false;
   }

   // toon samenvatting als alles geldig is
   if (!isGeldig) return;
   divUitvoer.innerHTML = maakSamenvattingHtml(geselecteerdeSter, commentaar);
}

// EVENTS
// ======

// koppel events
sterren.forEach(ster => {
   ster.addEventListener('click', handleSterClick);
});
btnVerstuur.addEventListener('click', handleBtnVerstuurClick);
