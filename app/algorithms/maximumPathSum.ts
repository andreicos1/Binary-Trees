import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { MutableRefObject } from "react";
import { highlightChildren } from "../constants";
import { updateMessage } from "../features/messages/messagesSlice";
import { getIndexFromLevelAndCol, getRowAndColFromIndex } from "../features/tree/treeFunctions";
import { updateLabel } from "../features/tree/treeSlice";
import { AppDispatch } from "../store";
import { MAX_TREE_LEVELS } from "../types";
import { waitAnimationEnd } from "./invertTree";

const animationOptions = (duration: number) => {
  return { duration, delay: duration / 2 };
};

const animate = async (nodeElement: Element, duration: number) => {
  nodeElement.animate(
    [{ backgroundColor: highlightChildren, offset: 0.2 }, { backgroundColor: highlightChildren }],
    animationOptions(duration)
  );
};

export default async function maximumPathSum(
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  duration: number
) {
  async function dfs(rowIndex: number, colIndex: number): Promise<number> {
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox || !nodeBox.children.length) {
      return 0;
    }
    const nodeElement = nodeBox.children[0].children[0];
    await animate(nodeElement, duration);
    await waitAnimationEnd(nodeElement);
    const maxChildSum = Math.max(
      await dfs(rowIndex + 1, colIndex * 2),
      await dfs(rowIndex + 1, colIndex * 2 + 1),
      0
    );
    const nodeValue = nodeElement.children[0].innerHTML;
    const nodeMaxSum = maxChildSum + parseInt(nodeValue);
    dispatch(updateLabel({ rowIndex, colIndex, label: nodeMaxSum.toString() }));
    await new Promise((r) => setTimeout(r, (duration * 3) / 4));
    return nodeMaxSum;
  }
  const result = await dfs(0, 0);
  // Reset all labels
  for (let index = 0; index < Math.pow(2, MAX_TREE_LEVELS) - 1; index++) {
    const [rowIndex, colIndex] = getRowAndColFromIndex(index);
    dispatch(updateLabel({ rowIndex, colIndex, label: null }));
  }
  dispatch(updateMessage(`Maximum Path Sum = ${result}`));
}
