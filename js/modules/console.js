/* =====================================================
   WebBox — Console
   ===================================================== */

const ConsolePanel = (() => {
   // DECLARATIES
   // ===========

   const panel  = document.querySelector('#console-panel');
   const output = document.querySelector('#console-output');
   const badge  = document.querySelector('#console-badge');
   const btnConsoleClear  = document.querySelector('#console-clear');
   const divConsoleToggle = document.querySelector('#console-toggle');
   let errorCount = 0;

   // FUNCTIES
   // ========
   
   /**
    * Wist alle entries en reset de foutenteller.
    */
   function clearConsole() {
      output.innerHTML = '';
      errorCount = 0;
      badge.textContent = '';
      badge.classList.remove('visible');
   }

   /**
    * Rendert console-argumenten naar een DOM-element,
    * met ondersteuning voor %c stijl-tokens.
    *
    * @param {HTMLElement} targetEl - Element om in te renderen
    * @param {Array} args - Argumenten zoals doorgegeven aan console.log e.d.
    */
   function renderConsoleArgs(targetEl, args) {
      const safeArgs = Array.isArray(args) ? args : [String(args || '')];
      if (!safeArgs.length) return;

      const firstArg = String(safeArgs[0]);
      const hasCssTokens = typeof safeArgs[0] === 'string' && firstArg.indexOf('%c') !== -1;

      // Browser-consoles ondersteunen `%c` tokens met opeenvolgende style-argumenten.
      // We benaderen dat gedrag hier voor de ingebouwde console.
      if (hasCssTokens) {
         const parts = firstArg.split('%c');
         let styleArgIndex = 1;

         const plainPrefix = document.createElement('span');
         plainPrefix.textContent = parts[0];
         targetEl.appendChild(plainPrefix);

         for (let i = 1; i < parts.length; i++) {
            const segment = document.createElement('span');
            segment.textContent = parts[i];
            segment.style.cssText = String(safeArgs[styleArgIndex] || '');
            targetEl.appendChild(segment);
            styleArgIndex++;
         }

         for (let i = styleArgIndex; i < safeArgs.length; i++) {
            if (i > styleArgIndex) targetEl.appendChild(document.createTextNode(' '));
            targetEl.appendChild(document.createTextNode(String(safeArgs[i])));
         }
         return;
      }

      targetEl.textContent = safeArgs.map(value => String(value)).join(' ');
   }

   /**
    * Voegt een nieuwe entry toe aan het console-paneel.
    *
    * @param {string} type - 'log' | 'info' | 'warn' | 'error'
    * @param {Array} args - Argumenten zoals doorgegeven aan de console-methode
    */
   function appendConsoleEntry(type, args) {
      const entry = document.createElement('div');
      entry.className = 'console-entry console-entry--' + type;
      const typeEl = document.createElement('span');
      typeEl.className = 'console-entry__type';
      typeEl.textContent = type;
      const textEl = document.createElement('span');
      textEl.className = 'console-entry__text';
      renderConsoleArgs(textEl, args);
      entry.appendChild(typeEl);
      entry.appendChild(textEl);
      output.appendChild(entry);
      output.scrollTop = output.scrollHeight;

      if (type === 'error' || type === 'warn') {
         if (panel.classList.contains('is-collapsed')) {
            errorCount++;
            badge.textContent = errorCount;
            badge.classList.add('visible');
         }
      }
   }

   // EVENT HANDLERS
   // ==============
   
   function handleWindowMessage(e) {
      if (!e.data || e.data.__webbox !== true) return;
      appendConsoleEntry(e.data.type, e.data.args);
   }

   function handleConsoleToggleClick(e) {
      if (e.target === btnConsoleClear) return;
      panel.classList.toggle('is-collapsed');
      if (!panel.classList.contains('is-collapsed')) {
         errorCount = 0;
         badge.textContent = '';
         badge.classList.remove('visible');
      }
   }

   function handleConsoleClearClick(e) {
      e.stopPropagation();
      clearConsole();
   }

   // EVENT BINDINGS
   // ==============
   
   window.addEventListener('message', handleWindowMessage);
   divConsoleToggle.addEventListener('click', handleConsoleToggleClick);
   btnConsoleClear.addEventListener('click', handleConsoleClearClick);

   // FACADE
   // ======
   
   return {
      clearConsole,
   };

})();
