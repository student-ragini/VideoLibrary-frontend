
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedVideo {
  _id: string;
  title: string;
  url: string;
  description?: string;
  likes?: number;
  views?: number;
}

interface VideoState {
  saved: SavedVideo[];
}

const initialState: VideoState = {
  saved: [],
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    addToSaveList: (state, action: PayloadAction<SavedVideo>) => {
      const id = action.payload._id;
      if (!id) return;
      const exists = state.saved.find((v) => v._id === id);
      if (!exists) {
        state.saved.push(action.payload);
      }
    },
    removeVideo: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.saved = state.saved.filter((v) => v._id !== id);
    },
    clearSaved: (state) => {
      state.saved = [];
    },
    // NEW: replace a temporary local id with server _id after server POST returns
    replaceSavedId: (state, action: PayloadAction<{ oldId: string; newId: string }>) => {
      const { oldId, newId } = action.payload;
      const item = state.saved.find((s) => s._id === oldId);
      if (item) {
        // change the id to server id
        item._id = newId;
      }
    },
  },
});

export const { addToSaveList, removeVideo, clearSaved, replaceSavedId } = videoSlice.actions;
export default videoSlice.reducer;
