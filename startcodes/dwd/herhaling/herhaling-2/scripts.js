/*
 * Herhaling 2: factorspel — modeloplossing
 */

// DECLARATIES
// ===========


// FUNCTIES
// ========

// Berekent de HSL-kleur op basis van het bedrag (0 = rood → 1000 = groen).
function berekenKleur(waarde) {
   const hue = Math.round((Math.min(waarde, DOELBEDRAG) / DOELBEDRAG) * 120);
   return `hsl(${hue}, 70%, 40%)`;
}

// event handlers

// EVENTS
// ======

