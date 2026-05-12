/* =====================================================
   WebBox — Thema-wisselaar
   ===================================================== */

const ThemeSwitcher = (() => {

   // declaraties
   const btnTheme = document.querySelector('#btn-theme');
   const iconSun  = document.querySelector('#icon-sun');
   const iconMoon = document.querySelector('#icon-moon');

   /**
    * Past het opgegeven thema toe op de UI en slaat het op in localStorage.
    * Vereist dat monaco beschikbaar is (aanroepen vanuit de AMD-callback).
    *
    * @param {string} theme - 'dark' of 'light'
    */
   function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      const isDark = theme === 'dark';
      iconSun.style.display  = isDark ? '' : 'none';
      iconMoon.style.display = isDark ? 'none' : '';
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
      localStorage.setItem('webbox-theme', theme);
   }

   /**
    * Initialiseert het thema
    */
   function init() {
      applyTheme(localStorage.getItem('webbox-theme') || 'dark');
   }

   // event handlers
   function handleBtnThemeClick() {
      const current = document.documentElement.dataset.theme || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
   }

   // event bindings
   btnTheme.addEventListener('click', handleBtnThemeClick);


   // return facade
   return {
      applyTheme,
      init
   };

})();
