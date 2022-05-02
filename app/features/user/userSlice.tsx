import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "../../constants";

const initialState = {
  email: null,
} as { email: null | string };

export const setUser = createAsyncThunk("/auth/me", async () => {
  const response = await fetch(`${BASE_URL}/auth/me`);
  const data = await response.json();
  if (data.status.code < 300) return data;
});

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    getUser: (state) => state,
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(setUser.fulfilled, (state, action) => {
      console.log({ state, action });
      // Add user to the state array
      // state.entities.push(action.payload)
    });
  },
});

export const { getUser } = userSlice.actions;

export default userSlice.reducer;
