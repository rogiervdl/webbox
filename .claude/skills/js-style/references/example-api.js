/*
 * Chuck Norris API
 *
 * @author Rogier van der Linde <rogier@bitmatters.be>
 */

// DECLARATIES
// ===========

const BASE_URL = 'https://api.chucknorris.io/jokes';

// FUNCTIES
// ========

/**
 * Fetches a random joke, optionally filtered by category.
 *
 * @param {string|null} category - Category name, or null for any category
 * @returns {string|null} The joke text, or null on failure
 */
async function fetchRandom(category = null) {
   const url = category
      ? `${BASE_URL}/random?category=${category}`
      : `${BASE_URL}/random`;
   try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.value;
   } catch {
      return null;
   }
}

/**
 * Fetches a random joke matching a search term.
 *
 * @param {string} query - The search term
 * @returns {string|null} A random matching joke, or null if none found
 */
async function fetchRandomSearch(query) {
   const params = new URLSearchParams({ query });
   try {
      const resp = await fetch(`${BASE_URL}/search?${params}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data.result?.length) return null;
      return data.result[Math.floor(Math.random() * data.result.length)].value;
   } catch {
      return null;
   }
}

/**
 * Fetches all available categories.
 *
 * @returns {string[]|null} Array of category names, or null on failure
 */
async function fetchCategories() {
   try {
      const resp = await fetch(`${BASE_URL}/categories`);
      if (!resp.ok) return null;
      return await resp.json();
   } catch {
      return null;
   }
}
