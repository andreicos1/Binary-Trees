import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleting: false,
  adding: false,
  editing: false,
};

export const treeUpdateSlice = createSlice({
  name: "treeUpdate",
  initialState,
  reducers: {
    toggleDelete: (state) => {
      state.deleting = !state.deleting;
    },
    toggleAdd: (state) => {
      state.adding = !state.adding;
    },
    toggleEdit: (state) => {
      state.editing = !state.editing;
    },
    turnAllOff: (state) => {
      state.deleting = false;
      state.adding = false;
      state.editing = false;
    },
  },
});

export const { toggleDelete, toggleAdd, toggleEdit, turnAllOff } = treeUpdateSlice.actions;
export default treeUpdateSlice.reducer;
