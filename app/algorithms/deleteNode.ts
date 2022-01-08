import { MutableRefObject } from "react";
import { getRowAndColFromIndex } from "../features/tree/treeFunctions";
import { swapWithChild } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";
import { waitAnimationEnd } from "./invertTree";

const deleteNode = async (
  index: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  dispatch: AppDispatch
) => {
  if (index === 0) return;
  let node = nodeBoxesRef.current[index];
  node.animate([{ opacity: 0 }], {
    duration: 1000,
  });
  await waitAnimationEnd(node);
  (node.childNodes as NodeListOf<HTMLElement>).forEach((element) => {
    element.style.display = "none";
  });
  while (node) {
    const [rowIndex, colIndex] = getRowAndColFromIndex(index);
    const leftIndex = index * 2 + 1;
    const childRowIndex = rowIndex + 1;
    const childColIndex = nodeBoxesRef.current[leftIndex].childElementCount
      ? colIndex * 2
      : colIndex * 2 + 1;

    dispatch(
      swapWithChild({
        parent: { rowIndex, colIndex },
        child: { rowIndex: childRowIndex, colIndex: childColIndex },
      })
    );
    // Get left and right
    break;
  }
};

export default deleteNode;
