import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { main: "" };

export const messagesSlice = createSlice({
  name: "messagesSlice",
  initialState,
  reducers: {
    updateMessage: (state, action: PayloadAction<string>) => {
      state.main = action.payload;
    },
  },
});

export const { updateMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
