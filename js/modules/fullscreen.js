/* =====================================================
   WebBox — Fullscreen preview
   ===================================================== */

const Fullscreen = (() => {

   // declaraties
   const btnFullscreen  = document.querySelector('#btn-fullscreen');
   const fullscreenIcon = btnFullscreen.querySelector('img');
   const previewPanel   = document.querySelector('#preview-panel');

   // event handlers
   function handleBtnFullscreenClick() {
      if (!document.fullscreenElement) {
         previewPanel.requestFullscreen();
      } else {
         document.exitFullscreen();
      }
   }

   function handleFullscreenChange() {
      fullscreenIcon.src = document.fullscreenElement
         ? 'img/icon-fullscreen-exit.svg'
         : 'img/icon-fullscreen.svg';
   }

   // event bindings
   btnFullscreen.addEventListener('click', handleBtnFullscreenClick);
   document.addEventListener('fullscreenchange', handleFullscreenChange);


   // return facade
   return {};

})();
