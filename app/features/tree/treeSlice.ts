import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export class Tree {
  constructor(public value: string, public left?: Tree, public right?: Tree) {}
}

const initialState: Tree = {
  value: "0",
  right: new Tree("1"),
  left: undefined,
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {},
});

export default treeSlice.reducer;
