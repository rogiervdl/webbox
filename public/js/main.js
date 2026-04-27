/* =====================================================
   WebBox — Hoofdlogica
   ===================================================== */

(function () {
  'use strict';

  // ── Standaard startcode ──────────────────────────────
  const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <title>Mijn pagina</title>
</head>
<body>
  <h1>Hallo, wereld!</h1>
  <p>Schrijf hier je HTML.</p>
</body>
</html>`;

  const DEFAULT_CSS = `/* Jouw stijlen */
body {
  font-family: sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #333;
}`;

  const DEFAULT_JS = `// Jouw JavaScript
console.log('WebBox geladen!');`;

  // ── Monaco initialisatie ─────────────────────────────
  require(['vs/editor/editor.main'], function () {

    const editorOptions = {
      theme: 'vs-dark',
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      renderLineHighlight: 'line',
      smoothScrolling: true,
    };

    const editors = {
      html: monaco.editor.create(document.getElementById('editor-html'), {
        ...editorOptions,
        value: DEFAULT_HTML,
        language: 'html',
      }),
      css: monaco.editor.create(document.getElementById('editor-css'), {
        ...editorOptions,
        value: DEFAULT_CSS,
        language: 'css',
      }),
      js: monaco.editor.create(document.getElementById('editor-js'), {
        ...editorOptions,
        value: DEFAULT_JS,
        language: 'javascript',
      }),
    };

    // ── Console panel ──────────────────────────────────
    const consolePanel  = document.getElementById('console-panel');
    const consoleOutput = document.getElementById('console-output');
    const consoleBadge  = document.getElementById('console-badge');
    let errorCount = 0;

    function clearConsole() {
      consoleOutput.innerHTML = '';
      errorCount = 0;
      consoleBadge.textContent = '';
      consoleBadge.classList.remove('visible');
    }

    function renderConsoleArgs(targetEl, args) {
      const safeArgs = Array.isArray(args) ? args : [String(args || '')];
      if (!safeArgs.length) return;

      const firstArg = String(safeArgs[0]);
      const hasCssTokens = typeof safeArgs[0] === 'string' && firstArg.indexOf('%c') !== -1;

      // Browser-consoles ondersteunen `%c` tokens met opeenvolgende style-argumenten.
      // We benaderen dat gedrag hier voor de ingebouwde console.
      if (hasCssTokens) {
        const parts = firstArg.split('%c');
        let styleArgIndex = 1;

        const plainPrefix = document.createElement('span');
        plainPrefix.textContent = parts[0];
        targetEl.appendChild(plainPrefix);

        for (let i = 1; i < parts.length; i++) {
          const segment = document.createElement('span');
          segment.textContent = parts[i];
          segment.style.cssText = String(safeArgs[styleArgIndex] || '');
          targetEl.appendChild(segment);
          styleArgIndex++;
        }

        for (let i = styleArgIndex; i < safeArgs.length; i++) {
          if (i > styleArgIndex) targetEl.appendChild(document.createTextNode(' '));
          targetEl.appendChild(document.createTextNode(String(safeArgs[i])));
        }
        return;
      }

      targetEl.textContent = safeArgs.map(function (value) {
        return String(value);
      }).join(' ');
    }

    function appendConsoleEntry(type, args) {
      const entry = document.createElement('div');
      entry.className = 'console-entry console-entry--' + type;
      const typeEl = document.createElement('span');
      typeEl.className = 'console-entry__type';
      typeEl.textContent = type;
      const textEl = document.createElement('span');
      textEl.className = 'console-entry__text';
      renderConsoleArgs(textEl, args);
      entry.appendChild(typeEl);
      entry.appendChild(textEl);
      consoleOutput.appendChild(entry);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;

      if (type === 'error' || type === 'warn') {
        if (consolePanel.classList.contains('is-collapsed')) {
          errorCount++;
          consoleBadge.textContent = errorCount;
          consoleBadge.classList.add('visible');
        }
      }
    }

    window.addEventListener('message', function (e) {
      if (!e.data || e.data.__webbox !== true) return;
      appendConsoleEntry(e.data.type, e.data.args);
    });

    document.getElementById('console-toggle').addEventListener('click', function (e) {
      if (e.target === document.getElementById('console-clear')) return;
      consolePanel.classList.toggle('is-collapsed');
      if (!consolePanel.classList.contains('is-collapsed')) {
        errorCount = 0;
        consoleBadge.textContent = '';
        consoleBadge.classList.remove('visible');
      }
    });

    document.getElementById('console-clear').addEventListener('click', function (e) {
      e.stopPropagation();
      clearConsole();
    });

    // ── Run functie ────────────────────────────────────
    function runCode() {
      const html = editors.html.getValue();
      const css  = editors.css.getValue();
      const js   = editors.js.getValue();

      clearConsole();

      // Injecteer CSS en JS in het HTML-document
      const doc = injectAssets(html, css, js);
      document.getElementById('preview-frame').srcdoc = doc;
    }

    /**
     * Injecteer <style> en <script> in het HTML-document van de student.
     * Strategie:
     *   - Als er een </head> tag is → voeg <style> toe vóór </head>
     *   - Als er een </body> tag is → voeg <script> toe vóór </body>
     *   - Anders → append aan het einde
     */
    const CONSOLE_BRIDGE = `<script>(function(){` +
      `var _s=function(t,a){try{window.parent.postMessage({__webbox:true,type:t,` +
      `args:Array.prototype.slice.call(a).map(function(x){try{` +
      `return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}` +
      `})},'*')}catch(e){}};` +
      `['log','warn','error','info'].forEach(function(m){` +
      `var o=console[m];console[m]=function(){o.apply(console,arguments);_s(m,arguments)};});` +
      `window.addEventListener('error',function(e){_s('error',[e.message])});` +
      `})()\u003c\/script>`;

    function injectAssets(html, css, js) {
      const styleTag  = css.trim()  ? `<style>\n${css}\n</style>`   : '';
      const scriptTag = js.trim()   ? `<script>\n${js}\n<\/script>` : '';

      let result = html;

      // Injecteer console bridge als eerste script in <head>
      if (/(<head[^>]*>)/i.test(result)) {
        result = result.replace(/(<head[^>]*>)/i, `$1\n${CONSOLE_BRIDGE}`);
      } else {
        result = CONSOLE_BRIDGE + '\n' + result;
      }

      if (styleTag) {
        if (/(<\/head>)/i.test(result)) {
          result = result.replace(/(<\/head>)/i, `${styleTag}\n$1`);
        } else {
          result = styleTag + '\n' + result;
        }
      }

      if (scriptTag) {
        if (/(<\/body>)/i.test(result)) {
          result = result.replace(/(<\/body>)/i, `${scriptTag}\n$1`);
        } else {
          result = result + '\n' + scriptTag;
        }
      }

      return result;
    }

    // ── Download ZIP ───────────────────────────────────
    function downloadZip() {
      const html = editors.html.getValue();
      const css  = editors.css.getValue();
      const js   = editors.js.getValue();

      const zip = new JSZip();

      // index.html met verwijzingen naar externe bestanden
      const indexHtml = buildIndexHtml(html);
      zip.file('index.html', indexHtml);
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
     * Bouw een index.html die verwijst naar style.css en script.js.
     * Vervangt eventuele inline <style> en <script> blokken NIET —
     * we voegen gewoon een <link> en <script src> toe.
     */
    function buildIndexHtml(html) {
      const linkTag   = '<link rel="stylesheet" href="style.css" />';
      const scriptTag = '<script src="script.js"><\/script>';

      let result = html;

      if (/(<\/head>)/i.test(result)) {
        result = result.replace(/(<\/head>)/i, `${linkTag}\n$1`);
      } else {
        result = linkTag + '\n' + result;
      }

      if (/(<\/body>)/i.test(result)) {
        result = result.replace(/(<\/body>)/i, `${scriptTag}\n$1`);
      } else {
        result = result + '\n' + scriptTag;
      }

      return result;
    }

    // ── Keyboard shortcut Ctrl+Enter = Run ─────────────
    Object.values(editors).forEach(function (editor) {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        runCode
      );
    });

    // ── Button events ──────────────────────────────────
    document.getElementById('btn-run').addEventListener('click', runCode);
    document.getElementById('btn-run-inline').addEventListener('click', runCode);
    document.getElementById('btn-download').addEventListener('click', downloadZip);

    // ── Upload ZIP ─────────────────────────────────────
    document.getElementById('input-upload').addEventListener('change', function (e) {
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
            zipFile = zip.file(name) || zip.file(new RegExp('(^|/)' + name + '$', 'i'))[0];
            if (zipFile) break;
          }
          if (!zipFile) return;

          zipFile.async('string').then(function (content) {
            editors[entry.key].setValue(content);
          });
        });

        // Reset file input zodat dezelfde ZIP opnieuw geüpload kan worden
        e.target.value = '';
      }).catch(function () {
        alert('Kon de ZIP niet lezen. Controleer of het een geldig ZIP-bestand is.');
        e.target.value = '';
      });
    });

    // ── Live update ────────────────────────────────────
    let liveDebounceTimer = null;

    function onEditorChange() {
      if (!document.getElementById('toggle-live').checked) return;
      clearTimeout(liveDebounceTimer);
      liveDebounceTimer = setTimeout(runCode, 500);
    }

    Object.values(editors).forEach(function (editor) {
      editor.onDidChangeModelContent(onEditorChange);
    });

    // ── Layout toggle ──────────────────────────────────
    // Cycli: 0 = horizontaal, 1 = verticaal, 2 = gestapeld (editors boven, preview onder)
    const LAYOUTS = ['layout-horizontal', 'layout-vertical', 'layout-stacked'];
    let layoutIndex = 0;
    const workspace     = document.getElementById('workspace');
    const editorsPanel  = document.getElementById('editors-panel');
    const mainResizer   = document.getElementById('main-resizer');

    const editorResizers = document.querySelectorAll('.resizer[data-axis]');

    document.getElementById('btn-layout').addEventListener('click', function () {
      workspace.classList.remove('layout-vertical', 'layout-stacked');
      layoutIndex = (layoutIndex + 1) % LAYOUTS.length;
      if (layoutIndex === 1) workspace.classList.add('layout-vertical');
      if (layoutIndex === 2) workspace.classList.add('layout-stacked');

      // Reset flex sizes zodat layout netjes herverdeelt
      editorsPanel.style.flex = '';
      document.getElementById('preview-panel').style.flex = '';
      document.querySelectorAll('.editor-pane').forEach(function (p) {
        p.style.flex = '';
      });

      // Monaco editors moeten herlayout triggeren
      Object.values(editors).forEach(function (e) { e.layout(); });
    });

    // ── Minimize panels ────────────────────────────────
    document.querySelectorAll('.btn-minimize').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const pane = document.getElementById(btn.dataset.pane);
        pane.classList.toggle('is-minimized');
        // Verwijder inline flex-size zodat CSS de breedte overneemt
        pane.style.flex = '';
        Object.values(editors).forEach(function (e) { e.layout(); });
      });
    });

    // ── Resizer drag logic ─────────────────────────────
    function initResizer(resizerEl, getA, getB, getSize, setSize, isVerticalFn) {
      let startPos, startSizeA, startSizeB;

      resizerEl.addEventListener('mousedown', function (e) {
        e.preventDefault();
        resizerEl.classList.add('is-dragging');
        startPos   = isVerticalFn() ? e.clientY : e.clientX;
        startSizeA = isVerticalFn() ? getA().offsetHeight : getA().offsetWidth;
        startSizeB = isVerticalFn() ? getB().offsetHeight : getB().offsetWidth;

        function onMove(e) {
          const delta  = (isVerticalFn() ? e.clientY : e.clientX) - startPos;
          const newA   = Math.max(80, startSizeA + delta);
          const newB   = Math.max(80, startSizeB - delta);
          setSize(getA(), getB(), newA, newB);
          Object.values(editors).forEach(function (ed) { ed.layout(); });
        }

        // Voorkom dat de iframe muisevents onderschept tijdens slepen
        const frame = document.getElementById('preview-frame');
        frame.style.pointerEvents = 'none';

        function onUp() {
          frame.style.pointerEvents = '';
          resizerEl.classList.remove('is-dragging');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }

    // Main resizer: editors panel ↔ preview panel
    // In stacked layout is de richting verticaal (hoogte), anders horizontaal (breedte)
    function mainResizerIsVertical() {
      return workspace.classList.contains('layout-stacked');
    }

    initResizer(
      mainResizer,
      function () { return document.getElementById('editors-panel'); },
      function () { return document.getElementById('preview-panel'); },
      null,
      function (a, b, sA) {
        const isVert = mainResizerIsVertical();
        const total  = isVert ? a.parentElement.offsetHeight : a.parentElement.offsetWidth;
        const pct    = (sA / total) * 100;
        a.style.flex = '0 0 ' + pct + '%';
        b.style.flex = '1 1 0';
      },
      mainResizerIsVertical
    );

    // Editor pane resizers
    const panes = [
      document.getElementById('pane-html'),
      document.getElementById('pane-css'),
      document.getElementById('pane-js'),
    ];

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
          a.style.flex = '0 0 ' + pct + '%';
          b.style.flex = '1 1 0';
        },
        // Vertical layout = editors gestapeld → resizer is verticaal (hoogte)
        // Horizontaal en stacked = editors naast elkaar → resizer is horizontaal (breedte)
        function () { return workspace.classList.contains('layout-vertical'); }
      );
    });

    // ── Theme toggle ───────────────────────────────────
    const btnTheme = document.getElementById('btn-theme');
    const iconSun  = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const isDark = theme === 'dark';
      iconSun.style.display  = isDark ? '' : 'none';
      iconMoon.style.display = isDark ? 'none' : '';
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
      localStorage.setItem('webbox-theme', theme);
    }

    btnTheme.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    applyTheme(localStorage.getItem('webbox-theme') || 'dark');

    // ── Initiële run ────────────────────────────────────
    runCode();
  });

})();
