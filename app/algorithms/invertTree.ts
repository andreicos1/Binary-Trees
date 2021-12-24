import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol, getTreeFromRowAndCol } from "../features/tree/treeFunctions";
import { swap, TreeState } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";
import styles from "../styles/Home.module.scss";

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getChildrenBoxes = (
  rowIndex: number,
  colIndex: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>
) => {
  const leftIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2);
  const rightIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2 + 1);
  const leftChild = nodeBoxesRef.current[leftIndex];
  const rightChild = nodeBoxesRef.current[rightIndex];
  return [leftChild, rightChild];
};

const invertTree = async (
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>
) => {
  // TODO
  // 1. Set arrows display to none when moving
  // 2. Move all children nodes to correct new position, not just the direct ones
  let rowIndex = 0;
  let colIndex = 0;
  var stack = [[rowIndex, colIndex]];
  while (stack.length) {
    [rowIndex, colIndex] = stack.pop() as number[];
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox || !nodeBox.children.length) {
      continue;
    }
    // Animate
    let nodeElement, nodeBoxLeft, nodeBoxRight;
    nodeElement = nodeBox.children[0].children[0];
    [nodeBoxLeft, nodeBoxRight] = getChildrenBoxes(rowIndex, colIndex, nodeBoxesRef);
    nodeElement.classList.add(styles.highlightedNode);
    nodeBoxLeft && nodeBoxLeft.classList.add(styles.animationLeftNode);
    nodeBoxRight && nodeBoxRight.classList.add(styles.animationRightNode);
    console.log(nodeElement);
    await timeout(1000); // wait for animation to complete
    dispatch(swap({ rowIndex, colIndex }));
    nodeElement && nodeElement.classList.remove(styles.highlightedNode);
    nodeBoxLeft && nodeBoxLeft.classList.remove(styles.animationLeftNode);
    nodeBoxRight && nodeBoxRight.classList.remove(styles.animationRightNode);
    stack.push([rowIndex + 1, colIndex * 2]);
    stack.push([rowIndex + 1, colIndex * 2 + 1]);
  }
};

export default invertTree;
