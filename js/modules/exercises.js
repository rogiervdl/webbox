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
   const modalBody            = document.querySelector('#modal-readme-body');
   const btnModalClose        = document.querySelector('#btn-modal-close');
   const btnReadmeNewTab      = document.querySelector('#btn-readme-newtab');
   const modalBackdrop        = document.querySelector('#modal-readme .modal__backdrop');
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
         return await response.text();
      } catch (e) {
         return null;
      }
   }

   /**
    * Vraagt een nieuw PiP-venster aan. Geeft null terug als PiP niet beschikbaar is of mislukt.
    *
    * @returns {Promise<Window|null>}
    */
   async function requestPipWindow() {
      if (!window.documentPictureInPicture) return null;
      try {
         return await window.documentPictureInPicture.requestWindow({ width: 600, height: 500, disallowReturnToOpener: true });
      } catch (e) {
         return null;
      }
   }

   /**
    * Rendert de README naar HTML en kleurt de codeblokken in met de tokenizer van Monaco.
    * De kleuren komen als inline stijl mee, zodat dezelfde HTML ook buiten de app werkt.
    *
    * @returns {Promise<string>} de gerenderde HTML
    */
   async function renderReadme() {
      const container = document.createElement('div');
      container.innerHTML = marked.parse(currentReadme);

      // de kleuring is versiering: gaat er iets mis, dan tonen we de opgave
      // zonder kleur in plaats van helemaal niet
      try {
         // marked zet de taal van de fence in een class; blokken zonder taal blijven ongekleurd
         const blocks = Array.from(container.querySelectorAll('pre > code[class^="language-"]'));

         await Promise.all(blocks.map(async function (block) {
            const language = LANGUAGE_MAP[block.className.replace('language-', '')];
            if (!language) return;

            // colorize scheidt regels met <br/>; in een pre doet de nieuwe regel dat zelf
            const colored = await monaco.editor.colorize(block.textContent, language, {});
            block.innerHTML = colored.replace(/<br\/>/g, '\n');
         }));

         if (blocks.length) inlineTokenColors(container);
      } catch (e) {
         console.warn('Exercises: syntaxkleuring overgeslagen', e);
         container.innerHTML = marked.parse(currentReadme);
      }

      return container.innerHTML;
   }

   /**
    * Zet de tokenkleuren van Monaco om van CSS-klassen naar inline stijl.
    * Die klassen komen uit de stylesheet van de app; een PiP-venster of een nieuw
    * tabblad heeft die niet, en zou de code dan kleurloos tonen.
    *
    * @param {HTMLElement} container - De container met de gekleurde codeblokken
    */
   function inlineTokenColors(container) {
      // stijlen zijn pas berekenbaar zodra het element in de pagina hangt
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
      container.removeAttribute('style');
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
         img { border-radius: 4px; max-width: 100%; }
         strong { font-weight: 600; }
      </style><base href="${absBase}">`;
      pipWindow.document.body.innerHTML = `<h1>${currentExerciseLabel}</h1>${body}`;
      fixImagePaths(pipWindow.document.body, absBase);
   }

   /**
    * Opent de README in PiP. Valt terug op de modal als PiP niet beschikbaar is.
    */
   async function openReadmeInPiP() {
      const pipWindow = await requestPipWindow();
      if (pipWindow) {
         await fillPipWindow(pipWindow);
      } else {
         await showReadme();
      }
   }

   /**
    * Rendert de opgeslagen README als HTML en toont de modal.
    */
   async function showReadme() {
      document.querySelector('.modal__title').textContent = `Opgave — ${currentExerciseLabel}`;
      modalBody.innerHTML = await renderReadme();
      fixImagePaths(modalBody);
      modalBody.insertAdjacentHTML('beforeend', Config.readmeTip);
      modal.setAttribute('aria-hidden', 'false');
   }

   /**
    * Zet relatieve afbeeldingspaden om naar absolute paden t.o.v. de oefening.
    *
    * @param {HTMLElement} container - De container met de gerenderde markdown
    * @param {string} [base] - Optionele base URL; gebruikt currentExerciseBaseUrl als niet opgegeven
    */
   function fixImagePaths(container, base) {
      const resolvedBase = base ?? currentExerciseBaseUrl;
      container.querySelectorAll('img').forEach(function (img) {
         const src = img.getAttribute('src');
         if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.src = `${resolvedBase}${src}`;
         }
      });
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
      modal.setAttribute('aria-hidden', 'true');
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
      if (currentReadme) openReadmeInPiP();
   }

   function handleBtnReadmeNewTabClick() {
      if (currentReadme) openReadmeInNewTab();
   }

   function handleModalClose() {
      closeModal();
   }

   function handleModalBackdropClick() {
      closeModal();
   }

   function handleKeydown(e) {
      if (e.key === 'Escape') closeModal();
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
      modalBackdrop.addEventListener('click', handleModalBackdropClick);
      document.addEventListener('keydown', handleKeydown);

      loadIndex();
   }


   // return facade
   return {
      init,
   };

})();
