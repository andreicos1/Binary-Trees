import { MutableRefObject } from "react";
import { waitAnimationEnd } from "./invertTree";

const deleteNode = async (index: number, nodeBoxesRef: MutableRefObject<HTMLDivElement[]>) => {
  const node = nodeBoxesRef.current[index];
  node.animate([{ opacity: 0 }], {
    duration: 1000,
  });
  await waitAnimationEnd(node);
  console.log(node);
};

export default deleteNode;
