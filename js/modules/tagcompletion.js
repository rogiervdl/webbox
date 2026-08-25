/* =====================================================
   WebBox — Tag-aanvulling
   ===================================================== */

const TagCompletion = (() => {

   // alle HTML-elementen, ook die buiten de cursus vallen: de editor mag geen
   // vangrail zijn, studenten moeten op een examen fouten kunnen maken
   const TAGS = [
      'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
      'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
      'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
      'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
      'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
      'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link',
      'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript',
      'object', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress',
      'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'search', 'section', 'select',
      'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
      'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time',
      'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
   ];

   // lege elementen krijgen geen sluittag
   const LEEG = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'source', 'track', 'wbr'
   ];

   /**
    * Bouwt de suggestielijst voor één positie in het document.
    * Levert per tag een snippet: 'div' wordt <div></div> met de cursor ertussen.
    *
    * @param {object} model - het Monaco model van de editor
    * @param {object} position - de cursorpositie
    * @returns {object} object met een suggestions-array voor Monaco
    */
   function provideCompletionItems(model, position) {
      // bepaal het woord waarop de cursor staat
      const word = model.getWordUntilPosition(position);
      const range = {
         startLineNumber: position.lineNumber,
         endLineNumber: position.lineNumber,
         startColumn: word.startColumn,
         endColumn: word.endColumn
      };

      // na een < of </ doet Monaco's eigen HTML-aanvulling het werk al
      const before = model.getValueInRange({
         startLineNumber: position.lineNumber,
         endLineNumber: position.lineNumber,
         startColumn: Math.max(1, word.startColumn - 1),
         endColumn: word.startColumn
      });
      if (before === '<' || before === '/') return { suggestions: [] };

      // maak van elke tag een snippet
      const suggestions = TAGS.map(tag => ({
         label: tag,
         kind: monaco.languages.CompletionItemKind.Snippet,
         detail: LEEG.includes(tag) ? `<${tag}>` : `<${tag}></${tag}>`,
         insertText: LEEG.includes(tag) ? `<${tag}>` : `<${tag}>$0</${tag}>`,
         insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
         range
      }));

      return { suggestions };
   }

   /**
    * Registreert de tag-aanvulling bij Monaco.
    * Vereist dat monaco beschikbaar is (aanroepen vanuit de AMD-callback).
    */
   function init() {
      monaco.languages.registerCompletionItemProvider('html', { provideCompletionItems });
   }


   // return facade
   return {
      init
   };

})();
