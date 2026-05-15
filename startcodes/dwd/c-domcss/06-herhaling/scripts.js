/*
 * Herhaling: DOM CSS manipulatie
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

// DOM
const lisPalet = document.querySelectorAll('.palet li');
const divPreview = document.querySelector('.preview');
const spnKleurNaam = document.querySelector('#kleur-naam');
const btnDonker = document.querySelector('#btn-donker');

// FUNCTIES
// ========

function initialiseer() {
   const actief = document.querySelector('.palet .actief');
   divPreview.style.backgroundColor = actief.dataset.kleur;
}

// event handlers
function handleLiPaletClick(e) {
   lisPalet.forEach(li => li.classList.remove('actief'));
   e.currentTarget.classList.add('actief');
   divPreview.style.backgroundColor = e.currentTarget.dataset.kleur;
   spnKleurNaam.textContent = e.currentTarget.textContent.toLowerCase();
}

function handleBtnDonkerClick() {
   document.body.classList.toggle('donker');
   btnDonker.textContent = document.body.classList.contains('donker') ? 'Lichte modus' : 'Donkere modus';
}

// EVENTS
// ======

lisPalet.forEach(li => li.addEventListener('click', handleLiPaletClick));
btnDonker.addEventListener('click', handleBtnDonkerClick);

initialiseer();
