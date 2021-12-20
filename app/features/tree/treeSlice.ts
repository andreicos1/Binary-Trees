import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateRandomNode, NUMBER_OF_LEVELS } from "./treeFunctions";

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
        directions.unshift(childColIndex % 2 === 0 ? 1 : 0);
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
    generateRandom: (state) => {
      const bothNodesLevel1Odds = 0.7;
      const nodeExistsOdds = 0.33; // odds for levels 2 +
      const tree = generateRandomNode();
      const queue: [TreeState, number][] = []; // number is level
      // Populate first level
      if (Math.random() < bothNodesLevel1Odds) {
        // Generate left & right
        tree.left = generateRandomNode();
        tree.right = generateRandomNode();
        queue.push([tree.left, 1]);
        queue.push([tree.right, 1]);
      } else if (Math.random() > bothNodesLevel1Odds + (1 - bothNodesLevel1Odds) / 2) {
        tree.right = generateRandomNode();
        queue.push([tree.right, 1]);
      } else {
        tree.left = generateRandomNode();
        queue.push([tree.left, 1]);
      }
      // Populate rest of leveles
      let level = 1;
      let parent = tree;
      while (level < NUMBER_OF_LEVELS - 1) {
        if (!queue.length) {
          // if no nodes before last level
          if (Math.random() < 0.5) {
            parent.left = generateRandomNode();
            queue.push([parent.left, level + 1]);
            parent = parent.left;
          } else {
            parent.right = generateRandomNode();
            queue.push([parent.right, level + 1]);
            parent = parent.right;
          }
        } else {
          [parent, level] = queue.shift() as [TreeState, number];
          if (level >= NUMBER_OF_LEVELS - 1) {
            break;
          }
          let randomNumber = Math.random();
          if (randomNumber < nodeExistsOdds) {
            parent.left = generateRandomNode();
            parent.right = generateRandomNode();
            queue.push([parent.left, level + 1]);
            queue.push([parent.right, level + 1]);
            parent = parent.left;
          } else if (randomNumber < nodeExistsOdds * 2) {
            parent.left = generateRandomNode();
            queue.push([parent.left, level + 1]);
            parent = parent.left;
          } else {
            parent.right = generateRandomNode();
            queue.push([parent.right, level + 1]);
            parent = parent.right;
          }
        }
      }
      state.value = tree.value;
      state.left = tree.left;
      state.right = tree.right;
    },
    swap: (state, action: PayloadAction<TreeState>) => {
      const left = action.payload.right;
      const right = action.payload.left;
      // [state.left, state.right] = [state.right, state.left];
    },
  },
});

export const { addNode, generateRandom, swap } = treeSlice.actions;

export default treeSlice.reducer;
