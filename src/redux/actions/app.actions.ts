import {createAsyncThunk} from "@reduxjs/toolkit";
import StorageService from "../../services/StorageService";
import {defaultAppState} from "../slices/app.slice";
import {RootState} from "../store";

export const loadAppSettings = createAsyncThunk<AppSettings, void, { state: RootState }>('app/load-settings', async () => {
  return await StorageService.getData('app-settings', defaultAppState.settings) as AppSettings;
});

export const setAppSettings = createAsyncThunk<AppSettings, AppSettings, { state: RootState }>('app/set-settings', async (settings) => {
  await StorageService.setData('app-settings', settings);
  const tabs = await chrome.tabs.query({});
  for (let tab of tabs) {
    if (tab.url) {
      const url = new URL(tab.url);
      if (url.host.includes('.facebook.com')) {
        // send msg to fb tab
        chrome.tabs.sendMessage(tab.id as number, {
          action: 'set-settings',
          settings: settings
        }).then(console.log);
      }
    }
  }
  return settings;
});
