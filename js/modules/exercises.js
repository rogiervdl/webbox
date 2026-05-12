/* =====================================================
   WebBox — Exercises picker & README overlay
   ===================================================== */

const Exercises = (() => {

   let editors;
   let subjectsData = [];
   let currentReadme = '';
   let currentExerciseBaseUrl = '';

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
   const selectSubject  = document.querySelector('#select-subject');
   const selectExercise = document.querySelector('#select-exercise');
   const btnReadme      = document.querySelector('#btn-readme');
   const modal          = document.querySelector('#modal-readme');
   const modalBody      = document.querySelector('#modal-readme-body');
   const btnModalClose  = document.querySelector('#btn-modal-close');
   const modalBackdrop  = document.querySelector('.modal__backdrop');

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
    * Laadt de startcode-bestanden voor de geselecteerde oefening.
    *
    * @param {string} subjectId - ID van het vak
    * @param {string} exerciseId - ID van de oefening
    */
   async function loadExercise(subjectId, exerciseId) {
      const base = `startcodes/${subjectId}/${exerciseId}/`;
      currentExerciseBaseUrl = base;
      currentReadme = '';
      btnReadme.disabled = true;

      const subject   = subjectsData.find(function (s) { return s.id === subjectId; });
      const exercise  = subject?.exercises.find(function (e) { return e.id === exerciseId; });
      const startfiles = exercise?.startfiles ?? ['html', 'css', 'js'];
      const collapsed  = exercise?.collapsed  ?? [];

      const fetches = {};
      ['html', 'css', 'js'].forEach(function (key) {
         fetches[key] = startfiles.includes(key) ? fetchText(`${base}${FILE_MAP[key]}`) : Promise.resolve(null);
      });

      const [html, css, js, readme] = await Promise.all([
         fetches.html,
         fetches.css,
         fetches.js,
         fetchText(`${base}readme.md`),
      ]);

      editors.html.setValue(html ?? '');
      editors.css.setValue(css ?? '');
      editors.js.setValue(js ?? '');

      applyPaneLayout(collapsed);

      if (readme !== null) {
         currentReadme = readme;
         btnReadme.disabled = false;
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
    * Rendert de opgeslagen README als HTML en toont de modal.
    */
   function showReadme() {
      const html = marked.parse(currentReadme);
      modalBody.innerHTML = html;
      fixImagePaths(modalBody);
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
    * Verbergt de modal.
    */
   function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
   }

   // event handlers
   function handleSubjectChange() {
      const subjectId = selectSubject.value;
      selectExercise.innerHTML = '<option value="">Oefening...</option>';
      selectExercise.disabled = true;
      btnReadme.disabled = true;
      currentReadme = '';

      if (!subjectId) return;

      const subject = subjectsData.find(function (s) { return s.id === subjectId; });
      if (!subject) return;

      subject.exercises.forEach(function (exercise) {
         const option = document.createElement('option');
         option.value = exercise.id;
         option.textContent = exercise.label;
         selectExercise.appendChild(option);
      });
      selectExercise.disabled = false;
   }

   function handleExerciseChange() {
      const subjectId  = selectSubject.value;
      const exerciseId = selectExercise.value;
      if (!subjectId || !exerciseId) return;
      loadExercise(subjectId, exerciseId);
   }

   function handleBtnReadmeClick() {
      if (currentReadme) showReadme();
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
      selectExercise.addEventListener('change', handleExerciseChange);
      btnReadme.addEventListener('click', handleBtnReadmeClick);
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
