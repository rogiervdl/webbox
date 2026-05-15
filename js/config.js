// create config object
const Config = {};

// add code defaults
Config.defaults = {
   html: `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <title>Mijn pagina</title>
</head>
<body>

  <h1>Welkom in WebBox 👋</h1>
  <p>Een online code-editor voor eenvoudige HTML, CSS en JavaScript oefeningen.</p>
  
  <h2>Hoe gebruiken?</h2>
  <p>Je kan vrij experimenteren, of de startcode van een oefening laden:</p>
  <ol>
    <li>Kies een <strong>vak</strong>, <strong>module</strong> en <strong>oefening</strong> in de keuzelijsten bovenaan.</li>
    <li>Klik op <strong>🕮 opgave</strong> om de opdracht te lezen (indien gegeven).</li>
  </ol>
  <p>Maak daarna je oefening of toepassing:</p>
  <ol start="3">
    <li>Pas de code aan in de editors links.</li>
    <li>Klik op <strong>▶ Run</strong> om het resultaat te zien.</li>
  </ol>
  <h2>Tips</h2>
  <ul>
    <li>Je kan panels in- en uitklappen met de pijltjes.</li>
    <li>Verander het thema of de layout met de <strong>☀ Thema</strong> en <strong>⊞ Layout</strong> knoppen rechtsboven.</li>
    <li>Download je oefening met de <strong>⤓ Download</strong> knop.</li>
  </ul>
</body>
</html>`,

   css: `body {
  font-family: sans-serif;
  line-height: 1.6;
  padding: 1em 2em;
}

h1 {
  margin-bottom: 8px;
}

h2 {
  margin-top: 28px;
}`,

   js: `console.log('webbox is geladen!');`,
};

// add readme tip
Config.readmeTip = `
   <div class="readme-tip">
      💡 <strong>Tip:</strong> je kan deze opgave altijd opnieuw openen via de <strong>🕮 Opgave</strong> knop bovenaan,
      of openen in een nieuw tabblad via de <img src="img/icon-external.svg" alt="extern"> knop rechtsboven.
   </div>
`;

// add editor options
Config.editorOptions = {
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
