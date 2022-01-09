import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol, getRowAndColFromIndex } from "../features/tree/treeFunctions";
import { swapWithChild } from "../features/tree/treeSlice";
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
  dispatch: AppDispatch
) => {
  // (node.childNodes as NodeListOf<HTMLElement>).forEach((element) => {
  //   element.style.opacity = "none";
  // });
  if (index === 0) return;
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
    // console.log({ rowIndex, colIndex, childRowIndex, childColIndex });
    dispatch(
      swapWithChild({
        parent: { rowIndex, colIndex },
        child: { rowIndex: childRowIndex, colIndex: childColIndex },
      })
    );
    index = getIndexFromLevelAndCol(childRowIndex, childColIndex);
    // Get left and right
  }
};

export default deleteNode;
