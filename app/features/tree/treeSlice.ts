import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_TREE_LEVELS, uiRepresentation } from "../../types";
import {
  generateRandomNode,
  getDirectionsFromRowAndCol,
  getIndexFromLevelAndCol,
  getParentTreeFromRowAndCol,
  getTreeFromRowAndCol,
} from "./treeFunctions";

export interface TreeState {
  value: string;
  right?: TreeState;
  left?: TreeState;
  isEditing?: boolean;
  label?: string | null;
}

const initialState = {
  value: "0",
} as TreeState;

interface addData extends uiRepresentation {
  newNodeValue: string;
}

interface labelData extends uiRepresentation {
  label?: string | null;
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
      while (level < MAX_TREE_LEVELS - 1) {
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
          if (level >= MAX_TREE_LEVELS - 1) {
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
    resetTree: (state) => {
      state.left = undefined;
      state.right = undefined;
    },
    swapWithChild: (
      state,
      action: PayloadAction<{ parent: uiRepresentation; child: uiRepresentation }>
    ) => {
      const parent = getTreeFromRowAndCol(
        state,
        action.payload.parent.rowIndex,
        action.payload.parent.colIndex
      );
      if (parent) {
        const child = getTreeFromRowAndCol(
          state,
          action.payload.child.rowIndex,
          action.payload.child.colIndex
        );
        const grandparent = getParentTreeFromRowAndCol(
          state,
          action.payload.parent.rowIndex,
          action.payload.parent.colIndex
        );
        const index = getIndexFromLevelAndCol(
          action.payload.parent.rowIndex,
          action.payload.parent.colIndex
        );
        // Left or right child of grandparent
        if (index % 2 === 0) {
          grandparent.right = child;
        } else {
          grandparent.left = child;
        }
        if (child) {
          const [left, right] = [child.left, child.right];
          if (parent.left) {
            child.left = parent;
            child.right = parent.right;
          } else {
            child.right = parent;
            child.left = parent.left;
          }
          parent.left = left;
          parent.right = right;
        }
      } else {
        // Inexistent node selected for deletion
      }
    },
    editNodeValue: (state, action: PayloadAction<uiRepresentation>) => {
      const node = getTreeFromRowAndCol(state, action.payload.rowIndex, action.payload.colIndex);
      node.isEditing = true;
    },
    turnOffEditing: (state, action: PayloadAction<uiRepresentation>) => {
      const node = getTreeFromRowAndCol(state, action.payload.rowIndex, action.payload.colIndex);
      if (node) node.isEditing = false;
    },
    changeNodeValue: (state, action: PayloadAction<addData>) => {
      const node = getTreeFromRowAndCol(state, action.payload.rowIndex, action.payload.colIndex);
      node.isEditing = false;
      node.value = action.payload.newNodeValue;
    },
    updateLabel: (state, action: PayloadAction<labelData>) => {
      const node = getTreeFromRowAndCol(state, action.payload.rowIndex, action.payload.colIndex);
      if (node) node.label = action.payload.label;
    },
  },
});

export const {
  addNode,
  generateRandom,
  resetTree,
  swapWithChild,
  editNodeValue,
  turnOffEditing,
  changeNodeValue,
  updateLabel,
} = treeSlice.actions;

export default treeSlice.reducer;
