import { Box, Text } from "@chakra-ui/layout";
import { useDispatch, useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState } from "../../store";
import React from "react";
import { Tree } from "../../features/tree/treeSlice";

const Canvas = () => {
  const tree = useSelector((state: RootState) => state.tree);
  const dispatch = useDispatch();

  const renderTree = (tree: Tree) => {
    let canvasContens: JSX.Element[] = [];
    let id = 0;
    let dfs = (node: Tree | undefined, parentDirection: 0 | 1 | 2) => {
      // Base Case return or add node
      if (!node) return;
      canvasContens.push(<Node value={node.value} />);
      // Recursive case go to children
      dfs(node.left, 1);
      dfs(node.right, 2);
    };
    dfs(tree, 0);
    console.log(canvasContens);
    return canvasContens[0];
  };
  return <Box className={styles.canvas}>{renderTree(tree)}</Box>;
};

export default Canvas;
