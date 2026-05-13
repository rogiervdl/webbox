/* =====================================================
   WebBox — Preview & run
   ===================================================== */

const Preview = (() => {

   let editors;

   // declaraties
   const previewFrame = document.querySelector('#preview-frame');
   const btnRun       = document.querySelector('#btn-run');
   const toggleLive   = document.querySelector('#toggle-live');
   let liveDebounceTimer = null;

   const BASE_STYLE = `<style>body { overflow-y: auto !important; }</style>`;

   const CONSOLE_BRIDGE = `<script>(function(){
var _s=function(t,a){try{window.parent.postMessage({__webbox:true,type:t,
args:Array.prototype.slice.call(a).map(function(x){try{
return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}
})},'*')}catch(e){}};
['log','warn','error','info'].forEach(function(m){
var o=console[m];console[m]=function(){o.apply(console,arguments);_s(m,arguments)};});
window.addEventListener('error',function(e){_s('error',[e.message])});
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
      const styleTag  = css.trim() ? `<style>\n${css}\n</style>`   : '';
      const scriptTag = js.trim()  ? `<script>\n${js}\n<\/script>` : '';

      let result = html;

      if (/(<head[^>]*>)/i.test(result)) {
         result = result.replace(/(<head[^>]*>)/i, `$1\n${CONSOLE_BRIDGE}`);
      } else {
         result = `${CONSOLE_BRIDGE}\n${result}`;
      }

      if (/(<\/head>)/i.test(result)) {
         result = result.replace(/(<\/head>)/i, `${styleTag ? styleTag + '\n' : ''}${BASE_STYLE}\n$1`);
      } else {
         result = `${styleTag ? styleTag + '\n' : ''}${BASE_STYLE}\n${result}`;
      }

      if (scriptTag) {
         if (/(<\/body>)/i.test(result)) {
            result = result.replace(/(<\/body>)/i, `${scriptTag}\n$1`);
         } else {
            result = `${result}\n${scriptTag}`;
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

   /**
    * Initialiseert de preview-module met de Monaco-editors.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      // event bindings
      btnRun.addEventListener('click', run);
      Object.values(editors).forEach(function (editor) {
         editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, run);
         editor.onDidChangeModelContent(onEditorChange);
      });
   }


   // return facade
   return {
      init,
      run,
   };

})();
