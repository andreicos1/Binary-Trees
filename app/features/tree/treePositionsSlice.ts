import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { colIndexToGridColMultiplier, getRowAndColFromIndex } from "./treeFunctions";

export interface Position {
  rowStart: number;
  colStart: number;
}

export interface UpdatePosition extends Position {
  index: number;
}

interface TreePositionInterface {
  maxTreeLevels: 4 | 3;
  position: Position[];
}

const initialState = { maxTreeLevels: 4, position: [] } as TreePositionInterface;
for (let i = 0; i < Math.pow(2, initialState.maxTreeLevels) - 1; i++) {
  const [rowIdx, colIdx] = getRowAndColFromIndex(i);
  let rowStart = rowIdx + 1;
  let colStart = colIndexToGridColMultiplier(colIdx, rowIdx, initialState.maxTreeLevels);
  initialState.position.push({ rowStart, colStart });
}

export const treePositionsSlice = createSlice({
  name: "treePositions",
  initialState,
  reducers: {
    switchMaxTreeLevels: (state, action: PayloadAction<3 | 4>) => {
      state.maxTreeLevels = action.payload;
    },
    updatePosition: (state, action: PayloadAction<UpdatePosition>) => {
      const { index, rowStart, colStart } = action.payload;
      state.position[index] = { rowStart, colStart };
    },
  },
});

export const { switchMaxTreeLevels, updatePosition } = treePositionsSlice.actions;

export default treePositionsSlice.reducer;
