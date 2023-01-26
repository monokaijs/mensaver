const insertScript = (path) => {
  const script = window.document.createElement('script');
  script.type = 'module';
  script.src = chrome.runtime.getURL(path);
  const doc = window.document.body || window.document.head || window.document.documentElement;
  doc.prepend(script);
}
const insertStyle = (path) => {
  const link = window.document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(path);
  const doc = window.document.body || window.document.head || window.document.documentElement;
  doc.prepend(link);
}
insertScript('/scripts/injected_script.js');
insertStyle('/scripts/injected_styles.css');

