class StorageService {
  setData(key: string, value: any) {
    return new Promise(resolve => {
      chrome.storage.local.set({
        [key]: value
      }, () => resolve(null));
    });
  };

  getData(key: string, defaultValue: any) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, (data) => {
        if (typeof data[key] !== 'undefined') return resolve(data[key]);
        resolve(defaultValue);
      });
    });
  };
};

const storageService = new StorageService();

export default storageService;
