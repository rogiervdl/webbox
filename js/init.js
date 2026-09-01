// load theme
const webboxTheme = Store.get('webbox-theme');
if (webboxTheme) document.documentElement.dataset.theme = webboxTheme;

// set monaco path
window.require = { paths: { vs: 'vendor/monaco-editor/min/vs' } };
