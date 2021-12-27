import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { duration: 1000 };

export const speedSlice = createSlice({
  name: "speed",
  initialState,
  reducers: {
    updateSpeed: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
  },
});

export const { updateSpeed } = speedSlice.actions;
export default speedSlice.reducer;
