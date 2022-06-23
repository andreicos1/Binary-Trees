import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "../../constants";

const initialState = {
  email: null,
  isEmailConfirmed: null,
} as { email: null | string; isEmailConfirmed: null | boolean };

export const setUser = createAsyncThunk("/auth/me", async () => {
  const response = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
  if (response.status === 401) return { status: 401 };
  const data = await response.json();
  if (data.email) return data;
});

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(setUser.fulfilled, (state, action) => {
      if (action.payload.status === 401) {
        state.email = null;
        state.isEmailConfirmed = null;
      }
      // Set state as the user
      state.email = action.payload.email;
      state.isEmailConfirmed = action.payload.isEmailConfirmed;
    });
  },
});

export default userSlice.reducer;
