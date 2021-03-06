import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { MutableRefObject } from "react";
import { highlightChildren, highlightParentColor } from "../constants";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { UpdatePosition } from "../features/tree/treePositionsSlice";
import { invertTreeSlice } from "../features/tree/treeSlice";
import { toggleIsLoading } from "../features/tree/treeUpdateSlice";
import { AppDispatch } from "../store";
import { nodeData } from "../types";
import { getChildrenBoxes } from "./helpers";

export const waitAnimationEnd = (elem: Element) => {
  return Promise.all(
    elem.getAnimations().map(function (animation) {
      return animation.finished;
    })
  );
};

const highlightDirectChildren = [
  { backgroundColor: highlightChildren, offset: 0.2 },
  { backgroundColor: highlightChildren },
];

const animationOptions = (duration: number) => {
  return { duration, delay: duration / 4 };
};

const animate = async (
  maxTreeLevels: number,
  parent: Element | null,
  leftBoxes: nodeData[],
  rightBoxes: nodeData[],
  duration: number,
  dispatch: AppDispatch,
  updatePosition: ActionCreatorWithPayload<UpdatePosition>
) => {
  if (leftBoxes.length !== rightBoxes.length) {
    throw "Left and Right boxes lengths should be equal";
  }

  const arrowsLeft: HTMLDivElement[] = [];
  const arrowsRight: HTMLDivElement[] = [];
  // If node has children
  if (leftBoxes.length > 0) {
    parent &&
      parent.animate(
        [
          { backgroundColor: highlightParentColor, offset: 0.2 },
          { backgroundColor: highlightParentColor },
        ],
        animationOptions(duration)
      );
    // Highlight direct children
    const parentLeft = leftBoxes[0];
    const parentRight = rightBoxes[0];
    parentLeft.element.children[0] &&
      parentLeft.element.children[0].children[0].animate(
        highlightDirectChildren,
        animationOptions(duration)
      );
    parentRight.element.children[0] &&
      parentRight.element.children[0].children[0].animate(
        highlightDirectChildren,
        animationOptions(duration)
      );
    // Move all children, grandchildren, etc.
    for (let i = 0; i < leftBoxes.length; i++) {
      const elementLeft = leftBoxes[i].element;
      const elementRight = rightBoxes[i].element;
      const indexLeft = leftBoxes[i].index;
      const indexRight = rightBoxes[i].index;
      const arrowLeft = elementLeft.children[1] as HTMLDivElement;
      const arrowRight = elementRight.children[1] as HTMLDivElement;
      if (arrowLeft) {
        arrowLeft.style.display = "none";
        arrowsLeft.push(arrowLeft);
      }
      if (arrowRight) {
        arrowRight.style.display = "none";
        arrowsRight.push(arrowRight);
      }
      const styleLeft = getComputedStyle(elementLeft);
      const styleRight = getComputedStyle(elementRight);
      const [colStartLeft, rowStartLeft] = [
        parseInt(styleLeft.gridColumnStart),
        parseInt(styleLeft.gridRowStart),
      ];
      const [colStartRight, rowStartRight] = [
        parseInt(styleRight.gridColumnStart),
        parseInt(styleRight.gridRowStart),
      ];
      dispatch(
        updatePosition({
          index: indexLeft,
          rowStart: rowStartRight,
          colStart: colStartRight,
        })
      );
      elementLeft.focus();
      dispatch(
        updatePosition({
          index: indexRight,
          rowStart: rowStartLeft,
          colStart: colStartLeft,
        })
      );
      elementRight.focus();
    }
  } else {
    // Node has no children -> animate faster
    parent &&
      parent.animate(
        [
          { backgroundColor: highlightParentColor, offset: 0.2 },
          { backgroundColor: highlightParentColor },
        ],
        { duration: duration / 4, delay: duration / 4 }
      );
  }
  // Wait for animation to complete
  parent && (await waitAnimationEnd(parent));
  arrowsLeft.forEach((arrow) => {
    arrow.style.display = "";
  });
  arrowsRight.forEach((arrow) => {
    arrow.style.display = "";
  });
};

const invertTree = async (
  maxTreeLevels: number,
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  updatePosition: ActionCreatorWithPayload<UpdatePosition>,
  duration: number
) => {
  let rowIndex = 0;
  let colIndex = 0;
  var stack = [[rowIndex, colIndex]];
  while (stack.length) {
    [rowIndex, colIndex] = stack.pop() as number[];
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox) {
      continue;
    }
    const nodeElement = nodeBox.children[0]?.children[0];
    const [leftBoxes, rightBoxes] = getChildrenBoxes(rowIndex, colIndex, nodeBoxesRef);
    await animate(
      maxTreeLevels,
      nodeElement,
      leftBoxes,
      rightBoxes,
      duration,
      dispatch,
      updatePosition
    );
    // Push children to stack
    stack.push([rowIndex + 1, colIndex * 2]);
    stack.push([rowIndex + 1, colIndex * 2 + 1]);
  }
  dispatch(toggleIsLoading());
  // Reset orders
  for (let level = 0; level < maxTreeLevels; level++) {
    const startIndex = Math.pow(2, level) - 1;
    const endIndex = startIndex + Math.pow(2, level);
    for (let index = startIndex; index < Math.floor((endIndex + startIndex) / 2); index++) {
      const indexLeft = index;
      const indexRight = endIndex - index + startIndex - 1;
      const elementLeft = nodeBoxesRef.current[indexLeft];
      const elementRight = nodeBoxesRef.current[indexRight];
      const styleLeft = getComputedStyle(elementLeft);
      const styleRight = getComputedStyle(elementRight);
      const [colStartLeft, rowStartLeft] = [
        parseInt(styleLeft.gridColumnStart),
        parseInt(styleLeft.gridRowStart),
      ];
      const [colStartRight, rowStartRight] = [
        parseInt(styleRight.gridColumnStart),
        parseInt(styleRight.gridRowStart),
      ];
      dispatch(
        updatePosition({
          index: indexLeft,
          rowStart: rowStartRight,
          colStart: colStartRight,
        })
      );
      dispatch(
        updatePosition({
          index: indexRight,
          rowStart: rowStartLeft,
          colStart: colStartLeft,
        })
      );
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  dispatch(invertTreeSlice());
  dispatch(toggleIsLoading());
};

export default invertTree;
