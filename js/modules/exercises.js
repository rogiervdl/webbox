/* =====================================================
   WebBox — Exercises picker & README overlay
   ===================================================== */

const Exercises = (() => {

   let editors;
   let subjectsData = [];
   let currentReadme = '';
   let currentExerciseLabel = '';
   let currentExerciseBaseUrl = '';

   const LS_SUBJECT  = 'webbox-subject';
   const LS_MODULE   = 'webbox-module';
   const LS_EXERCISE = 'webbox-exercise';

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

   // declaraties
   const selectSubject     = document.querySelector('#select-subject');
   const selectModule      = document.querySelector('#select-module');
   const selectExercise    = document.querySelector('#select-exercise');
   const btnReadme         = document.querySelector('#btn-readme');
   const modal             = document.querySelector('#modal-readme');
   const modalBody         = document.querySelector('#modal-readme-body');
   const btnModalClose     = document.querySelector('#btn-modal-close');
   const btnReadmeNewTab   = document.querySelector('#btn-readme-newtab');
   const modalBackdrop     = document.querySelector('.modal__backdrop');
   const brand             = document.querySelector('.toolbar__brand');

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
   async function loadExercise(subjectId, moduleId, exerciseId) {
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

      // PiP aanvragen vóór de fetch, terwijl we nog in de user gesture context zitten
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

      editors.html.setValue(html ?? '');
      editors.css.setValue(css ?? '');
      editors.js.setValue(js ?? '');

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
            fillPipWindow(pipWindow);
         } else {
            showReadme();
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
    * Vult een PiP-venster met de gerenderde README van de huidige oefening.
    *
    * @param {Window} pipWindow
    */
   function fillPipWindow(pipWindow) {
      const absBase = new URL(currentExerciseBaseUrl, window.location.href).href;
      pipWindow.document.title = currentExerciseLabel;
      pipWindow.document.head.innerHTML = `<style>
         * { box-sizing: border-box; margin: 0; padding: 0; }
         body { background: #1e1e1e; color: #ccc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.7; overflow-y: auto; padding: 20px 24px; }
         h1 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
         h2 { font-size: 16px; margin-bottom: 10px; margin-top: 20px; }
         h3 { font-size: 14px; margin-bottom: 8px; margin-top: 16px; }
         p { margin-bottom: 10px; }
         ul, ol { margin-bottom: 10px; padding-left: 22px; }
         li { margin-bottom: 3px; }
         code { background: rgba(255 255 255 / 10%); border-radius: 3px; font-family: Consolas, monospace; font-size: 12px; padding: 1px 5px; }
         pre { background: rgba(255 255 255 / 6%); border-radius: 4px; margin-bottom: 10px; overflow-x: auto; padding: 12px; }
         pre code { background: none; padding: 0; }
         img { border-radius: 4px; max-width: 100%; }
         strong { font-weight: 600; }
      </style><base href="${absBase}">`;
      pipWindow.document.body.innerHTML = `<h1>${currentExerciseLabel}</h1>${marked.parse(currentReadme)}`;
      fixImagePaths(pipWindow.document.body, absBase);
   }

   /**
    * Opent de README in PiP. Valt terug op de modal als PiP niet beschikbaar is.
    */
   async function openReadmeInPiP() {
      const pipWindow = await requestPipWindow();
      if (pipWindow) {
         fillPipWindow(pipWindow);
      } else {
         showReadme();
      }
   }

   /**
    * Rendert de opgeslagen README als HTML en toont de modal.
    */
   function showReadme() {
      document.querySelector('.modal__title').textContent = `Opgave — ${currentExerciseLabel}`;
      modalBody.innerHTML = marked.parse(currentReadme);
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
   function openReadmeInNewTab() {
      const absBase = new URL(currentExerciseBaseUrl, window.location.href).href;
      const html = `<!DOCTYPE html>
<html lang="nl">
<head>
   <meta charset="UTF-8">
   <title>${currentExerciseLabel}</title>
   <base href="${absBase}">
   <style>
      body { color: #1e1e1e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.7; margin: 0 auto; max-width: 780px; padding: 40px 24px; }
      h1 { font-size: 24px; margin-bottom: 12px; margin-top: 0; }
      h2 { font-size: 20px; margin-top: 32px; }
      h3 { font-size: 17px; margin-top: 24px; }
      p { margin-bottom: 12px; }
      ul, ol { margin-bottom: 12px; padding-left: 28px; }
      li { margin-bottom: 4px; }
      code { background: #f0f0f0; border-radius: 3px; font-family: Consolas, monospace; font-size: 13px; padding: 2px 5px; }
      pre { background: #f6f8fa; border-radius: 6px; font-size: 13px; overflow-x: auto; padding: 16px; }
      pre code { background: none; padding: 0; }
      img { border-radius: 4px; max-width: 100%; }
      strong { font-weight: 600; }
   </style>
</head>
<body>
<h1>${currentExerciseLabel}</h1>
${marked.parse(currentReadme)}
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
      return {
         subjectId: parts[0] || null,
         moduleId: parts[1] || null,
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
      history.replaceState(null, '', `#${subjectId}/${moduleId}/${exerciseId}`);
   }

   /**
    * Verwijdert de URL-hash.
    */
   function clearHash() {
      history.replaceState(null, '', location.pathname + location.search);
   }

   /**
    * Herstelt de laatste selectie vanuit de URL-hash of localStorage.
    */
   function restoreSelection() {
      const fromHash = getHashSelection();
      const savedSubject = fromHash?.subjectId ?? localStorage.getItem(LS_SUBJECT);
      if (!savedSubject) return;
      selectSubject.value = savedSubject;
      if (selectSubject.value !== savedSubject) return;

      populateModules(savedSubject);
      if (fromHash && !fromHash.moduleId) return;

      const savedModule = fromHash?.moduleId ?? localStorage.getItem(LS_MODULE);
      if (!savedModule) return;
      selectModule.value = savedModule;
      if (selectModule.value !== savedModule) return;

      populateExercises(savedSubject, savedModule);
      if (fromHash && !fromHash.exerciseId) return;

      const savedExercise = fromHash?.exerciseId ?? localStorage.getItem(LS_EXERCISE);
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
      localStorage.removeItem(LS_SUBJECT);
      localStorage.removeItem(LS_MODULE);
      localStorage.removeItem(LS_EXERCISE);
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
      if (!subjectId) return;
      localStorage.setItem(LS_SUBJECT, subjectId);
      localStorage.removeItem(LS_MODULE);
      localStorage.removeItem(LS_EXERCISE);
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
      localStorage.setItem(LS_MODULE, moduleId);
      localStorage.removeItem(LS_EXERCISE);
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
      localStorage.setItem(LS_EXERCISE, exerciseId);
      setHash(subjectId, moduleId, exerciseId);
      loadExercise(subjectId, moduleId, exerciseId);
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

      // event bindings
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
