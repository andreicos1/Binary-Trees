import { MutableRefObject } from "react";
import { highlightChildren } from "../constants";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { toggleIsPlaying } from "../features/tree/treeUpdateSlice";
import { AppDispatch } from "../store";
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
  dispatch(toggleIsPlaying());

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
    return maxChildSum + parseInt(nodeValue);
  }
  const result = dfs(0, 0);
  console.log({ result });

  dispatch(toggleIsPlaying());
}
