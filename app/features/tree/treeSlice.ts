import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TreeState {
  value: string;
  right?: TreeState;
  left?: TreeState;
}

const initialState = {
  value: "0",
} as TreeState;

interface addData {
  rowIndex: number;
  colIndex: number;
  newNodeValue: string;
}

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<addData>) => {
      // Get row and col where child should be added
      let childRowIndex = action.payload.rowIndex;
      let childColIndex = action.payload.colIndex;
      const nodeVal = action.payload.newNodeValue;
      // Init a node of directions from root to child
      const directions = new Array<number>();
      // 1 = isLeft, 0 = isRight
      for (let currentRowIndex = 0; currentRowIndex < childRowIndex; currentRowIndex++) {
        // Check if left (even col index) or right (odd col index) child
        directions.push(childColIndex % 2 === 0 ? 1 : 0);
        childColIndex >>= 1;
      }
      // Use the directions to modify a copy to reference of state's proxy
      let stateReference = state;
      for (const direction of directions.slice(0, -1)) {
        if (direction === 1) {
          stateReference = stateReference.left!;
        } else {
          stateReference = stateReference.right!;
        }
      }
      // Add a new tree state to the corresponding position
      const newNode = { value: nodeVal };
      if (directions[directions.length - 1] === 1) {
        stateReference.left = newNode;
      } else {
        stateReference.right = newNode;
      }
    },
  },
});

export const { addNode } = treeSlice.actions;

export default treeSlice.reducer;
