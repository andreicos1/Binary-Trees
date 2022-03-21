import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_TREE_LEVELS } from "../../constants";
import { colIndexToGridColMultiplier, getRowAndColFromIndex } from "./treeFunctions";

export interface Position {
  rowStart: number;
  colStart: number;
}

export interface UpdatePosition extends Position {
  index: number;
}

const initialState: Position[] = [];
for (let i = 0; i < Math.pow(2, MAX_TREE_LEVELS) - 1; i++) {
  const [rowIdx, colIdx] = getRowAndColFromIndex(i);
  let rowStart = rowIdx + 1;
  let colStart = colIndexToGridColMultiplier(colIdx, rowIdx);
  initialState.push({ rowStart, colStart });
}

export const treePositionsSlice = createSlice({
  name: "treePositions",
  initialState,
  reducers: {
    updatePosition: (state, action: PayloadAction<UpdatePosition>) => {
      const { index, rowStart, colStart } = action.payload;
      state[index] = { rowStart, colStart };
    },
  },
});

export const { updatePosition } = treePositionsSlice.actions;

export default treePositionsSlice.reducer;
