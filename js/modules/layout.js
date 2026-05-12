/* =====================================================
   WebBox — Layout switcher & minimize
   ===================================================== */

const Layout = (() => {

   let editors;

   const LAYOUTS = ['layout-horizontal', 'layout-vertical', 'layout-stacked'];
   let layoutIndex = 0;

   // declaraties
   const workspace    = document.querySelector('#workspace');
   const editorsPanel = document.querySelector('#editors-panel');
   const previewPanel = document.querySelector('#preview-panel');
   const btnLayout    = document.querySelector('#btn-layout');

   // event handlers
   function handleBtnLayoutClick() {
      workspace.classList.remove('layout-vertical', 'layout-stacked');
      layoutIndex = (layoutIndex + 1) % LAYOUTS.length;
      if (layoutIndex === 1) workspace.classList.add('layout-vertical');
      if (layoutIndex === 2) workspace.classList.add('layout-stacked');

      editorsPanel.style.flex = '';
      previewPanel.style.flex = '';
      document.querySelectorAll('.editor-pane').forEach(function (p) {
         p.style.flex = '';
      });

      Object.values(editors).forEach(function (e) { e.layout(); });
   }

   function handleBtnMinimizeClick(e) {
      const pane = document.querySelector(`#${e.currentTarget.dataset.pane}`);
      pane.classList.toggle('is-minimized');
      pane.style.flex = '';
      Object.values(editors).forEach(function (ed) { ed.layout(); });
   }

   /**
    * Initialiseert de layout-module met de Monaco-editors.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      // event bindings
      btnLayout.addEventListener('click', handleBtnLayoutClick);
      document.querySelectorAll('.btn-minimize').forEach(function (btn) {
         btn.addEventListener('click', handleBtnMinimizeClick);
      });
   }


   // return facade
   return {
      init,
   };

})();
