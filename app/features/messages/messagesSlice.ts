import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { main: [""] as string[] };

export const messagesSlice = createSlice({
  name: "messagesSlice",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.main.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<string>) => {
      state.main[state.main.length - 1] = action.payload;
    },
    clearMessage: (state) => {
      state.main = [""];
    },
  },
});

export const { addMessage, updateMessage, clearMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
