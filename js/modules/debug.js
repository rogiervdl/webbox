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
   const AUDIO_BEEP_MS = 300;

   // knoppen voor tests met een permissiedialoog, geluid of ander zichtbaar
   // effect — die starten we niet automatisch samen met logEnvironment()
   const TESTS = [
      ['Webcam', testWebcam],
      ['Locatie', testGeolocation],
      ['Notificatie', testNotificationPermission],
      ['Spraakherkenning', testSpeechRecognition],
      ['Uitspreken', testSpeechSynthesis],
      ['Geluid', testAudioBeep],
      ['Klembord', testClipboard],
      ['Volledig scherm', testFullscreen],
      ['Nieuw venster', testNewWindow],
   ];

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

      const tests = document.createElement('div');
      tests.className = 'debug-panel__tests';
      TESTS.forEach(function (test) {
         const btn = document.createElement('button');
         btn.type = 'button';
         btn.className = 'debug-panel__test-btn';
         btn.textContent = test[0];
         btn.addEventListener('click', test[1]);
         tests.appendChild(btn);
      });

      elmBody = document.createElement('div');
      elmBody.className = 'debug-panel__body';

      panel.appendChild(header);
      panel.appendChild(tests);
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
    * Logt automatische, niet-storende metingen: browserfeatures die zonder
    * permissiedialoog, geluid of ander zichtbaar effect gecontroleerd kunnen worden.
    */
   async function logEnvironment() {
      log(`documentPictureInPicture: ${!!window.documentPictureInPicture}`);
      log(`userAgent: ${navigator.userAgent}`);

      logStorageTest('localStorage', localStorage);
      logStorageTest('sessionStorage', sessionStorage);
      logCookieTest();
      await logIndexedDbTest();

      log(`Drag and Drop: ${'ondrop' in document.createElement('div')}`);
      log(`deviceorientation: ${'ondeviceorientation' in window}`);
      log(`Notification: ${'Notification' in window}${'Notification' in window ? ' (permission: ' + Notification.permission + ')' : ''}`);
      log(`speechSynthesis: ${'speechSynthesis' in window}`);
      log(`SpeechRecognition: ${!!(window.SpeechRecognition || window.webkitSpeechRecognition)}`);
      log(`AudioContext: ${!!(window.AudioContext || window.webkitAudioContext)}`);
      log(`Clipboard API: ${!!navigator.clipboard}`);
      log(`Fullscreen API: ${document.fullscreenEnabled}`);
      log(`Permissions API: ${'permissions' in navigator}`);

      logCanvasTest('2d');
      logCanvasTest('webgl');
      logRafTest();
      await logFetchHeadersTest();
   }

   /**
    * Test lezen/schrijven op een Storage-object (localStorage of sessionStorage).
    *
    * @param {string} name - Naam voor in de log
    * @param {Storage} storage
    */
   function logStorageTest(name, storage) {
      try {
         storage.setItem('webbox-debug-test', '1');
         storage.removeItem('webbox-debug-test');
         log(`${name}: beschikbaar`);
      } catch (e) {
         log(`${name}: niet beschikbaar (${e.name})`);
      }
   }

   /**
    * Test of een cookie geschreven en teruggelezen kan worden.
    */
   function logCookieTest() {
      try {
         document.cookie = 'webbox-debug-test=1; path=/; SameSite=Lax';
         const readable = document.cookie.indexOf('webbox-debug-test=1') !== -1;
         document.cookie = 'webbox-debug-test=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
         log(`cookies: ${readable ? 'beschikbaar' : 'geweigerd of niet leesbaar'}`);
      } catch (e) {
         log(`cookies: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Test of een IndexedDB-databank geopend kan worden.
    *
    * @returns {Promise<void>}
    */
   function logIndexedDbTest() {
      return new Promise(function (resolve) {
         if (!window.indexedDB) {
            log('IndexedDB: niet aanwezig');
            resolve();
            return;
         }
         const request = indexedDB.open('webbox-debug-test');
         request.onsuccess = function () {
            log('IndexedDB: beschikbaar');
            request.result.close();
            indexedDB.deleteDatabase('webbox-debug-test');
            resolve();
         };
         request.onerror = function () {
            log(`IndexedDB: geweigerd (${request.error && request.error.name})`);
            resolve();
         };
      });
   }

   /**
    * Test of een canvas-context van het gegeven type aangemaakt kan worden.
    *
    * @param {string} type - '2d' of 'webgl'
    */
   function logCanvasTest(type) {
      try {
         const canvas = document.createElement('canvas');
         const context = canvas.getContext(type);
         log(`canvas ${type}: ${context ? 'beschikbaar' : 'niet beschikbaar'}`);
      } catch (e) {
         log(`canvas ${type}: fout — ${e.name}`);
      }
   }

   /**
    * Test of requestAnimationFrame effectief een callback vuurt.
    */
   function logRafTest() {
      const start = performance.now();
      window.requestAnimationFrame(function () {
         log(`requestAnimationFrame: vuurt na ${Math.round(performance.now() - start)}ms`);
      });
   }

   /**
    * Haalt de eigen pagina opnieuw op en logt welke response-headers de browser
    * effectief ontving — zo zie je wat Schoolyear's netwerklaag onderweg wijzigt of strip.
    * Set-Cookie is hier nooit bij: die verbergt de Fetch API altijd, ongeacht de omgeving.
    *
    * @returns {Promise<void>}
    */
   async function logFetchHeadersTest() {
      try {
         const response = await fetch(location.href, { cache: 'no-store' });
         const headers = [...response.headers.entries()].map(function (entry) { return `${entry[0]}: ${entry[1]}`; });
         log(`response-headers (${headers.length}): ${headers.join(' | ') || '(geen zichtbaar)'}`);
      } catch (e) {
         log(`response-headers: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Vraagt de webcam aan. Vereist een permissiedialoog — daarom enkel op klik.
    */
   async function testWebcam() {
      log('Webcam: aangevraagd');
      try {
         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
         log('Webcam: toegestaan');
         stream.getTracks().forEach(function (track) { track.stop(); });
      } catch (e) {
         log(`Webcam: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Vraagt de locatie aan. Vereist een permissiedialoog — daarom enkel op klik.
    */
   function testGeolocation() {
      log('Locatie: aangevraagd');
      navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
   }

   /**
    * Vraagt notificatie-permissie aan. Vereist een permissiedialoog — daarom enkel op klik.
    */
   async function testNotificationPermission() {
      log('Notificatie: permissie aangevraagd');
      try {
         const permission = await Notification.requestPermission();
         log(`Notificatie: ${permission}`);
      } catch (e) {
         log(`Notificatie: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Start spraakherkenning. Vereist een microfoon-permissiedialoog — daarom enkel op klik.
    */
   function testSpeechRecognition() {
      const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionApi) {
         log('Spraakherkenning: API niet aanwezig');
         return;
      }
      log('Spraakherkenning: gestart');
      const recognition = new SpeechRecognitionApi();
      recognition.addEventListener('start', handleSpeechRecognitionStart);
      recognition.addEventListener('error', handleSpeechRecognitionError);
      recognition.addEventListener('end', handleSpeechRecognitionEnd);
      recognition.start();
   }

   /**
    * Spreekt een testzin uit. Hoorbaar effect — daarom enkel op klik.
    */
   function testSpeechSynthesis() {
      if (!('speechSynthesis' in window)) {
         log('Uitspreken: API niet aanwezig');
         return;
      }
      log('Uitspreken: gestart');
      const utterance = new SpeechSynthesisUtterance('WebBox debugtest');
      utterance.addEventListener('end', handleSpeechSynthesisEnd);
      speechSynthesis.speak(utterance);
   }

   /**
    * Speelt een korte toon via de Web Audio API. Hoorbaar effect — daarom enkel op klik.
    */
   function testAudioBeep() {
      const AudioContextApi = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextApi) {
         log('Geluid: AudioContext niet aanwezig');
         return;
      }
      try {
         const context = new AudioContextApi();
         const oscillator = context.createOscillator();
         oscillator.frequency.value = 440;
         oscillator.connect(context.destination);
         oscillator.start();
         setTimeout(function () { oscillator.stop(); context.close(); }, AUDIO_BEEP_MS);
         log('Geluid: toon gestart');
      } catch (e) {
         log(`Geluid: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Test schrijven en teruglezen via het klembord. Vereist een permissiedialoog
    * in sommige browsers — daarom enkel op klik.
    */
   async function testClipboard() {
      if (!navigator.clipboard) {
         log('Klembord: API niet aanwezig');
         return;
      }
      try {
         await navigator.clipboard.writeText('webbox-debug-test');
         const readBack = await navigator.clipboard.readText();
         log(`Klembord: schrijven gelukt, terugleesbaar: ${readBack === 'webbox-debug-test'}`);
      } catch (e) {
         log(`Klembord: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Vraagt volledig scherm aan. Zichtbaar effect — daarom enkel op klik.
    */
   async function testFullscreen() {
      try {
         await document.documentElement.requestFullscreen();
         log('Volledig scherm: toegestaan');
         document.exitFullscreen();
      } catch (e) {
         log(`Volledig scherm: fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Opent een nieuw venster/tabblad. Zichtbaar effect — daarom enkel op klik.
    * Bevestigt of aparte vensters ook via window.open() meteen gesloten worden,
    * zoals we al vaststelden voor het PiP-venster.
    */
   function testNewWindow() {
      log('Nieuw venster: window.open() aangevraagd');
      const opened = window.open(location.href, '_blank', 'width=400,height=300');
      if (!opened) {
         log('Nieuw venster: geblokkeerd (null teruggegeven)');
         return;
      }
      opened.addEventListener('pagehide', handleTestWindowPagehide);
      log('Nieuw venster: geopend');
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

   function handleGeolocationSuccess() {
      log('Locatie: toegestaan');
   }

   function handleGeolocationError(e) {
      log(`Locatie: fout — ${e.code}: ${e.message}`);
   }

   function handleSpeechRecognitionStart() {
      log('Spraakherkenning: microfoon actief');
   }

   function handleSpeechRecognitionError(e) {
      log(`Spraakherkenning: fout — ${e.error}`);
   }

   function handleSpeechRecognitionEnd() {
      log('Spraakherkenning: gestopt');
   }

   function handleSpeechSynthesisEnd() {
      log('Uitspreken: afgerond');
   }

   function handleTestWindowPagehide() {
      log('Nieuw venster: gesloten (pagehide)');
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
