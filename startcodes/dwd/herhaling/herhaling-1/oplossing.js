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

// Bouwt de HTML-samenvatting op voor de beoordeling.
function maakSamenvattingHtml(waarde, commentaar) {
   const gevuld = '★'.repeat(waarde);
   const leeg = '☆'.repeat(AANTAL_STERREN - waarde);
   return `<p><strong>Beoordeling:</strong> ${gevuld}${leeg}</p>
           <p><strong>Commentaar:</strong> ${commentaar}</p>`;
}

// Toont actieve sterren bij klik
function handleSterClick(e) {
   // lees de waarde van de geklikte ster en sla op
   geselecteerdeSter = parseInt(e.target.id.split('-')[1]);

   // voeg class 'actief' toe aan sterren t.e.m. waarde, verwijder bij de rest
   sterren.forEach(ster => {
      ster.classList.toggle('actief', ster.id.split('-')[1] <= geselecteerdeSter);
   });
}

function handleBtnVerstuurClick() {
   // reset meldingen en uitvoer
   parMelding.innerHTML = '';
   divUitvoer.innerHTML = '';

   // valideer: commentaar lang genoeg?
   const commentaar = txtCommentaar.value.trim();
   if (commentaar.length < MIN_COMMENTAAR_LENGTE) {
      parMelding.innerHTML += `Schrijf minstens ${MIN_COMMENTAAR_LENGTE} tekens.<br>`;
      return;
   }

   // toon samenvatting als alles geldig is
   divUitvoer.innerHTML = maakSamenvattingHtml(geselecteerdeSter, commentaar);
}

// EVENTS
// ======

sterren.forEach(ster => {
   ster.addEventListener('click', handleSterClick);
});
btnVerstuur.addEventListener('click', handleBtnVerstuurClick);
