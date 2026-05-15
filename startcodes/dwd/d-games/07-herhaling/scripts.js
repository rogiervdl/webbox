/*
 * Herhaling: browser API's
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

const SLEUTEL = 'gebruikersnaam';

// DOM
const inpNaam = document.querySelector('#inp-naam');
const btnOpslaan = document.querySelector('#btn-opslaan');
const strongBewaard = document.querySelector('#lbl-bewaard');
const btnKopieer = document.querySelector('#btn-kopieer');
const parBericht = document.querySelector('.bericht');

// FUNCTIES
// ========

function initialiseer() {
   const bewaard = localStorage.getItem(SLEUTEL);
   if (bewaard) {
      strongBewaard.textContent = bewaard;
      inpNaam.value = bewaard;
   }
}

// event handlers
function handleBtnOpslaanClick() {
   localStorage.setItem(SLEUTEL, inpNaam.value);
   strongBewaard.textContent = inpNaam.value;
}

async function handleBtnKopieerClick() {
   await navigator.clipboard.writeText(strongBewaard.textContent);
   parBericht.textContent = 'Gekopieerd naar klembord!';
}

// EVENTS
// ======

btnOpslaan.addEventListener('click', handleBtnOpslaanClick);
btnKopieer.addEventListener('click', handleBtnKopieerClick);

initialiseer();
