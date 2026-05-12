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
  <h1>Hallo, wereld!</h1>
  <p>Schrijf hier je HTML.</p>
</body>
</html>`,

   css: `/* Jouw stijlen */
body {
  font-family: sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #333;
}`,

   js: `// Jouw JavaScript
console.log('WebBox geladen!');`,
};

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
