import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import messagesSlice from "./features/messages/messagesSlice";
import speedSlice from "./features/speed/speedSlice";
import treePositionsSlice from "./features/tree/treePositionsSlice";
import treeReducer from "./features/tree/treeSlice";
import treeUpdateSlice from "./features/tree/treeUpdateSlice";

export const store = configureStore({
  reducer: {
    tree: treeReducer,
    treeUpdate: treeUpdateSlice,
    treePositions: treePositionsSlice,
    speed: speedSlice,
    messages: messagesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
