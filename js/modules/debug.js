/* =====================================================
   WebBox — Debug-paneel voor omgevingen zonder devtools
   ===================================================== */

/*
 * In Schoolyear (examenbrowser) zijn de devtools uitgeschakeld, waardoor een
 * hangende of stilzwijgend mislukte aanroep onzichtbaar blijft. Dit paneel
 * logt zichtbaar op de pagina zelf. Actief via de query-parameter ?debug op
 * de WebBox-URL — anders doet dit module niets.
 */

const Debug = (() => {

   // DECLARATIES
   // ===========

   const PIP_HANG_TIMEOUT_MS = 4000;

   const enabled = new URLSearchParams(location.search).has('debug');
   const startTime = performance.now();
   let elmBody;

   // FUNCTIES
   // ========

   /**
    * Bouwt het debug-paneel op en voegt het toe aan de pagina.
    */
   function buildPanel() {
      const panel = document.createElement('div');
      panel.className = 'debug-panel';

      const header = document.createElement('div');
      header.className = 'debug-panel__header';

      const title = document.createElement('span');
      title.className = 'debug-panel__title';
      title.textContent = 'Debug';

      const btnClear = document.createElement('button');
      btnClear.type = 'button';
      btnClear.className = 'debug-panel__clear';
      btnClear.textContent = 'Wis';
      btnClear.addEventListener('click', handleBtnClearClick);

      header.appendChild(title);
      header.appendChild(btnClear);

      elmBody = document.createElement('div');
      elmBody.className = 'debug-panel__body';

      panel.appendChild(header);
      panel.appendChild(elmBody);
      document.body.appendChild(panel);
   }

   /**
    * Voegt een tijdgestempelde regel toe aan het debug-paneel.
    *
    * @param {string} message - De tekst om te loggen
    */
   function log(message) {
      if (!enabled) return;
      const elapsed = Math.round(performance.now() - startTime);
      const entry = document.createElement('div');
      entry.className = 'debug-panel__entry';
      entry.textContent = `+${elapsed}ms  ${message}`;
      elmBody.appendChild(entry);
      elmBody.scrollTop = elmBody.scrollHeight;
   }

   /**
    * Logt de status van browserfeatures die de opgave/PiP-flow beïnvloeden.
    */
   function logEnvironment() {
      log(`documentPictureInPicture beschikbaar: ${!!window.documentPictureInPicture}`);
      log(`userAgent: ${navigator.userAgent}`);

      try {
         localStorage.setItem('webbox-debug-test', '1');
         localStorage.removeItem('webbox-debug-test');
         log('localStorage: beschikbaar');
      } catch (e) {
         log(`localStorage: niet beschikbaar (${e.name})`);
      }
   }

   // EVENT HANDLERS
   // ==============

   function handleBtnClearClick() {
      elmBody.innerHTML = '';
   }

   function handleWindowError(e) {
      log(`JS-fout: ${e.message} (${e.filename}:${e.lineno})`);
   }

   function handleWindowUnhandledrejection(e) {
      const reason = e.reason && e.reason.message ? e.reason.message : e.reason;
      log(`onafgehandelde promise-fout: ${reason}`);
   }

   // EVENT BINDINGS
   // ==============

   if (enabled) {
      buildPanel();
      window.addEventListener('error', handleWindowError);
      window.addEventListener('unhandledrejection', handleWindowUnhandledrejection);
      logEnvironment();
   }

   // FACADE
   // ======

   return {
      log,
      enabled,
      PIP_HANG_TIMEOUT_MS,
   };

})();
