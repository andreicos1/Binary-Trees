import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol, getRowAndColFromIndex } from "../features/tree/treeFunctions";
import { swapWithChild } from "../features/tree/treeSlice";
import { setShowDisplayRootDeleteError } from "../features/tree/treeUpdateSlice";
import { AppDispatch } from "../store";
import { waitAnimationEnd } from "./invertTree";

// TODO
// Position right child somewhere when both left and right children exist
// Animate --> use framer motion layout.
// Don't highlight root node as it cannot be deleted
// Show corresponding icon instead of pointer cursor when mouse on delete / edit

const deleteNode = async (
  index: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  dispatch: AppDispatch,
  isShowingDeleteRootAlert: boolean
) => {
  if (index === 0) {
    dispatch(setShowDisplayRootDeleteError(true));
    setTimeout(() => {
      dispatch(setShowDisplayRootDeleteError(false));
    }, 3000);
    return;
  }
  while (index < nodeBoxesRef.current.length) {
    let node = nodeBoxesRef.current[index];
    node.animate([{ opacity: 0 }], {
      duration: 500,
    });
    await waitAnimationEnd(node);
    const [rowIndex, colIndex] = getRowAndColFromIndex(index);
    const leftIndex = index * 2 + 1;
    const childRowIndex = rowIndex + 1;
    const childColIndex =
      leftIndex < nodeBoxesRef.current.length && nodeBoxesRef.current[leftIndex].childElementCount
        ? colIndex * 2
        : colIndex * 2 + 1;
    dispatch(
      swapWithChild({
        parent: { rowIndex, colIndex },
        child: { rowIndex: childRowIndex, colIndex: childColIndex },
      })
    );
    index = getIndexFromLevelAndCol(childRowIndex, childColIndex);
  }
};

export default deleteNode;
