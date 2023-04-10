import StorageService from "../../services/StorageService";
import {defaultAppState} from "../../redux/slices/app.slice";

const insertScript = (path: string) => {
  const script = window.document.createElement('script');
  script.type = 'module';
  script.src = chrome.runtime.getURL(path);
  const doc = window.document.head || window.document.body || window.document.documentElement;
  doc.prepend(script);
}
const insertStyle = (path: string) => {
  const link = window.document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(path);
  const doc = window.document.body || window.document.head || window.document.documentElement;
  doc.prepend(link);
}
insertScript('/scripts/injected_script.js');
insertStyle('/scripts/injected_styles.css');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // listen for changes
  if (message && message.action) {
    const event = new CustomEvent("chrome-message", {detail: message});
    window.document.dispatchEvent(event);
  }
});
// load settings at startup
StorageService.getData('app-settings', defaultAppState.settings).then(appSettings => {
  console.log('app-settings', appSettings);
  const event = new CustomEvent("chrome-message", {
    detail: {
      action: 'set-settings',
      settings: appSettings
    }
  });
  window.document.dispatchEvent(event);
});
