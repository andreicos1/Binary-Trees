import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  generateRandomNode,
  getDirectionsFromRowAndCol,
  getParentTreeFromRowAndCol,
  getTreeFromRowAndCol,
  NUMBER_OF_LEVELS,
} from "./treeFunctions";

export interface TreeState {
  value: string;
  right?: TreeState;
  left?: TreeState;
}

const initialState = {
  value: "0",
} as TreeState;

export interface uiRepresentation {
  rowIndex: number;
  colIndex: number;
}

interface addData extends uiRepresentation {
  newNodeValue: string;
}

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<addData>) => {
      // Get row and col where child should be added
      const nodeVal = action.payload.newNodeValue;
      let childRowIndex = action.payload.rowIndex;
      let childColIndex = action.payload.colIndex;
      let directions = getDirectionsFromRowAndCol(childRowIndex, childColIndex);
      let stateReference = getParentTreeFromRowAndCol(state, childRowIndex, childColIndex);
      // Add a new tree state to the corresponding position
      const newNode = { value: nodeVal };
      if (directions[directions.length - 1] === 1) {
        stateReference.left = newNode;
      } else {
        stateReference.right = newNode;
      }
    },
    generateRandom: (state) => {
      const bothNodesLevel1Odds = 0.85;
      const nodeExistsOdds = 0.4; // odds for levels 2 +
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
    swap: (state, action: PayloadAction<uiRepresentation>) => {
      const node = getTreeFromRowAndCol(state, action.payload.rowIndex, action.payload.colIndex);
      if (node) {
        [node.left, node.right] = [node.right, node.left];
      }
    },
  },
});

export const { addNode, generateRandom, swap } = treeSlice.actions;

export default treeSlice.reducer;
