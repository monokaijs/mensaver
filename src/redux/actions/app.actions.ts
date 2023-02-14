import {createAsyncThunk} from "@reduxjs/toolkit";
import StorageService from "../../services/StorageService";
import {defaultAppState} from "../slices/app.slice";
import {RootState} from "../store";

export const loadAppSettings = createAsyncThunk<AppSettings, void, {state: RootState}>('app/load-settings', async () => {
  return await StorageService.getData('app-settings', defaultAppState.settings) as AppSettings;
});
