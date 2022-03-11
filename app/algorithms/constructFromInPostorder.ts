import { MutableRefObject } from "react";

import { AppDispatch } from "../store";
import { addMessage, updateMessage } from "../features/messages/messagesSlice";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { changeNodeValue, resetTree, TreeState } from "../features/tree/treeSlice";
import { highlightChildren, highlightParentColor } from "../constants";
import { waitAnimationEnd } from "./invertTree";
import { toggleLabelPositon } from "../features/tree/treeUpdateSlice";

type indexMap = {
  [key: string]: number;
};

const animationOptions = (duration: number) => {
  return { duration, delay: duration / 2 };
};

const animate = async (nodeElement: Element, duration: number, color: string) => {
  nodeElement.animate(
    [{ backgroundColor: color, offset: 0.2 }, { backgroundColor: color }],
    animationOptions(duration)
  );
};

const wait = (duration: number) => {
  return new Promise((r) => setTimeout(r, (duration * 3) / 4));
};

export default async function constructFromInPostorder(
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  duration: number
) {
  dispatch(toggleLabelPositon());
  // Construct inorder and postorder traversals of current tree
  let label = "Inorder Traversal:";
  const inorder = [] as string[];
  const preorder = [] as string[];
  dispatch(addMessage(label));
  async function dfs(rowIndex: number, colIndex: number, isInOrder = true, isPreorder = false) {
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox || !nodeBox.children.length) {
      return;
    }
    const nodeElement = nodeBox.children[0].children[0];
    const nodeValue = nodeElement.children[0].innerHTML;

    await animate(nodeElement, duration, highlightChildren);
    await waitAnimationEnd(nodeElement);
    if (isInOrder) {
      await dfs(rowIndex + 1, colIndex * 2);
      let newValue = parseInt(nodeValue);
      // No distincts are allowed
      while (isInOrder && inorder.includes(newValue.toString())) {
        newValue = newValue < 99 ? newValue + 1 : 1;
      }
      if (newValue !== parseInt(nodeValue)) {
        dispatch(changeNodeValue({ rowIndex, colIndex, newNodeValue: newValue.toString() }));
      }
      label = ` ${newValue.toString()},`;
      inorder.push(newValue.toString());
      await animate(nodeElement, duration, highlightParentColor);
      await wait(duration);
      dispatch(addMessage(label));
      await dfs(rowIndex + 1, colIndex * 2 + 1);
    } else if (isPreorder) {
      await animate(nodeElement, duration, highlightParentColor);
      let newValue = parseInt(nodeValue);
      // No distincts are allowed
      while (isInOrder && inorder.includes(newValue.toString())) {
        newValue = newValue < 99 ? newValue + 1 : 1;
      }
      if (newValue !== parseInt(nodeValue)) {
        dispatch(changeNodeValue({ rowIndex, colIndex, newNodeValue: newValue.toString() }));
      }
      label = ` ${newValue.toString()},`;
      preorder.push(newValue.toString());
      await wait(duration);
      dispatch(addMessage(label));
      await dfs(rowIndex + 1, colIndex * 2, false, true);
      await wait(duration);
      await dfs(rowIndex + 1, colIndex * 2 + 1, false, true);
    }
  }
  await dfs(0, 0);
  label = label.slice(0, -1);
  dispatch(updateMessage(label));
  label = "\nPostorder Traversal:";
  dispatch(addMessage(label));
  await dfs(0, 0, false, true);
  dispatch(updateMessage(label.slice(0, -1)));
  console.log({ inorder, preorder });
  // dispatch(resetTree());

  // Get map of indexes of inorder
  const inorderMap = inorder.reduce((prev, curr, index) => {
    prev[curr] = index;
    return prev;
  }, {} as indexMap);

  function construct(
    leftIn: number,
    rightIn: number,
    leftPre: number,
    rightPre: number
  ): TreeState | undefined {
    if (rightPre <= leftPre || !preorder[leftPre]) return;
    const rootValue = preorder[leftPre];
    const indexIn = inorderMap[rootValue];
    const sizeLeft = indexIn - leftIn;
    const root = { value: rootValue.toString() } as TreeState;
    root.left = construct(leftIn, indexIn, leftPre + 1, leftPre + sizeLeft + 1);
    root.right = construct(indexIn + 1, rightIn, leftPre + sizeLeft + 1, rightPre);
    return root;
  }
  // dispatch(resetTree());
  console.log(construct(0, inorder.length, 0, preorder.length));

  dispatch(toggleLabelPositon());
}
