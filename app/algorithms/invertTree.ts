import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { swap } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

const waitAnimationEnd = (elem: Element) => {
  return Promise.all(
    elem.getAnimations().map(function (animation) {
      return animation.finished;
    })
  );
};

const getDistance = (leftNode: Element, rightNode: Element) => {
  const distanceX = rightNode.getBoundingClientRect().x - leftNode.getBoundingClientRect().x;
  return distanceX;
};

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
  // 1. Calculate distances between left and right children positions
  // 2. Animate them
  // 3. BUG: clicking on invert tree multiple times has weird effects
  const duration = 1000; //ms
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
    const nodeElement = nodeBox.children[0].children[0];
    const [nodeBoxLeft, nodeBoxRight] = getChildrenBoxes(rowIndex, colIndex, nodeBoxesRef);

    const distanceX = nodeBoxLeft ? getDistance(nodeBoxLeft, nodeBoxRight) : null;

    const arrowLeft = nodeBoxLeft ? (nodeBoxLeft.children[1] as HTMLDivElement | undefined) : null;
    const arrowRight = nodeBoxRight
      ? (nodeBoxRight.children[1] as HTMLDivElement | undefined)
      : null;

    nodeElement.animate([{ backgroundColor: "burlywood" }], { duration });
    if (arrowLeft) arrowLeft.style.display = "none";
    if (arrowRight) arrowRight.style.display = "none";
    nodeBoxLeft &&
      nodeBoxLeft.animate([{ transform: `translateX(${distanceX}px)` }], {
        duration,
      });
    nodeBoxRight &&
      nodeBoxRight.animate([{ transform: `translateX(-${distanceX}px)` }], {
        duration,
      });
    // Wait for animation to complete
    await waitAnimationEnd(nodeElement);
    // Set new position
    dispatch(swap({ rowIndex, colIndex }));
    if (arrowLeft) arrowLeft.style.display = "";
    if (arrowRight) arrowRight.style.display = "";
    // Push children to stack
    stack.push([rowIndex + 1, colIndex * 2]);
    stack.push([rowIndex + 1, colIndex * 2 + 1]);
  }
};

export default invertTree;
