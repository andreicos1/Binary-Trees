import { createSlice } from "@reduxjs/toolkit";

export interface treeUpdate {
  deleting: boolean;
  adding: boolean;
  editing: boolean;
  isPlaying: boolean;
}

const initialState = {
  deleting: false,
  adding: false,
  editing: false,
  isPlaying: false,
};

export const treeUpdateSlice = createSlice({
  name: "treeUpdate",
  initialState,
  reducers: {
    toggleDelete: (state) => {
      state.deleting = !state.deleting;
      state.adding = false;
      state.editing = false;
    },
    toggleAdd: (state) => {
      state.adding = !state.adding;
      state.deleting = false;
      state.editing = false;
    },
    toggleEdit: (state) => {
      state.editing = !state.editing;
      state.adding = false;
      state.deleting = false;
    },
    turnAllOff: (state) => {
      state.deleting = false;
      state.adding = false;
      state.editing = false;
    },
    toggleIsPlaying: (state) => {
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        state.deleting = false;
        state.adding = false;
        state.editing = false;
      }
    },
  },
});

export const { toggleDelete, toggleAdd, toggleEdit, turnAllOff, toggleIsPlaying } =
  treeUpdateSlice.actions;
export default treeUpdateSlice.reducer;
