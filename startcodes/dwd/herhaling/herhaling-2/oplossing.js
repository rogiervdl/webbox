/*
 * Herhaling 2: factorspel — modeloplossing
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

// DECLARATIES
// ===========

// constanten
const DOELBEDRAG = 1000;
const STARTBEDRAG = 100;

// variabelen
let bedrag = STARTBEDRAG;

// DOM
const divBalk = document.querySelector('#balk');
const knoppen = document.querySelectorAll('.optie__knop');
const parMelding = document.querySelector('#melding');
const spnBedrag = document.querySelector('#bedrag');

// FUNCTIES
// ========

/**
 * Berekent de HSL-kleur op basis van het bedrag (rood → geel → groen).
 *
 * @param {number} waarde - het huidig bedrag (0–1000)
 * @returns {string} CSS HSL-kleurstring
 */
function berekenKleur(waarde) {
   // hue loopt van 0 (rood) naar 120 (groen) naargelang de waarde
   const hue = Math.round((Math.min(waarde, DOELBEDRAG) / DOELBEDRAG) * 120);
   return `hsl(${hue}, 70%, 40%)`;
}

/**
 * Werkt de breedte en kleur van de voortgangsbalk bij.
 *
 * @param {number} waarde - het huidig bedrag
 */
function werkBalkBij(waarde) {
   // breedte: percentage van het doelbedrag, max 100%
   const breedte = Math.round((Math.min(waarde, DOELBEDRAG) / DOELBEDRAG) * 100);
   divBalk.style.width = `${breedte}%`;
   divBalk.style.backgroundColor = berekenKleur(waarde);
}

/**
 * Beëindigt het spel met een bericht en schakelt alle knoppen uit.
 *
 * @param {string} bericht - het te tonen eindresultaat
 * @param {string} klasse - CSS-klasse 'gewonnen' of 'verloren'
 */
function beeindigSpel(bericht, klasse) {
   // toon melding met bijbehorende klasse
   parMelding.textContent = bericht;
   parMelding.className = klasse;

   // schakel alle resterende knoppen uit
   knoppen.forEach(knop => {
      knop.disabled = true;
   });
}

/**
 * Activeert een optieknop: opent het paneel, past het bedrag aan en
 * controleert of het spel gewonnen of verloren is.
 *
 * @param {HTMLButtonElement} knop - de te activeren knop
 */
function activeerKnop(knop) {
   // negeer al gebruikte knoppen
   if (knop.disabled) return;

   // open het bijbehorende paneel
   const paneel = document.querySelector(`#${knop.dataset.target}`);
   paneel.classList.add('open');

   // markeer de knop als gebruikt
   knop.classList.add('gebruikt');
   knop.disabled = true;

   // bereken het nieuwe bedrag
   bedrag = Math.round(bedrag * Number(knop.dataset.factor));

   // werk de weergave bij
   spnBedrag.textContent = `€ ${bedrag}`;
   werkBalkBij(bedrag);

   // controleer win- of verliesconditie
   if (bedrag >= DOELBEDRAG) {
      beeindigSpel('Gewonnen!', 'gewonnen');
   } else if (bedrag === 0) {
      beeindigSpel('Verloren!', 'verloren');
   }
}

// event handlers

function handleKnopClick(e) {
   activeerKnop(e.currentTarget);
}

function handleDocumentKeydown(e) {
   // activeer de knop op index 0–4 bij cijfertoetsen 1–5
   const index = parseInt(e.key) - 1;
   if (index >= 0 && index < knoppen.length) {
      activeerKnop(knoppen[index]);
   }
}

// EVENTS
// ======

// koppel click-event aan elke knop
knoppen.forEach(knop => {
   knop.addEventListener('click', handleKnopClick);
});

document.addEventListener('keydown', handleDocumentKeydown);

// initialiseer de voortgangsbalk
werkBalkBij(bedrag);
