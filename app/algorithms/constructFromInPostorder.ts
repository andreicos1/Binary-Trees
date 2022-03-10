import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { MutableRefObject } from "react";

import { addMessage, updateMessage } from "../features/messages/messagesSlice";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { changeNodeValue, resetTree } from "../features/tree/treeSlice";
import { highlightChildren, highlightParentColor } from "../constants";
import { AppDispatch } from "../store";
import { waitAnimationEnd } from "./invertTree";

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
  let label = "Inorder Traversal:";
  const inorder = [] as string[];
  const postorder = [] as string[];
  dispatch(addMessage(label));
  async function dfs(rowIndex: number, colIndex: number, isInOrder = true, isPostOrder = false) {
    const index = getIndexFromLevelAndCol(rowIndex, colIndex);
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox || !nodeBox.children.length) {
      return;
    }
    const nodeElement = nodeBox.children[0].children[0];
    const nodeValue = nodeElement.children[0].innerHTML;
    let origValue = parseInt(nodeValue);
    // No distincts are allowed
    while (inorder.includes(origValue.toString()) || postorder.includes(origValue.toString())) {
      origValue = origValue < 99 ? origValue + 1 : 1;
    }
    if (origValue !== parseInt(nodeValue)) {
      dispatch(changeNodeValue({ rowIndex, colIndex, newNodeValue: origValue.toString() }));
    }
    await animate(nodeElement, duration, highlightChildren);
    await waitAnimationEnd(nodeElement);
    if (isInOrder) {
      await dfs(rowIndex + 1, colIndex * 2);
      label = ` ${nodeValue},`;
      inorder.push(nodeValue);
      await animate(nodeElement, duration, highlightParentColor);
      await wait(duration);
      dispatch(addMessage(label));
      await dfs(rowIndex + 1, colIndex * 2 + 1);
    } else if (isPostOrder) {
      await animate(nodeElement, duration, highlightParentColor);
      label = ` ${nodeValue},`;
      postorder.push(nodeValue);
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
  dispatch(resetTree());
}
