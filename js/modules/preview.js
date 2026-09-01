/* =====================================================
   WebBox — Preview & run
   ===================================================== */

const Preview = (() => {

   let editors;
   let baseUrl = '';

   // declaraties
   const previewFrame = document.querySelector('#preview-frame');
   const btnRun       = document.querySelector('#btn-run');
   const toggleLive   = document.querySelector('#toggle-live');
   let liveDebounceTimer = null;

   const BASE_STYLE = `<style>body { overflow-y: auto !important; }</style>`;

   // enkel de echte <head> tag, niet <header>
   const HEAD_OPEN = /(<head(?:\s[^>]*)?>)/i;

   const CONSOLE_BRIDGE = `<script>(function(){
var _s=function(t,a){try{window.parent.postMessage({__webbox:true,type:t,
args:Array.prototype.slice.call(a).map(function(x){try{
return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}
})},'*')}catch(e){}};
['log','warn','error','info'].forEach(function(m){
var o=console[m];console[m]=function(){o.apply(console,arguments);_s(m,arguments)};});
window.addEventListener('error',function(e){var off=window.__webboxJsOffset||0;var loc=e.lineno?' ('+(e.lineno-off)+':'+e.colno+')':'';_s('error',[e.message+loc])});
})()<\/script>`;

   /**
    * Injecteert CSS, JS en de console-bridge in de HTML-broncode.
    *
    * @param {string} html - De HTML-broncode
    * @param {string} css  - De CSS-broncode
    * @param {string} js   - De JS-broncode
    * @returns {string} Volledige HTML klaar voor srcdoc
    */
   function injectAssets(html, css, js) {
      const styleTag = css.trim() ? `<style>\n${css}\n</style>` : '';
      const baseTag  = baseUrl    ? `<base href="${baseUrl}">`  : '';

      let result = html;

      // inject CSS and base style before </head>
      if (/(<\/head>)/i.test(result)) {
         result = result.replace(/(<\/head>)/i, `${styleTag ? styleTag + '\n' : ''}${BASE_STYLE}\n$1`);
      } else {
         result = `${styleTag ? styleTag + '\n' : ''}${BASE_STYLE}\n${result}`;
      }

      // inject CONSOLE_BRIDGE and optional base tag after <head>
      // dit gebeurt na de CSS: een <base> werkt enkel op wat erna komt, dus een
      // url() in de stylesheet zou anders oplossen tegenover de app in plaats van
      // tegenover de map van de oefening
      // de spatie of > na "head" is nodig, anders matcht <header> ook
      if (HEAD_OPEN.test(result)) {
         result = result.replace(HEAD_OPEN, `$1\n${baseTag ? baseTag + '\n' : ''}${CONSOLE_BRIDGE}`);
      } else {
         result = `${baseTag ? baseTag + '\n' : ''}${CONSOLE_BRIDGE}\n${result}`;
      }

      // inject JS with a line-offset variable so error line numbers match the editor
      if (js.trim()) {
         const bodyCloseIndex = result.search(/<\/body>/i);
         const jsLineOffset = bodyCloseIndex !== -1
            ? result.substring(0, bodyCloseIndex).split('\n').length + 1
            : result.split('\n').length + 2;
         const offsetTag = `<script>window.__webboxJsOffset=${jsLineOffset};<\/script>`;
         const scriptTag = `<script>\n${js}\n<\/script>`;

         if (bodyCloseIndex !== -1) {
            result = result.replace(/(<\/body>)/i, `${offsetTag}\n${scriptTag}\n$1`);
         } else {
            result = `${result}\n${offsetTag}\n${scriptTag}`;
         }
      }

      return result;
   }

   /**
    * Voert de code uit en toont het resultaat in het preview-frame.
    */
   function run() {
      const html = editors.html.getValue();
      const css  = editors.css.getValue();
      const js   = editors.js.getValue();

      ConsolePanel.clearConsole();
      previewFrame.srcdoc = injectAssets(html, css, js);
   }

   // event handlers
   function onEditorChange() {
      if (!toggleLive.checked) return;
      clearTimeout(liveDebounceTimer);
      liveDebounceTimer = setTimeout(run, 500);
   }

   function removeButtonPress() {
      btnRun.classList.remove('is-pressed');
   }

   function runFromEditor() {
      btnRun.classList.add('is-pressed');
      run();
      setTimeout(removeButtonPress, 150);
   }

   function handleDocumentKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
         e.preventDefault();
         btnRun.classList.add('is-pressed');
      }
   }

   function handleDocumentKeyup(e) {
      if (!btnRun.classList.contains('is-pressed')) return;
      if (e.key !== 's' && e.key !== 'Control' && e.key !== 'Meta') return;
      btnRun.classList.remove('is-pressed');
      run();
   }

   /**
    * Initialiseert de preview-module met de Monaco-editors.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      // event bindings
      btnRun.addEventListener('click', run);
      document.addEventListener('keydown', handleDocumentKeydown);
      document.addEventListener('keyup', handleDocumentKeyup);
      Object.values(editors).forEach(function (editor) {
         editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run);
         editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, runFromEditor);
         editor.onDidChangeModelContent(onEditorChange);
      });
   }


   function setBaseUrl(url) {
      baseUrl = url;
   }

   // return facade
   return {
      init,
      run,
      setBaseUrl,
   };

})();
