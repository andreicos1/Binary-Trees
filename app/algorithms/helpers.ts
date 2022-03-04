import { MutableRefObject } from "react";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { nodeData } from "../types";

const getAllChildren = (
  parentIndex: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>
): nodeData[] => {
  let nodes: number[] = [parentIndex];
  let boxes: nodeData[] = [];
  let current: number;
  while (nodes.length) {
    current = nodes.pop() as number;
    if (current >= nodeBoxesRef.current.length) {
      continue;
    }
    boxes.push({ index: current, element: nodeBoxesRef.current[current] });
    nodes.push(current * 2 + 1);
    nodes.push(current * 2 + 2);
  }
  return boxes;
};

export const getChildrenBoxes = (
  rowIndex: number,
  colIndex: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>
): [nodeData[], nodeData[]] => {
  const leftIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2);
  const rightIndex = getIndexFromLevelAndCol(rowIndex + 1, colIndex * 2 + 1);

  const leftBoxes = getAllChildren(leftIndex, nodeBoxesRef);
  const rightBoxes = getAllChildren(rightIndex, nodeBoxesRef);
  return [leftBoxes, rightBoxes];
};
