/*
 * Herhaling: DOM HTML manipulatie
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

// DOM
const inpItem = document.querySelector('#inp-item');
const btnVoegToe = document.querySelector('#btn-voeg-toe');
const ulLijst = document.querySelector('#lijst');
const spnTeller = document.querySelector('.teller strong');

// FUNCTIES
// ========

/**
 * Builds the HTML string for a new list item.
 *
 * @param {string} tekst - The item text
 * @returns {string} HTML string for the list item
 */
function maakItemHtml(tekst) {
   return `<li>${tekst} <button type="button">✕</button></li>`;
}

function updateTeller() {
   spnTeller.textContent = ulLijst.querySelectorAll('li').length;
}

// event handlers
function handleBtnVoegToeClick() {
   const tekst = inpItem.value.trim();
   if (!tekst) return;
   ulLijst.innerHTML += maakItemHtml(tekst);
   inpItem.value = '';
   updateTeller();
}

function handleUlLijstClick(e) {
   if (e.target.tagName !== 'BUTTON') return;
   e.target.parentNode.remove();
   updateTeller();
}

function handleInpItemKeydown(e) {
   if (e.key === 'Enter') {
      handleBtnVoegToeClick();
   }
}

// EVENTS
// ======

btnVoegToe.addEventListener('click', handleBtnVoegToeClick);
ulLijst.addEventListener('click', handleUlLijstClick);
inpItem.addEventListener('keydown', handleInpItemKeydown);
