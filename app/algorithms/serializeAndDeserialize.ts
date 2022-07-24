import { MutableRefObject } from "react";

import { AppDispatch } from "../store";
import { addMessage, updateMessage } from "../features/messages/messagesSlice";
import { getRowAndColFromIndex } from "../features/tree/treeFunctions";
import {
  addNode,
  resetTree,
} from "../features/tree/treeSlice";
import { highlightChildren, highlightParentColor } from "../constants";
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
  return new Promise((r) => setTimeout(r, duration / 2));
};

const animateHighlight = async (
  index: number,
  serializedTreeArray: (number | string)[],
  duration: number
) => {
  const id = `${index + 1}-${serializedTreeArray[index]},`;
  const element = document.getElementById(id) || document.getElementById(id.slice(0, -1));
  element!.style.backgroundColor = highlightParentColor;
  await wait(duration * 2);
  element!.style.backgroundColor = "unset";
};

export default async function serializeAndDeserialize(
  maxTreeLevels: number,
  dispatch: AppDispatch,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  duration: number
) {
  const MAX_COUNT = Math.pow(2, maxTreeLevels) - 1;
  // Construct inorder and postorder traversals of current tree
  let label = "Serialized Tree: ";
  const values = [] as string[];
  dispatch(updateMessage(label));

  // Serialize
  const serializedTreeArray = [] as (number | string)[];
  const queue = [0]; // holds indexes
  while (queue.length) {
    const index = queue.pop()!;
    if (index >= MAX_COUNT) continue;
    const nodeBox = nodeBoxesRef.current[index];
    if (!nodeBox || !nodeBox.children.length) {
      serializedTreeArray.push("#");
      label = "#,";
      dispatch(addMessage(label));
      await animate(nodeBox, duration, highlightChildren);
      await waitAnimationEnd(nodeBox);
      continue;
    }
    const nodeElement = nodeBox.children[0].children[0];
    const nodeValue = nodeElement.children[0].innerHTML;
    serializedTreeArray.push(nodeValue);
    label = `${nodeValue},`;
    dispatch(addMessage(label));
    await animate(nodeElement, duration, highlightChildren);
    await waitAnimationEnd(nodeElement);
    queue.unshift(index * 2 + 1);
    queue.unshift(index * 2 + 2);
  }
  dispatch(updateMessage(label.slice(0, -1))); // delete last comma
  dispatch(resetTree());

  // Deserialize
  const parentsQueue = [0]; // indexes
  // When we have a tree data structure, we keep parents in a queue and add the 2 children of last parent each iteration
  for (let index = 1; index < serializedTreeArray.length; index += 2) {
    const parentIndex = parentsQueue.pop()!;
    const leftIndex = parentIndex * 2 + 1;
    const rightIndex = parentIndex * 2 + 2;

    const [rowIndexLeft, colIndexLeft] = getRowAndColFromIndex(leftIndex);
    if (serializedTreeArray[index] !== "#") {
      parentsQueue.unshift(index);
      dispatch(
        addNode({
          rowIndex: rowIndexLeft,
          colIndex: colIndexLeft,
          newNodeValue: serializedTreeArray[index].toString(),
        })
      );
      await animateHighlight(index, serializedTreeArray, duration);
    }

    const [rowIndexRight, colIndexRight] = getRowAndColFromIndex(rightIndex);
    if (serializedTreeArray[index + 1] !== "#") {
      parentsQueue.unshift((index + 1) as number);
      dispatch(
        addNode({
          rowIndex: rowIndexRight,
          colIndex: colIndexRight,
          newNodeValue: serializedTreeArray[index + 1].toString(),
        })
      );
      await animateHighlight(index + 1, serializedTreeArray, duration);
    }
  }
}
