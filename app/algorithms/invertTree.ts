import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { swap } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

const duration = 1000; //ms

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

const getAllChildren = (parentIndex: number, nodeBoxesRef: MutableRefObject<HTMLDivElement[]>) => {
  let nodes: number[] = [parentIndex];
  let boxes: HTMLDivElement[] = [];
  let current: number;
  while (nodes.length) {
    current = nodes.pop() as number;
    if (current >= nodeBoxesRef.current.length) {
      continue;
    }
    boxes.push(nodeBoxesRef.current[current]);
    nodes.push(current * 2 + 1);
    nodes.push(current * 2 + 2);
  }
  return boxes;
};

const getChildrenBoxes = (
  rowIndex: number,
  colIndex: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>
): [HTMLDivElement[], HTMLDivElement[]] => {
  const leftIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2);
  const rightIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2 + 1);

  const leftBoxes = getAllChildren(leftIndex, nodeBoxesRef);
  const rightBoxes = getAllChildren(rightIndex, nodeBoxesRef);
  return [leftBoxes, rightBoxes];
};

const animate = async (
  parent: Element,
  leftBoxes: HTMLDivElement[],
  rightBoxes: HTMLDivElement[]
) => {
  if (leftBoxes.length !== rightBoxes.length) {
    throw "Left and Right boxes lengths should be equal";
  }
  const arrowsLeft: HTMLDivElement[] = [];
  const arrowsRight: HTMLDivElement[] = [];
  parent.animate([{ backgroundColor: "burlywood" }], { duration });
  if (leftBoxes.length > 0) {
    const parentLeft = leftBoxes[0];
    const parentRight = rightBoxes[0];
    const distanceX = getDistance(parentLeft, parentRight);
    for (let i = 0; i < leftBoxes.length; i++) {
      const arrowLeft = leftBoxes[i].children[1] as HTMLDivElement;
      const arrowRight = rightBoxes[i].children[1] as HTMLDivElement;
      leftBoxes[i].animate([{ transform: `translateX(${distanceX}px)` }], {
        duration,
      });
      rightBoxes[i].animate([{ transform: `translateX(-${distanceX}px)` }], {
        duration,
      });
      if (arrowLeft) {
        arrowLeft.style.display = "none";
        arrowsLeft.push(arrowLeft);
      }
      if (arrowRight) {
        arrowRight.style.display = "none";
        arrowsRight.push(arrowRight);
      }
    }
  }
  // Wait for animation to complete
  await waitAnimationEnd(parent);
  arrowsLeft.forEach((arrow) => {
    arrow.style.display = "";
  });
  arrowsRight.forEach((arrow) => {
    arrow.style.display = "";
  });
};

const invertTree = async (
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  toggleAlgorithmPlaying: (arg0: boolean) => void
) => {
  // TODO
  // 1. Improve aspect of highlighting nodes
  // 2. Improve aspect of animating nodes
  // 3. Gray out algorithm button during algorithm playing
  toggleAlgorithmPlaying(true);
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
    const nodeElement = nodeBox.children[0].children[0];
    const [leftBoxes, rightBoxes] = getChildrenBoxes(rowIndex, colIndex, nodeBoxesRef);
    await animate(nodeElement, leftBoxes, rightBoxes);
    // Set new position
    dispatch(swap({ rowIndex, colIndex }));
    // Push children to stack
    stack.push([rowIndex + 1, colIndex * 2]);
    stack.push([rowIndex + 1, colIndex * 2 + 1]);
  }
  toggleAlgorithmPlaying(false);
};

export default invertTree;
