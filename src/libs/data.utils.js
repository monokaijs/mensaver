const setData = (key, value) => {
  return new Promise(resolve => {
    chrome.storage.local.set({
      [key]: value
    }, () => resolve());
  });
};

const getData = (key, defaultValue) => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, (data) => {
      if (typeof data[key] !== 'undefined') return resolve(data[key]);
      resolve(defaultValue);
    });
  });
};
