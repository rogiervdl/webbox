/* =====================================================
   WebBox — Exercises picker & README overlay
   ===================================================== */

const Exercises = (() => {

   let editors;
   let subjectsData = [];
   let currentReadme = '';
   let currentExerciseLabel = '';
   let currentExerciseBaseUrl = '';
   let currentScreenshotUrl = '';

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
   const btnScreenshotPip  = document.querySelector('#btn-screenshot-pip');
   const modal             = document.querySelector('#modal-readme');
   const modalBody         = document.querySelector('#modal-readme-body');
   const btnModalClose     = document.querySelector('#btn-modal-close');
   const btnReadmeNewTab   = document.querySelector('#btn-readme-newtab');
   const modalBackdrop     = document.querySelector('.modal__backdrop');

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
      mod.exercises.forEach(function (exercise) {
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
      currentScreenshotUrl = '';
      btnReadme.disabled = true;
      btnReadmeNewTab.disabled = true;
      btnScreenshotPip.disabled = true;

      const subject   = subjectsData.find(function (s) { return s.id === subjectId; });
      const mod       = subject?.modules.find(function (m) { return m.id === moduleId; });
      const exercise  = mod?.exercises.find(function (e) { return e.id === exerciseId; });
      currentExerciseLabel = exercise?.label ?? '';
      const startfiles = exercise?.startfiles ?? ['html', 'css', 'js'];
      const collapsed  = exercise?.collapsed  ?? [];

      const fetches = {};
      ['html', 'css', 'js'].forEach(function (key) {
         fetches[key] = startfiles.includes(key) ? fetchText(`${base}${FILE_MAP[key]}`) : Promise.resolve(null);
      });

      const [html, css, js, readme, screenshotExists] = await Promise.all([
         fetches.html,
         fetches.css,
         fetches.js,
         fetchText(`${base}readme.md`),
         checkExists(`${base}img/screenshot.png`),
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
         btnReadmeNewTab.disabled = false;
         showReadme();
      }

      if (screenshotExists) {
         currentScreenshotUrl = `${base}img/screenshot.png`;
         btnScreenshotPip.disabled = false;
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
    * Controleert of een bestand bestaat via HEAD request.
    *
    * @param {string} url
    * @returns {Promise<boolean>}
    */
   async function checkExists(url) {
      try {
         const response = await fetch(url, { method: 'HEAD' });
         return response.ok;
      } catch (e) {
         return false;
      }
   }

   /**
    * Toont de screenshot van de oefening in een Picture-in-Picture venster.
    */
   async function openScreenshotInPiP() {
      if (!window.documentPictureInPicture) {
         alert('Picture-in-Picture wordt niet ondersteund in deze browser.');
         return;
      }
      const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 540, height: 420, disallowReturnToOpener: true });
      pipWindow.document.head.innerHTML = `<style>
         * { box-sizing: border-box; margin: 0; padding: 0; }
         body { background: #1e1e1e; height: 100vh; }
         img { display: block; height: 100%; object-fit: contain; width: 100%; }
      </style>`;
      pipWindow.document.body.innerHTML = `<img src="${new URL(currentScreenshotUrl, window.location.href).href}" alt="">`;
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
    */
   function fixImagePaths(container) {
      container.querySelectorAll('img').forEach(function (img) {
         const src = img.getAttribute('src');
         if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.src = `${currentExerciseBaseUrl}${src}`;
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

   // event handlers
   function handleSubjectChange() {
      selectModule.innerHTML = '<option value="">Module...</option>';
      selectModule.disabled = true;
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      btnReadmeNewTab.disabled = true;
      btnScreenshotPip.disabled = true;
      currentReadme = '';
      currentScreenshotUrl = '';

      const subjectId = selectSubject.value;
      if (!subjectId) return;
      populateModules(subjectId);
   }

   function handleModuleChange() {
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      btnReadmeNewTab.disabled = true;
      btnScreenshotPip.disabled = true;
      currentReadme = '';
      currentScreenshotUrl = '';

      const subjectId = selectSubject.value;
      const moduleId  = selectModule.value;
      if (!subjectId || !moduleId) return;
      populateExercises(subjectId, moduleId);
   }

   function handleExerciseChange() {
      const subjectId  = selectSubject.value;
      const moduleId   = selectModule.value;
      const exerciseId = selectExercise.value;
      if (!subjectId || !moduleId || !exerciseId) {
         btnReadme.disabled = true;
         btnReadmeNewTab.disabled = true;
         btnScreenshotPip.disabled = true;
         currentReadme = '';
         currentScreenshotUrl = '';
         return;
      }
      loadExercise(subjectId, moduleId, exerciseId);
   }

   function handleBtnReadmeClick() {
      if (currentReadme) showReadme();
   }

   function handleBtnReadmeNewTabClick() {
      if (currentReadme) openReadmeInNewTab();
   }

   function handleBtnScreenshotPipClick() {
      if (currentScreenshotUrl) openScreenshotInPiP();
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
      selectSubject.addEventListener('change', handleSubjectChange);
      selectModule.addEventListener('change', handleModuleChange);
      selectExercise.addEventListener('change', handleExerciseChange);
      btnReadme.addEventListener('click', handleBtnReadmeClick);
      btnReadmeNewTab.addEventListener('click', handleBtnReadmeNewTabClick);
      btnScreenshotPip.addEventListener('click', handleBtnScreenshotPipClick);
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
