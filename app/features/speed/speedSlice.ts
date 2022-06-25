import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_SPEED } from "../../components/Slider/Slider";

const initialState = { duration: INITIAL_SPEED };

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
