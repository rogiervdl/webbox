/* =====================================================
   WebBox — Exercises picker & README overlay
   ===================================================== */

const Exercises = (() => {

   let editors;
   let subjectsData = [];
   let currentReadme = '';
   let currentExerciseLabel = '';
   let currentExerciseBaseUrl = '';

   const LS_SUBJECT    = 'webbox-subject';
   const LS_MODULE     = 'webbox-module';
   const LS_EXERCISE   = 'webbox-exercise';
   const LS_CODE_PREFIX = 'webbox-code';

   let saveTimeout = null;
   let isLoading = false;

   // sleepstatus van het opgavepaneel
   let readmeDragOffsetX = 0;
   let readmeDragOffsetY = 0;
   let readmeHasBeenPositioned = false;

   // script dat de Live Preview van VS Code in elke geserveerde HTML injecteert
   const DEV_SERVER_SCRIPT = /<script[^>]*___vscode_livepreview_injected_script[^>]*><\/script>/g;

   // Schoolyear's examenbrowser (Electron-shell) sluit een los PiP-venster binnen
   // enkele milliseconden na aanmaak weer — vermoedelijk een lockdown-restrictie
   // tegen extra vensters. Op die userAgent slaan we PiP daarom over.
   const LOCKDOWN_BROWSER_PATTERN = /exams-client|Electron/;

   // talen waarvoor Monaco de codeblokken in de opgave kan inkleuren
   const LANGUAGE_MAP = {
      css:        'css',
      html:       'html',
      js:         'javascript',
      javascript: 'javascript',
   };

   const FILE_MAP = {
      html: 'index.html',
      css:  'styles.css',
      js:   'scripts.js',
   };

   const PANE_MAP = {
      html: 'pane-html',
      css:  'pane-css',
      js:   'pane-js',
   };

   // oude module-ids die naar hun huidige naam doorverwijzen
   const MODULE_ALIASSEN = {
      herhaling: 'examens',
   };

   // declaraties
   const selectSubject     = document.querySelector('#select-subject');
   const selectModule      = document.querySelector('#select-module');
   const selectExercise    = document.querySelector('#select-exercise');
   const btnReadme            = document.querySelector('#btn-readme');
   const modal                = document.querySelector('#modal-readme');
   const modalDialog          = document.querySelector('#modal-readme .modal__dialog');
   const modalHeader          = document.querySelector('#modal-readme .modal__header');
   const modalBody            = document.querySelector('#modal-readme-body');
   const btnModalClose        = document.querySelector('#btn-modal-close');
   const btnReadmeNewTab      = document.querySelector('#btn-readme-newtab');
   const brand                = document.querySelector('.toolbar__brand');
   const modalConfirm         = document.querySelector('#modal-confirm');
   const btnConfirmBewaarde   = document.querySelector('#btn-confirm-bewaarde');
   const btnConfirmStartcode  = document.querySelector('#btn-confirm-startcode');
   const modalConfirmBackdrop = document.querySelector('#modal-confirm .modal__backdrop');

   /**
    * Laadt en parseert startcodes/index.json5.
    */
   async function loadIndex() {
      try {
         const response = await fetch('startcodes/index.json5');
         if (!response.ok) return;
         const text = await response.text();
         subjectsData = JSON5.parse(text).subjects;
         populateSubjects();
         restoreSelection();
      } catch (e) {
         console.warn('Exercises: kon index.json5 niet laden', e);
      }
   }

   /**
    * Vult de vak-dropdown op basis van subjectsData.
    */
   function populateSubjects() {
      subjectsData.forEach(function (subject) {
         const option = document.createElement('option');
         option.value = subject.id;
         option.textContent = subject.label;
         selectSubject.appendChild(option);
      });
   }

   /**
    * Vult de module-dropdown op basis van het gekozen vak.
    *
    * @param {string} subjectId
    */
   function populateModules(subjectId) {
      const subject = subjectsData.find(function (s) { return s.id === subjectId; });
      if (!subject) return;
      subject.modules.forEach(function (mod) {
         const option = document.createElement('option');
         option.value = mod.id;
         option.textContent = mod.label;
         selectModule.appendChild(option);
      });
      selectModule.disabled = false;
   }

   /**
    * Vult de oefening-dropdown op basis van het gekozen vak en de gekozen module.
    *
    * @param {string} subjectId
    * @param {string} moduleId
    */
   function populateExercises(subjectId, moduleId) {
      const subject = subjectsData.find(function (s) { return s.id === subjectId; });
      const mod = subject?.modules.find(function (m) { return m.id === moduleId; });
      if (!mod) return;
      mod.exercises.filter(function (exercise) { return !exercise.hidden; }).forEach(function (exercise) {
         const option = document.createElement('option');
         option.value = exercise.id;
         option.textContent = exercise.label;
         selectExercise.appendChild(option);
      });
      selectExercise.disabled = false;
   }

   /**
    * Laadt de startcode-bestanden voor de geselecteerde oefening.
    *
    * @param {string} subjectId  - ID van het vak
    * @param {string} moduleId   - ID van de module
    * @param {string} exerciseId - ID van de oefening
    */
   async function loadExercise(subjectId, moduleId, exerciseId, confirmIfSaved = false) {
      const base = `startcodes/${subjectId}/${moduleId}/${exerciseId}/`;
      currentExerciseBaseUrl = base;
      currentReadme = '';
      btnReadme.disabled = true;
      btnReadme.title = 'geen opgave gegeven';
      btnReadmeNewTab.disabled = true;

      const subject   = subjectsData.find(function (s) { return s.id === subjectId; });
      const mod       = subject?.modules.find(function (m) { return m.id === moduleId; });
      const exercise  = mod?.exercises.find(function (e) { return e.id === exerciseId; });
      currentExerciseLabel = exercise?.label ?? '';
      const startfiles = exercise?.startfiles ?? ['html', 'css', 'js'];
      const collapsed  = exercise?.collapsed  ?? [];

      const hasSaved = ['html', 'css', 'js'].some(function (type) {
         return Store.get(codeKey(subjectId, moduleId, exerciseId, type)) !== null;
      });

      // bevestigingsdialoog eerst: de button click dient als user gesture voor PiP
      const useSaved = hasSaved && confirmIfSaved ? await confirmRestore() : hasSaved;

      // PiP aanvragen na bevestiging, terwijl we nog in de user gesture context zitten
      Debug.log(`loadExercise ${subjectId}/${moduleId}/${exerciseId}: PiP aanvragen? ${startfiles.includes('md')}`);
      const pipWindow = startfiles.includes('md') ? await requestPipWindow() : null;

      const fetches = {};
      ['html', 'css', 'js'].forEach(function (key) {
         fetches[key] = startfiles.includes(key) ? fetchText(`${base}${FILE_MAP[key]}`) : Promise.resolve(null);
      });

      const [html, css, js, readme] = await Promise.all([
         fetches.html,
         fetches.css,
         fetches.js,
         startfiles.includes('md') ? fetchText(`${base}readme.md`) : Promise.resolve(null),
      ]);

      isLoading = true;
      editors.html.setValue((useSaved ? Store.get(codeKey(subjectId, moduleId, exerciseId, 'html')) : null) ?? html ?? '');
      editors.css.setValue((useSaved ? Store.get(codeKey(subjectId, moduleId, exerciseId, 'css')) : null) ?? css ?? '');
      editors.js.setValue((useSaved ? Store.get(codeKey(subjectId, moduleId, exerciseId, 'js')) : null) ?? js ?? '');
      isLoading = false;

      applyPaneLayout(collapsed);
      Preview.setBaseUrl(base);
      Preview.run();

      // guard tegen race condition: selectie kan veranderd zijn tijdens fetch
      if (selectSubject.value !== subjectId || selectModule.value !== moduleId || selectExercise.value !== exerciseId) return;

      if (readme !== null) {
         currentReadme = readme;
         btnReadme.disabled = false;
         btnReadme.title = 'Toon opgave';
         btnReadmeNewTab.disabled = false;
         if (pipWindow) {
            await fillPipWindow(pipWindow);
         } else {
            await showReadme();
         }
      }
   }

   /**
    * Past de collapsed-staat van de editor-panels aan.
    *
    * @param {string[]} collapsed - Keys van te collappen panels ('html', 'css', 'js')
    */
   function applyPaneLayout(collapsed) {
      Object.keys(PANE_MAP).forEach(function (key) {
         const pane = document.querySelector(`#${PANE_MAP[key]}`);
         pane.classList.toggle('is-minimized', collapsed.includes(key));
         pane.style.flex = '';
      });
      Object.values(editors).forEach(function (editor) { editor.layout(); });
   }

   /**
    * Haalt tekst op via fetch. Geeft null terug bij 404 of fout.
    *
    * @param {string} url - URL om op te halen
    * @returns {Promise<string|null>}
    */
   async function fetchText(url) {
      try {
         const response = await fetch(url);
         if (!response.ok) return null;
         return stripDevServerScript(await response.text());
      } catch (e) {
         return null;
      }
   }

   /**
    * Haalt het script weg dat een ontwikkelserver in de startcode injecteert.
    * De Live Preview van VS Code plakt zijn eigen script in elke HTML die hij serveert;
    * dat zou anders als eerste regel in de editor van de student verschijnen.
    *
    * @param {string} text - De opgehaalde bestandsinhoud
    * @returns {string} dezelfde inhoud zonder het geïnjecteerde script
    */
   function stripDevServerScript(text) {
      return text.replace(DEV_SERVER_SCRIPT, '');
   }

   /**
    * Vraagt een nieuw PiP-venster aan. Geeft null terug als PiP niet beschikbaar is of mislukt.
    *
    * @returns {Promise<Window|null>}
    */
   async function requestPipWindow() {
      Debug.log(`documentPictureInPicture beschikbaar: ${!!window.documentPictureInPicture}`);
      if (!window.documentPictureInPicture) return null;

      if (LOCKDOWN_BROWSER_PATTERN.test(navigator.userAgent)) {
         Debug.log('PiP overgeslagen: lockdown-browser gedetecteerd (exams-client/Electron)');
         return null;
      }

      Debug.log('PiP: requestWindow aangevraagd');
      const hangTimer = setTimeout(logPipHang, Debug.PIP_HANG_TIMEOUT_MS);

      try {
         const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 600, height: 500, disallowReturnToOpener: true });
         clearTimeout(hangTimer);
         Debug.log('PiP: requestWindow opgelost');
         pipWindow.addEventListener('pagehide', handlePipWindowPagehide);
         return pipWindow;
      } catch (e) {
         clearTimeout(hangTimer);
         Debug.log(`PiP: requestWindow fout — ${e.name}: ${e.message}`);
         return null;
      }
   }

   /**
    * Logt dat requestWindow na de timeout nog niet opgelost is — een aanwijzing
    * voor een hangende call, wat in devtools anders onzichtbaar zou blijven.
    */
   function logPipHang() {
      Debug.log(`PiP: requestWindow nog niet opgelost na ${Debug.PIP_HANG_TIMEOUT_MS}ms — mogelijk hangende call`);
   }

   /**
    * Logt de positie/afmetingen van het PiP-venster en test of het programmatisch
    * verplaatst kan worden, als indicatie of native verslepen ook zou moeten werken.
    *
    * @param {Window} pipWindow
    */
   function logPipWindowState(pipWindow) {
      Debug.log(`PiP: positie ${pipWindow.screenX},${pipWindow.screenY} afmeting ${pipWindow.outerWidth}x${pipWindow.outerHeight}`);
      try {
         pipWindow.moveTo(pipWindow.screenX, pipWindow.screenY);
         Debug.log('PiP: moveTo() werd niet geweigerd');
      } catch (e) {
         Debug.log(`PiP: moveTo() fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Rendert de README naar HTML en kleurt de codeblokken in met de tokenizer van Monaco.
    * De kleuren komen als inline stijl mee, zodat dezelfde HTML ook buiten de app werkt.
    *
    * @returns {Promise<string>} de gerenderde HTML
    */
   async function renderReadme() {
      const doc = parseReadme();

      // de kleuring is versiering: gaat er iets mis, dan tonen we de opgave
      // zonder kleur in plaats van helemaal niet
      try {
         // marked zet de taal van de fence in een class; blokken zonder taal blijven ongekleurd
         const blocks = [...doc.querySelectorAll('pre > code[class^="language-"]')];

         await Promise.all(blocks.map(async function (block) {
            const language = LANGUAGE_MAP[block.className.replace('language-', '')];
            if (!language) return;

            // colorize scheidt regels met <br/>; in een pre doet de nieuwe regel dat zelf
            const colored = await monaco.editor.colorize(block.textContent, language, {});
            block.innerHTML = colored.replace(/<br\/>/g, '\n');
         }));

         if (blocks.length) return inlineTokenColors(doc.body.innerHTML);
      } catch (e) {
         console.warn('Exercises: syntaxkleuring overgeslagen', e);
         return parseReadme().body.innerHTML;
      }

      return doc.body.innerHTML;
   }

   /**
    * Parseert de README naar HTML en maakt de afbeeldingspaden absoluut.
    * Het parsen gebeurt in een inert document, want dat laadt nog geen afbeeldingen:
    * anders lost de browser de relatieve paden uit de markdown eerst op tegen de
    * app-URL, met een 404 per afbeelding tot gevolg.
    *
    * @returns {Document} het inerte document met de gerenderde markdown
    */
   function parseReadme() {
      const doc = new DOMParser().parseFromString(marked.parse(currentReadme), 'text/html');
      const absBase = new URL(currentExerciseBaseUrl, window.location.href).href;

      doc.querySelectorAll('img').forEach(function (img) {
         const src = img.getAttribute('src');
         if (src) img.setAttribute('src', new URL(src, absBase).href);
      });

      return doc;
   }

   /**
    * Zet de tokenkleuren van Monaco om van CSS-klassen naar inline stijl.
    * Die klassen komen uit de stylesheet van de app; een PiP-venster of een nieuw
    * tabblad heeft die niet, en zou de code dan kleurloos tonen.
    *
    * @param {string} html - De gerenderde HTML met de gekleurde codeblokken
    * @returns {string} dezelfde HTML, met de tokenkleuren als inline stijl
    */
   function inlineTokenColors(html) {
      // stijlen zijn pas berekenbaar zodra het element in de pagina hangt
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.cssText = 'position: absolute; visibility: hidden;';
      document.body.appendChild(container);

      container.querySelectorAll('span[class^="mtk"]').forEach(function (span) {
         const style = getComputedStyle(span);
         span.style.color = style.color;
         if (style.fontStyle === 'italic') span.style.fontStyle = 'italic';
         if (parseInt(style.fontWeight, 10) >= 600) span.style.fontWeight = 'bold';
         span.removeAttribute('class');
      });

      document.body.removeChild(container);

      return container.innerHTML;
   }

   /**
    * Geeft de kleuren voor een opgavevenster buiten de app, afgestemd op het thema.
    * Monaco kleurt de codeblokken volgens datzelfde thema, dus de ondergrond moet mee.
    *
    * @returns {object} kleuren voor achtergrond, tekst, links en code
    */
   function readmePalette() {
      const isDark = (document.documentElement.dataset.theme || 'dark') === 'dark';

      return isDark
         ? { bg: '#1e1e1e', ink: '#ccc',     link: '#6cb6ff', inlineBg: 'rgba(255 255 255 / 10%)', blockBg: 'rgba(255 255 255 / 6%)' }
         : { bg: '#ffffff', ink: '#1e1e1e',  link: '#0b5ed7', inlineBg: 'rgba(0 0 0 / 6%)',        blockBg: 'rgba(0 0 0 / 4%)' };
   }

   /**
    * Vult een PiP-venster met de gerenderde README van de huidige oefening.
    *
    * @param {Window} pipWindow
    */
   async function fillPipWindow(pipWindow) {
      const absBase = new URL(currentExerciseBaseUrl, window.location.href).href;
      const palette = readmePalette();
      const body = await renderReadme();

      pipWindow.document.title = currentExerciseLabel;
      pipWindow.document.head.innerHTML = `<style>
         * { box-sizing: border-box; margin: 0; padding: 0; }
         body { background: ${palette.bg}; color: ${palette.ink}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.7; overflow-y: auto; padding: 20px 24px; }
         h1 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
         h2 { font-size: 16px; margin-bottom: 10px; margin-top: 20px; }
         h3 { font-size: 14px; margin-bottom: 8px; margin-top: 16px; }
         p { margin-bottom: 10px; }
         ul, ol { margin-bottom: 10px; padding-left: 22px; }
         li { margin-bottom: 3px; }
         a { color: ${palette.link}; }
         code { background: ${palette.inlineBg}; border-radius: 3px; font-family: Consolas, monospace; font-size: 12px; padding: 1px 5px; }
         pre { background: ${palette.blockBg}; border-radius: 4px; margin-bottom: 10px; overflow-x: auto; padding: 12px; }
         pre code { background: none; padding: 0; }
         pre code:not([class]) { white-space: pre-wrap; }
         img { border-radius: 4px; max-width: 100%; }
         strong { font-weight: 600; }
      </style><base href="${absBase}">`;
      pipWindow.document.body.innerHTML = `<h1>${currentExerciseLabel}</h1>${body}`;
      logPipWindowState(pipWindow);
   }

   /**
    * Opent de README in PiP. Valt terug op de modal als PiP niet beschikbaar is.
    *
    * De try/catch hoort hier normaal niet thuis (interne logica), maar zonder devtools
    * in Schoolyear zou een fout hier anders stil verdwijnen — vandaar de debug-log.
    */
   async function openReadmeInPiP() {
      try {
         const pipWindow = await requestPipWindow();
         if (pipWindow) {
            Debug.log('PiP: venster ontvangen, opgave invullen');
            await fillPipWindow(pipWindow);
         } else {
            Debug.log('PiP: geen venster, val terug op modal');
            await showReadme();
         }
      } catch (e) {
         Debug.log(`openReadmeInPiP fout — ${e.name}: ${e.message}`);
      }
   }

   /**
    * Rendert de opgeslagen README als HTML en toont ze in het opgavepaneel.
    */
   async function showReadme() {
      document.querySelector('.modal__title').textContent = `Opgave — ${currentExerciseLabel}`;
      modalBody.innerHTML = await renderReadme();
      modalBody.insertAdjacentHTML('beforeend', Config.readmeTip);
      modal.setAttribute('aria-hidden', 'false');
      positionReadmePanelInitially();
   }

   /**
    * Zet het opgavepaneel bij de eerste keer tonen rechtsboven, buiten de weg van de editors.
    * Nadien laten we de laatst gekozen positie en afmeting staan, ook bij een volgende oefening.
    */
   function positionReadmePanelInitially() {
      if (readmeHasBeenPositioned) return;
      readmeHasBeenPositioned = true;
      positionReadmePanel(window.innerWidth - modalDialog.offsetWidth - 24, 64);
   }

   /**
    * Zet het opgavepaneel op de gegeven positie, geklemd binnen het scherm.
    *
    * @param {number} x
    * @param {number} y
    */
   function positionReadmePanel(x, y) {
      const maxX = Math.max(window.innerWidth - modalDialog.offsetWidth, 0);
      const maxY = Math.max(window.innerHeight - modalDialog.offsetHeight, 0);
      modalDialog.style.left = `${Math.min(Math.max(x, 0), maxX)}px`;
      modalDialog.style.top = `${Math.min(Math.max(y, 0), maxY)}px`;
   }

   /**
    * Opent de README als opgemaakte HTML-pagina in een nieuw tabblad.
    */
   async function openReadmeInNewTab() {
      const absBase = new URL(currentExerciseBaseUrl, window.location.href).href;
      const palette = readmePalette();
      const body = await renderReadme();
      const html = `<!DOCTYPE html>
<html lang="nl">
<head>
   <meta charset="UTF-8">
   <title>${currentExerciseLabel}</title>
   <base href="${absBase}">
   <style>
      body { background: ${palette.bg}; color: ${palette.ink}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.7; margin: 0 auto; max-width: 780px; padding: 40px 24px; }
      h1 { font-size: 24px; margin-bottom: 12px; margin-top: 0; }
      h2 { font-size: 20px; margin-top: 32px; }
      h3 { font-size: 17px; margin-top: 24px; }
      p { margin-bottom: 12px; }
      ul, ol { margin-bottom: 12px; padding-left: 28px; }
      li { margin-bottom: 4px; }
      a { color: ${palette.link}; }
      code { background: ${palette.inlineBg}; border-radius: 3px; font-family: Consolas, monospace; font-size: 13px; padding: 2px 5px; }
      pre { background: ${palette.blockBg}; border-radius: 6px; font-size: 13px; overflow-x: auto; padding: 16px; }
      pre code { background: none; padding: 0; }
      pre code:not([class]) { white-space: pre-wrap; }
      img { border-radius: 4px; max-width: 100%; }
      strong { font-weight: 600; }
   </style>
</head>
<body>
<h1>${currentExerciseLabel}</h1>
${body}
</body>
</html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
   }

   /**
    * Verbergt de modal.
    */
   function closeModal() {
      releaseFocus(modal, btnReadme);
      modal.setAttribute('aria-hidden', 'true');
   }

   /**
    * Haalt de focus uit een dialoogvenster voor het verborgen wordt.
    * aria-hidden op een element dat de focus bevat is een toegankelijkheidsfout:
    * hulpsoftware blijft dan een element aanwijzen dat er visueel niet meer is.
    *
    * @param {HTMLElement} dialog - Het dialoogvenster dat verborgen wordt
    * @param {HTMLElement} [target] - Element dat de focus overneemt; anders valt de focus weg
    */
   function releaseFocus(dialog, target) {
      if (!dialog.contains(document.activeElement)) return;

      if (target) target.focus();
      else document.activeElement.blur();
   }

   /**
    * Parseert de URL-hash naar een selectie-object.
    *
    * @returns {{ subjectId: string, moduleId: string, exerciseId: string }|null}
    */
   function getHashSelection() {
      const hash = location.hash.slice(1);
      if (!hash) return null;
      const parts = hash.split('/');
      if (parts.length < 1 || parts.length > 3) return null;
      const moduleId = parts[1] || null;

      return {
         subjectId: parts[0] || null,
         moduleId: MODULE_ALIASSEN[moduleId] || moduleId,
         exerciseId: parts[2] || null,
      };
   }

   /**
    * Zet de URL-hash op basis van de huidige selectie.
    *
    * @param {string} subjectId
    * @param {string} moduleId
    * @param {string} exerciseId
    */
   function setHash(subjectId, moduleId, exerciseId) {
      const parts = [subjectId, moduleId, exerciseId].filter(Boolean);
      history.replaceState(null, '', `#${parts.join('/')}`);
   }

   /**
    * Verwijdert de URL-hash.
    */
   function clearHash() {
      history.replaceState(null, '', location.pathname + location.search);
   }

   /**
    * Bouwt de localStorage-sleutel voor de editorinhoud van een oefening.
    *
    * @param {string} subjectId
    * @param {string} moduleId
    * @param {string} exerciseId
    * @param {string} type - 'html', 'css' of 'js'
    * @returns {string}
    */
   function codeKey(subjectId, moduleId, exerciseId, type) {
      return `${LS_CODE_PREFIX}/${subjectId}/${moduleId}/${exerciseId}/${type}`;
   }

   /**
    * Slaat de huidige editorinhoud op in localStorage.
    */
   function saveCode() {
      const subjectId  = selectSubject.value;
      const moduleId   = selectModule.value;
      const exerciseId = selectExercise.value;
      if (!subjectId || !moduleId || !exerciseId) return;
      Store.set(codeKey(subjectId, moduleId, exerciseId, 'html'), editors.html.getValue());
      Store.set(codeKey(subjectId, moduleId, exerciseId, 'css'), editors.css.getValue());
      Store.set(codeKey(subjectId, moduleId, exerciseId, 'js'), editors.js.getValue());
   }

   /**
    * Toont een dialoogvenster en vraagt of de bewaarde versie geladen moet worden.
    * Geeft true terug voor "bewaarde versie", false voor "startcode".
    *
    * @returns {Promise<boolean>}
    */
   function confirmRestore() {
      return new Promise(function (resolve) {
         modalConfirm.setAttribute('aria-hidden', 'false');

         function finish(useSaved) {
            releaseFocus(modalConfirm, selectExercise);
            modalConfirm.setAttribute('aria-hidden', 'true');
            btnConfirmBewaarde.removeEventListener('click', onBewaarde);
            btnConfirmStartcode.removeEventListener('click', onStartcode);
            modalConfirmBackdrop.removeEventListener('click', onBackdrop);
            resolve(useSaved);
         }

         function onBewaarde() { finish(true); }
         function onStartcode() { finish(false); }
         function onBackdrop() { finish(true); }

         btnConfirmBewaarde.addEventListener('click', onBewaarde);
         btnConfirmStartcode.addEventListener('click', onStartcode);
         modalConfirmBackdrop.addEventListener('click', onBackdrop);
      });
   }

   /**
    * Plant een debounced opslaan in (1s na de laatste wijziging).
    */
   function scheduleSave() {
      if (isLoading) return;
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCode, 1000);
   }

   /**
    * Herstelt de laatste selectie vanuit de URL-hash of localStorage.
    */
   function restoreSelection() {
      const fromHash = getHashSelection();
      const savedSubject = fromHash?.subjectId ?? Store.get(LS_SUBJECT);
      if (!savedSubject) return;
      selectSubject.value = savedSubject;
      if (selectSubject.value !== savedSubject) return;

      populateModules(savedSubject);
      if (fromHash && !fromHash.moduleId) return;

      const savedModule = fromHash?.moduleId ?? Store.get(LS_MODULE);
      if (!savedModule) return;
      selectModule.value = savedModule;
      if (selectModule.value !== savedModule) return;

      populateExercises(savedSubject, savedModule);
      if (fromHash && !fromHash.exerciseId) return;

      const savedExercise = fromHash?.exerciseId ?? Store.get(LS_EXERCISE);
      if (!savedExercise) return;
      selectExercise.value = savedExercise;
      if (selectExercise.value !== savedExercise) return;

      loadExercise(savedSubject, savedModule, savedExercise);
   }

   // event handlers
   function handleBrandClick() {
      selectSubject.value = '';
      selectModule.innerHTML = '<option value="">Module...</option>';
      selectModule.disabled = true;
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      btnReadme.title = 'geen opgave gegeven';
      btnReadmeNewTab.disabled = true;
      currentReadme = '';
      currentExerciseLabel = '';
      currentExerciseBaseUrl = '';
      Store.remove(LS_SUBJECT);
      Store.remove(LS_MODULE);
      Store.remove(LS_EXERCISE);
      clearHash();
      editors.html.setValue(Config.defaults.html);
      editors.css.setValue(Config.defaults.css);
      editors.js.setValue(Config.defaults.js);
      Preview.run();
   }

   function handleSubjectChange() {
      selectModule.innerHTML = '<option value="">Module...</option>';
      selectModule.disabled = true;
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      btnReadmeNewTab.disabled = true;
      currentReadme = '';

      const subjectId = selectSubject.value;
      if (!subjectId) {
         clearHash();
         return;
      }
      Store.set(LS_SUBJECT, subjectId);
      Store.remove(LS_MODULE);
      Store.remove(LS_EXERCISE);
      setHash(subjectId);
      populateModules(subjectId);
   }

   function handleModuleChange() {
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      btnReadmeNewTab.disabled = true;
      currentReadme = '';

      const subjectId = selectSubject.value;
      const moduleId  = selectModule.value;
      if (!subjectId || !moduleId) return;
      Store.set(LS_MODULE, moduleId);
      Store.remove(LS_EXERCISE);
      setHash(subjectId, moduleId);
      populateExercises(subjectId, moduleId);
   }

   function handleExerciseChange() {
      const subjectId  = selectSubject.value;
      const moduleId   = selectModule.value;
      const exerciseId = selectExercise.value;
      if (!subjectId || !moduleId || !exerciseId) {
         btnReadme.disabled = true;
         btnReadmeNewTab.disabled = true;
         currentReadme = '';
         return;
      }
      Store.set(LS_EXERCISE, exerciseId);
      setHash(subjectId, moduleId, exerciseId);
      loadExercise(subjectId, moduleId, exerciseId, true);
   }

   function handleBtnReadmeClick() {
      Debug.log(`Opgave-knop geklikt (currentReadme: ${currentReadme ? currentReadme.length + ' tekens' : 'leeg'})`);
      if (currentReadme) openReadmeInPiP();
   }

   function handlePipWindowPagehide() {
      Debug.log('PiP: venster gesloten (pagehide)');
   }

   function handleBtnReadmeNewTabClick() {
      if (currentReadme) openReadmeInNewTab();
   }

   function handleModalClose() {
      closeModal();
   }

   function handleKeydown(e) {
      if (e.key === 'Escape') closeModal();
   }

   function handleModalHeaderPointerdown(e) {
      // klikken op de knoppen in de titelbalk mogen niet slepen starten
      if (e.target.closest('.modal__header-actions')) return;
      const rect = modalDialog.getBoundingClientRect();
      readmeDragOffsetX = e.clientX - rect.left;
      readmeDragOffsetY = e.clientY - rect.top;
      modalHeader.setPointerCapture(e.pointerId);
   }

   function handleModalHeaderPointermove(e) {
      if (!modalHeader.hasPointerCapture(e.pointerId)) return;
      positionReadmePanel(e.clientX - readmeDragOffsetX, e.clientY - readmeDragOffsetY);
   }

   function handleModalHeaderPointerup(e) {
      if (modalHeader.hasPointerCapture(e.pointerId)) modalHeader.releasePointerCapture(e.pointerId);
   }

   /**
    * Initialiseert de exercises-module met de Monaco-editors.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      // toon kale URL's in de opgave als tekst; enkel [tekst](url) wordt een link
      marked.setOptions({ gfm: false });

      // event bindings
      editors.html.onDidChangeModelContent(scheduleSave);
      editors.css.onDidChangeModelContent(scheduleSave);
      editors.js.onDidChangeModelContent(scheduleSave);

      brand.addEventListener('click', handleBrandClick);
      selectSubject.addEventListener('change', handleSubjectChange);
      selectModule.addEventListener('change', handleModuleChange);
      selectExercise.addEventListener('change', handleExerciseChange);
      btnReadme.addEventListener('click', handleBtnReadmeClick);
      btnReadmeNewTab.addEventListener('click', handleBtnReadmeNewTabClick);
      btnModalClose.addEventListener('click', handleModalClose);
      document.addEventListener('keydown', handleKeydown);
      modalHeader.addEventListener('pointerdown', handleModalHeaderPointerdown);
      modalHeader.addEventListener('pointermove', handleModalHeaderPointermove);
      modalHeader.addEventListener('pointerup', handleModalHeaderPointerup);

      loadIndex();
   }


   // return facade
   return {
      init,
   };

})();
