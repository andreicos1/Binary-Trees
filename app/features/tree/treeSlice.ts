import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { immerable } from "immer";

export class Tree {
  [immerable] = true;
  constructor(public value: string, public left?: Tree, public right?: Tree) {}
  dfsAddToLevel(
    node: Tree | undefined,
    currentLevel: number,
    levels: string[][],
    directionLeft: boolean,
    maxLevel: number,
    parentCol: number
  ) {
    if (currentLevel >= maxLevel || !node) return;
    // Add value to corresponding column
    const currentValue = node.value;
    let column = parentCol * 2;
    if (!directionLeft) {
      column++;
    }
    levels[currentLevel][column] = currentValue;
    this.dfsAddToLevel(node.left, currentLevel + 1, levels, true, maxLevel, column);
    this.dfsAddToLevel(node.right, currentLevel + 1, levels, false, maxLevel, column);
  }
  getNodesByLevel() {
    // Add the nodes to an array for easy rendering
    const maxLength = parseInt(process.env.NEXT_PUBLIC_MAX_TREE_LEVELS as string);
    // Initialize as empty strings for all rows & cols
    const levels = new Array<Array<string>>();
    for (let i = 0; i < maxLength; i++) {
      const thisLevel = new Array(Math.pow(2, i));
      thisLevel.fill("");
      levels.push(thisLevel);
    }
    // Traverse
    this.dfsAddToLevel(this, 0, levels, true, levels.length, 0);
    return levels;
  }
}

export interface TreeState {
  value: string;
  right: Tree;
  left: Tree;
}

const initialState = new Tree("0");
initialState.right = new Tree("29");
initialState.left = new Tree("69");
initialState.left.right = new Tree("81");
initialState.left.right.left = new Tree("420");

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {},
});

export default treeSlice.reducer;
