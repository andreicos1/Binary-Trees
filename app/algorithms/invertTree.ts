import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { swap } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";

// TODO
// 1. Gray out algorithm button during algorithm playing
// 2. BUG: user can generate a new random tree and algorithm continues playing, as well as add/ delete, etc.
// 1 & 2 --> context or store variable isPlaying. Move from Navbar
// 3. Make duration editable by user

const duration = 1000; //ms
const highlightParentColor = process.env.NEXT_PUBLIC_HIGHLIGHTED_CURRENT_COLOR;
const highlightChildren = process.env.NEXT_PUBLIC_HIGHLIGHTED_CHILDREN_COLOR;

const waitAnimationEnd = (elem: Element) => {
  return Promise.all(
    elem.getAnimations().map(function (animation) {
      return animation.finished;
    })
  );
};

const childKeyframes = (distanceX: number) => {
  return [
    { boxShadow: "0" },
    {
      boxShadow: "0 10px 10px black",
      transform: `scaleX(120%) scaleY(120%) translateX(${distanceX / 2}px)`,
    },
    { boxShadow: "0", transform: `translateX(${distanceX}px)` },
  ];
};

const highlightDirectChildren = [
  { backgroundColor: highlightChildren, offset: 0.2 },
  { backgroundColor: highlightChildren },
];

const animationOptions = { duration, delay: duration / 4 };

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
  // If node has children
  if (leftBoxes.length > 0) {
    parent.animate(
      [
        { backgroundColor: highlightParentColor, offset: 0.2 },
        { backgroundColor: highlightParentColor },
      ],
      animationOptions
    );
    // Highlight direct children
    const parentLeft = leftBoxes[0];
    const parentRight = rightBoxes[0];
    parentLeft.children[0] &&
      parentLeft.children[0].children[0].animate(highlightDirectChildren, animationOptions);
    parentRight.children[0] &&
      parentRight.children[0].children[0].animate(highlightDirectChildren, animationOptions);
    // Move all children, grandchildren, etc.
    const distanceX = getDistance(parentLeft, parentRight);
    for (let i = 0; i < leftBoxes.length; i++) {
      const arrowLeft = leftBoxes[i].children[1] as HTMLDivElement;
      const arrowRight = rightBoxes[i].children[1] as HTMLDivElement;
      const leftNode = leftBoxes[i].children[0] ? leftBoxes[i].children[0].children[0] : null;
      const rightNode = rightBoxes[i].children[0] ? rightBoxes[i].children[0].children[0] : null;
      leftNode && leftNode.animate(childKeyframes(distanceX), animationOptions);
      rightNode && rightNode.animate(childKeyframes(-distanceX), animationOptions);
      if (arrowLeft) {
        arrowLeft.style.display = "none";
        arrowsLeft.push(arrowLeft);
      }
      if (arrowRight) {
        arrowRight.style.display = "none";
        arrowsRight.push(arrowRight);
      }
    }
  } else {
    // Node has no children -> animate faster
    parent.animate(
      [
        { backgroundColor: highlightParentColor, offset: 0.2 },
        { backgroundColor: highlightParentColor },
      ],
      { duration: duration / 4, delay: duration / 4 }
    );
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
