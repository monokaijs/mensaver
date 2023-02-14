import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppSettings {
  warnGirlsFR: boolean,
}

interface AppState {
  settings: AppSettings
}

const initialState: AppState = {
  settings: {
    warnGirlsFR: false,
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
  }
});

export const {
} = appSlice.actions;
