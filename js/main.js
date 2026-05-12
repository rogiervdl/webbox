// Monaco initialisatie
function initMonaco () {
   const editors = {
      html: monaco.editor.create(document.querySelector('#editor-html'), {
         ...Config.editorOptions,
         value: Config.defaults.html,
         language: 'html',
      }),
      css: monaco.editor.create(document.querySelector('#editor-css'), {
         ...Config.editorOptions,
         value: Config.defaults.css,
         language: 'css',
      }),
      js: monaco.editor.create(document.querySelector('#editor-js'), {
         ...Config.editorOptions,
         value: Config.defaults.js,
         language: 'javascript',
      }),
   };

   // add modules
   Preview.init(editors);
   Zip.init(editors);
   Layout.init(editors);
   Resizer.init(editors);
   ThemeSwitcher.init();
   Exercises.init(editors);
   Preview.run();
}

// start your engines
require(['vs/editor/editor.main'], initMonaco);
