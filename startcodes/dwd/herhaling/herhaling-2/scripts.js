// === Examen oefening 2: bedragenspel ===

// DECLARATIES
// ===========

// constanten
// ...

// variabelen
// ...

// DOM
// ...

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
// ...

// EVENTS
// ======

// koppel click-event aan elke knop
// ...
