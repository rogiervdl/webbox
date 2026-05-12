/*
 * Main script
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

// constanten en variabelen
const ANIMATION_MS = 300;
let isMenuOpen = false;

// DOM
const btnNavToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const cards = document.querySelectorAll('.card');

// FUNCTIES
// ========

// gewone functies

/**
 * Formats a date as a localized Dutch string.
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date, e.g. "11 mei 2026"
 */
function formatDate(date) {
   return date.toLocaleDateString('nl-BE', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Returns true if the given element is currently visible.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isVisible(el) {
   return !el.classList.contains('hidden');
}

// event handlers

function handleBtnNavToggleClick() {
   isMenuOpen = !isMenuOpen;
   navMenu.classList.toggle('nav__menu--open', isMenuOpen);
   btnNavToggle.setAttribute('aria-expanded', isMenuOpen);
}

function handleCardMouseEnter(e) {
   e.currentTarget.classList.add('card--hovered');
}

function handleCardMouseLeave(e) {
   e.currentTarget.classList.remove('card--hovered');
}

// EVENTS
// ======

btnNavToggle.addEventListener('click', handleBtnNavToggleClick);
cards.forEach(card => {
   card.addEventListener('mouseenter', handleCardMouseEnter);
   card.addEventListener('mouseleave', handleCardMouseLeave);
});
