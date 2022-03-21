import { MutableRefObject } from "react";

import { AppDispatch } from "../store";
import { addMessage, updateMessage } from "../features/messages/messagesSlice";
import { getIndexFromLevelAndCol } from "../features/tree/treeFunctions";
import { addNode, changeNodeValue, resetTree, updateLabel } from "../features/tree/treeSlice";
import { highlightChildren, highlightParentColor } from "../constants";
import { waitAnimationEnd } from "./invertTree";
import { toggleLabelPositon } from "../features/tree/treeUpdateSlice";
import { uiRepresentation } from "../types";

// TODO
// 1. Add animation to adding nodes
type indexMap = {
  [key: string]: number;
};

const animationOptions = (duration: number) => {
  return { duration, delay: duration / 4 };
};

const animate = async (nodeElement: Element, duration: number, color: string) => {
  nodeElement.animate(
    [{ backgroundColor: color, offset: 0.2 }, { backgroundColor: color }],
    animationOptions(duration)
  );
};

const wait = (duration: number) => {
  return new Promise((r) => setTimeout(r, duration / 2));
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
  label = "\nPreorder Traversal:";
  dispatch(addMessage(label));
  await dfs(0, 0, false, true);
  dispatch(updateMessage(label.slice(0, -1)));
  // dispatch(resetTree());

  // Get map of indexes of inorder
  const inorderMap = inorder.reduce((prev, curr, index) => {
    prev[curr] = index;
    return prev;
  }, {} as indexMap);

  async function construct(
    leftIn: number,
    rightIn: number,
    leftPre: number,
    rightPre: number,
    { rowIndex, colIndex }: uiRepresentation
  ) {
    if (rightPre <= leftPre || !preorder[leftPre]) return;

    // Highlight elements being parsed
    for (let index = leftPre; index < rightPre; index++) {
      const element =
        document.getElementById(`${index + 3 + inorder.length}- ${preorder[index]},`) ||
        document.getElementById(`${index + 3 + inorder.length}- ${preorder[index]}`);
      element!.style.backgroundColor = highlightChildren;
    }
    for (let index = leftIn; index < rightIn; index++) {
      const element =
        document.getElementById(`${index + 2}- ${inorder[index]},`) ||
        document.getElementById(`${index + 2}- ${inorder[index]}`);
      element!.style.backgroundColor = highlightChildren;
    }

    const rootValue = preorder[leftPre];
    const indexIn = inorderMap[rootValue];
    // Highlight current element
    const preorderElement =
      document.getElementById(`${leftPre + 3 + inorder.length}- ${rootValue},`) ||
      document.getElementById(`${leftPre + 3 + inorder.length}- ${rootValue}`);
    const inorderElement =
      document.getElementById(`${indexIn + 2}- ${rootValue},`) ||
      document.getElementById(`${indexIn + 2}- ${rootValue}`);

    preorderElement!.style.backgroundColor = highlightParentColor;
    inorderElement!.style.backgroundColor = highlightParentColor;

    // Add the node
    if (rowIndex !== 0) dispatch(addNode({ rowIndex, colIndex, newNodeValue: rootValue }));
    // Show the values as labels
    dispatch(
      updateLabel({ rowIndex, colIndex, label: preorder.slice(leftPre, rightPre).join(", ") })
    );
    const sizeLeft = indexIn - leftIn;

    await wait(duration * 2);
    // Remove highlighting
    for (let index = leftPre; index < rightPre; index++) {
      const element =
        document.getElementById(`${index + 3 + inorder.length}- ${preorder[index]},`) ||
        document.getElementById(`${index + 3 + inorder.length}- ${preorder[index]}`);
      element!.style.backgroundColor = "unset";
    }
    for (let index = leftIn; index < rightIn; index++) {
      const element =
        document.getElementById(`${index + 2}- ${inorder[index]},`) ||
        document.getElementById(`${index + 2}- ${inorder[index]}`);
      element!.style.backgroundColor = "unset";
    }
    preorderElement!.style.backgroundColor = "unset";
    inorderElement!.style.backgroundColor = "unset";

    await construct(leftIn, indexIn, leftPre + 1, leftPre + sizeLeft + 1, {
      rowIndex: rowIndex + 1,
      colIndex: colIndex * 2,
    });
    await construct(indexIn + 1, rightIn, leftPre + sizeLeft + 1, rightPre, {
      rowIndex: rowIndex + 1,
      colIndex: colIndex * 2 + 1,
    });
    dispatch(updateLabel({ rowIndex, colIndex, label: null }));
  }
  dispatch(resetTree());
  await construct(0, inorder.length, 0, preorder.length, { rowIndex: 0, colIndex: 0 });
  dispatch(toggleLabelPositon());
}
