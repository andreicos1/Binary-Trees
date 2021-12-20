import { MutableRefObject } from "react";
import { swap, TreeState } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

const invertTree = (
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  treeState: TreeState
) => {
  console.log(treeState);
  dispatch(swap(treeState));
  console.log(treeState);
};

export default invertTree;
