import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {loadAppSettings, setAppSettings} from "../actions/app.actions";

interface AppState {
  settings: AppSettings,
  isBooting: boolean,
}

export const defaultAppState = {
  settings: {
    warnGirlsFR: false,
  },
  isBooting: true,
};

const initialState: AppState = defaultAppState;

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(loadAppSettings.pending, (state) => {
      state.isBooting = true;
    }).addCase(loadAppSettings.fulfilled, (state, action) => {
      state.isBooting = false;
      state.settings = action.payload;
    }).addCase(setAppSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
    })
  }
});

export const {
} = appSlice.actions;
