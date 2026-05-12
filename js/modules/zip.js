/* =====================================================
   WebBox — ZIP upload & download
   ===================================================== */

const Zip = (() => {

   let editors;

   // declaraties
   const btnDownload = document.querySelector('#btn-download');
   const inputUpload = document.querySelector('#input-upload');

   /**
    * Voegt een link- en script-tag toe aan de HTML voor gebruik als losse bestanden.
    *
    * @param {string} html - De HTML-broncode
    * @returns {string} Aangepaste HTML met verwijzingen naar style.css en script.js
    */
   function buildIndexHtml(html) {
      const linkTag   = '<link rel="stylesheet" href="style.css">';
      const scriptTag = '<script src="script.js"><\/script>';

      let result = html;

      if (/(<\/head>)/i.test(result)) {
         result = result.replace(/(<\/head>)/i, `${linkTag}\n$1`);
      } else {
         result = `${linkTag}\n${result}`;
      }

      if (/(<\/body>)/i.test(result)) {
         result = result.replace(/(<\/body>)/i, `${scriptTag}\n$1`);
      } else {
         result = `${result}\n${scriptTag}`;
      }

      return result;
   }

   /**
    * Maakt een ZIP aan met index.html, style.css en script.js en triggert de download.
    */
   function downloadZip() {
      const html = editors.html.getValue();
      const css  = editors.css.getValue();
      const js   = editors.js.getValue();

      const zip = new JSZip();
      zip.file('index.html', buildIndexHtml(html));
      zip.file('style.css', css);
      zip.file('script.js', js);

      zip.generateAsync({ type: 'blob' }).then(function (blob) {
         const url = URL.createObjectURL(blob);
         const a   = document.createElement('a');
         a.href     = url;
         a.download = 'student-werk.zip';
         a.click();
         URL.revokeObjectURL(url);
      });
   }

   /**
    * Leest een geüploade ZIP en laadt index.html, style.css en script.js in de editors.
    *
    * @param {Event} e - Het change-event van het file-input element
    */
   function handleInputUploadChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      JSZip.loadAsync(file).then(function (zip) {
         const reads = [
            { key: 'html', names: ['index.html'] },
            { key: 'css',  names: ['style.css', 'styles.css'] },
            { key: 'js',   names: ['script.js', 'scripts.js'] },
         ];

         reads.forEach(function (entry) {
            let zipFile = null;
            for (const name of entry.names) {
               zipFile = zip.file(name) || zip.file(new RegExp(`(^|/)${name}$`, 'i'))[0];
               if (zipFile) break;
            }
            if (!zipFile) return;

            zipFile.async('string').then(function (content) {
               editors[entry.key].setValue(content);
            });
         });

         e.target.value = '';
      }).catch(function () {
         alert('Kon de ZIP niet lezen. Controleer of het een geldig ZIP-bestand is.');
         e.target.value = '';
      });
   }

   /**
    * Initialiseert de module met de Monaco-editors en activeer de event bindings.
    *
    * @param {Object} editorInstances - Object met html, css en js Monaco-editor instanties
    */
   function init(editorInstances) {
      editors = editorInstances;

      // event bindings
      btnDownload.addEventListener('click', downloadZip);
      inputUpload.addEventListener('change', handleInputUploadChange);
   }


   // return facade
   return {
      init,
   };

})();
