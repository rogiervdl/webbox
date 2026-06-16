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

// Berekent de RGB-kleur op basis van het bedrag (0 = rood → 1000 = groen).
function berekenRgbKleur(waarde) {
   const verhouding = Math.min(waarde, DOELBEDRAG) / DOELBEDRAG;
   const r = Math.round(255 * (1 - verhouding) * 0.8);
   const g = Math.round(255 * verhouding * 0.8);
   return `rgb(${r}, ${g}, 0)`;
}

// knop event handler
function handleKnopClick(e) {
   // aangeklikte knop
   const knop = e.target;

   // open het bijbehorende paneel
   const id = knop.dataset.target;
   const paneel = document.querySelector(`#${id}`);
   paneel.classList.add('open');

   // markeer de knop als gebruikt
   knop.classList.add('gebruikt');
   knop.disabled = true;

   // bereken het nieuwe bedrag
   bedrag = Math.round(bedrag * Number(knop.dataset.factor));

   // werk de weergave bij
   spnBedrag.textContent = `€ ${bedrag}`;
   const breedte = Math.round((Math.min(bedrag, DOELBEDRAG) / DOELBEDRAG) * 100);
   divBalk.style.width = `${breedte}%`;
   divBalk.style.backgroundColor = berekenRgbKleur(bedrag);

   // controleer win- of verliesconditie
   if (bedrag >= DOELBEDRAG || bedrag === 0) {
      // toon melding
      parMelding.textContent = bedrag === 0 ? 'Verloren!' : 'Gewonnen!';
      parMelding.className = bedrag === 0 ? 'rood' : 'groen';

      // schakel alle knoppen uit
      knoppen.forEach(knop => {
         knop.disabled = true;
      });
   }
}

// EVENTS
// ======

// koppel click-event aan elke knop
knoppen.forEach(knop => {
   knop.addEventListener('click', handleKnopClick);
});
