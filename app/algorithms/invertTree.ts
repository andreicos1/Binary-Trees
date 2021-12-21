import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol, getTreeFromRowAndCol } from "../features/tree/treeFunctions";
import { swap, TreeState } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

const invertTree = (
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  treeState: TreeState
) => {
  const animateSwap = (rowIndex: number, colIndex: number) => {
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    console.log(nodeBoxesRef.current[index]);
    if (!nodeBoxesRef.current[index]) {
      return;
    }
    // Animate

    dispatch(swap({ rowIndex, colIndex }));
    animateSwap(rowIndex + 1, colIndex * 2);
    animateSwap(rowIndex + 1, colIndex * 2 + 1);
  };
  animateSwap(0, 0);
};

export default invertTree;
