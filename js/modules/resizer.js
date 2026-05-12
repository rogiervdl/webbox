/* =====================================================
   WebBox — Resizer
   ===================================================== */

const Resizer = (() => {

   let editors;

   // declaraties
   const workspace      = document.querySelector('#workspace');
   const mainResizer    = document.querySelector('#main-resizer');
   const editorResizers = document.querySelectorAll('.resizer[data-axis]');
   const panes = [
      document.querySelector('#pane-html'),
      document.querySelector('#pane-css'),
      document.querySelector('#pane-js'),
   ];

   function mainResizerIsVertical() {
      return workspace.classList.contains('layout-stacked');
   }

   /**
    * Maakt een sleepbare resizer tussen twee panelen.
    *
    * @param {HTMLElement} resizerEl   - Het resizer-element
    * @param {Function}    getA        - Geeft het eerste paneel terug
    * @param {Function}    getB        - Geeft het tweede paneel terug
    * @param {null}        getSize     - Ongebruikt, gereserveerd
    * @param {Function}    setSize     - Past de flex-grootte van beide panelen aan
    * @param {Function}    isVerticalFn - Geeft true terug als de richting verticaal is
    */
   function initResizer(resizerEl, getA, getB, getSize, setSize, isVerticalFn) {
      let startPos, startSizeA, startSizeB;

      function onMove(e) {
         const delta = (isVerticalFn() ? e.clientY : e.clientX) - startPos;
         const newA = Math.max(80, startSizeA + delta);
         const newB = Math.max(80, startSizeB - delta);
         setSize(getA(), getB(), newA, newB);
         Object.values(editors).forEach(function (ed) { ed.layout(); });
      }

      function onUp() {
         document.querySelector('#preview-frame').style.pointerEvents = '';
         resizerEl.classList.remove('is-dragging');
         document.removeEventListener('mousemove', onMove);
         document.removeEventListener('mouseup', onUp);
      }

      function handleResizerMousedown(e) {
         e.preventDefault();
         resizerEl.classList.add('is-dragging');
         startPos   = isVerticalFn() ? e.clientY : e.clientX;
         startSizeA = isVerticalFn() ? getA().offsetHeight : getA().offsetWidth;
         startSizeB = isVerticalFn() ? getB().offsetHeight : getB().offsetWidth;

         document.querySelector('#preview-frame').style.pointerEvents = 'none';

         document.addEventListener('mousemove', onMove);
         document.addEventListener('mouseup', onUp);
      }

      resizerEl.addEventListener('mousedown', handleResizerMousedown);
   }

   /**
    * Initialiseert alle resizers met de Monaco-editors voor herberekening na slepen.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      initResizer(
         mainResizer,
         function () { return document.querySelector('#editors-panel'); },
         function () { return document.querySelector('#preview-panel'); },
         null,
         function (a, b, sA) {
            const isVert = mainResizerIsVertical();
            const total  = isVert ? a.parentElement.offsetHeight : a.parentElement.offsetWidth;
            const pct    = (sA / total) * 100;
            a.style.flex = `0 0 ${pct}%`;
            b.style.flex = '1 1 0';
         },
         mainResizerIsVertical
      );

      editorResizers.forEach(function (res, i) {
         initResizer(
            res,
            function () { return panes[i]; },
            function () { return panes[i + 1]; },
            null,
            function (a, b, sA) {
               const parent = a.parentElement;
               const isVert = workspace.classList.contains('layout-vertical');
               const total  = isVert ? parent.offsetHeight : parent.offsetWidth;
               const pct    = (sA / total) * 100;
               a.style.flex = `0 0 ${pct}%`;
               b.style.flex = '1 1 0';
            },
            function () { return workspace.classList.contains('layout-vertical'); }
         );
      });
   }


   // return facade
   return {
      init,
   };

})();
