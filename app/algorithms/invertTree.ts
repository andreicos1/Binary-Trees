import { MutableRefObject } from "react";
import { swap, TreeState } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

const invertTree = (
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  treeState: TreeState
) => {
  dispatch(swap({ rowIndex: 3, colIndex: 7 }));
};

export default invertTree;
