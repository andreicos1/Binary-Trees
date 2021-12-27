import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import speedSlice from "./features/speed/speedSlice";
import treeReducer from "./features/tree/treeSlice";
import treeUpdateSlice from "./features/tree/treeUpdateSlice";

export const store = configureStore({
  reducer: {
    tree: treeReducer,
    treeUpdate: treeUpdateSlice,
    speed: speedSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
