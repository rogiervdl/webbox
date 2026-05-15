/*
 * Herhaling: syntax
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

const studenten = [
   { naam: 'Ali', punten: 14 },
   { naam: 'Bo', punten: 8 },
   { naam: 'Carlos', punten: 17 },
   { naam: 'Dina', punten: 11 },
   { naam: 'Eva', punten: 19 },
];

// FUNCTIES
// ========

/**
 * Filters students that passed (>= 10 points).
 *
 * @param {Object[]} studenten - Array of student objects
 * @returns {Object[]} Array of passing students
 */
function filterGeslaagd(studenten) {
   return studenten.filter(s => s.punten >= 10);
}

/**
 * Calculates the average score.
 *
 * @param {Object[]} studenten - Array of student objects
 * @returns {number} The average score
 */
function berekenGemiddelde(studenten) {
   return studenten.reduce((som, s) => som + s.punten, 0) / studenten.length;
}

/**
 * Returns the student with the highest score.
 *
 * @param {Object[]} studenten - Array of student objects
 * @returns {Object} The best student
 */
function getBeste(studenten) {
   return studenten.reduce((max, s) => s.punten > max.punten ? s : max);
}

// uitvoer
const geslaagd = filterGeslaagd(studenten);
const gemiddelde = berekenGemiddelde(studenten);
const beste = getBeste(studenten);

console.log(studenten.map(s => s.naam));
console.log(`Geslaagd (${geslaagd.length}): ${geslaagd.map(s => s.naam).join(', ')}`);
console.log(`Gemiddelde: ${gemiddelde.toFixed(1)}/20`);
console.log(`Beste student: ${beste.naam} met ${beste.punten}/20`);
