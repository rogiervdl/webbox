/* =====================================================
   WebBox — Veilige toegang tot localStorage
   ===================================================== */

/*
 * In een afgeschermde omgeving, zoals een examenbrowser, kan opslag geweigerd
 * worden. Elke toegang gooit dan een SecurityError. Deze wrapper vangt dat op,
 * zodat het ontbreken van opslag hooguit betekent dat er niets bewaard wordt.
 */

const Store = (() => {

   /**
    * Leest een waarde uit localStorage.
    *
    * @param {string} key - De sleutel
    * @returns {string|null} De waarde, of null als opslag niet beschikbaar is
    */
   function get(key) {
      try {
         return localStorage.getItem(key);
      } catch (e) {
         return null;
      }
   }

   /**
    * Bewaart een waarde in localStorage.
    *
    * @param {string} key   - De sleutel
    * @param {string} value - De waarde
    */
   function set(key, value) {
      try {
         localStorage.setItem(key, value);
      } catch (e) {
         // opslag niet beschikbaar: stilzwijgend overslaan
      }
   }

   /**
    * Verwijdert een waarde uit localStorage.
    *
    * @param {string} key - De sleutel
    */
   function remove(key) {
      try {
         localStorage.removeItem(key);
      } catch (e) {
         // opslag niet beschikbaar: stilzwijgend overslaan
      }
   }

   // return facade
   return {
      get,
      set,
      remove
   };

})();
