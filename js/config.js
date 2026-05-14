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
  <p>Een online code-editor om HTML, CSS en JavaScript uit te proberen.</p>

  <p>
    Pas de code aan in de editors links en klik op
    <strong>▶ Run</strong> om het resultaat te zien.
    Zet <strong>Live</strong> aan voor automatische verversing.
  </p>

  <h2>Een oefening laden</h2>
  <p>Je kan vrij experimenteren, of de startcode van een oefening laden:</p>
  <ol>
    <li>Kies een <strong>vak</strong> in de keuzelijst bovenaan.</li>
    <li>Kies een <strong>oefening</strong> in de tweede keuzelijst.</li>
    <li>Klik op <strong>🕮 opgave</strong> om de opdracht te lezen.</li>
  </ol>

</body>
</html>`,

   css: `body {
  font-family: sans-serif;
  line-height: 1.6;
  max-width: 600px;
  padding: 32px;
}

h1 {
  margin-bottom: 8px;
}

h2 {
  margin-top: 28px;
}`,

   js: ``,
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
