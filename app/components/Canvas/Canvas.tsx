import { Box, Flex } from "@chakra-ui/layout";
import { useDispatch, useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState } from "../../store";
import React from "react";
import { addNode } from "../../features/tree/treeSlice";
import dynamic from "next/dynamic";
import { getNodesByLevel } from "../../features/tree/treeFunctions";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

const Canvas = () => {
  const tree = useSelector((state: RootState) => state.tree);
  const dispatch = useDispatch();
  const treeByLevels = getNodesByLevel(tree);

  return (
    <Box className={styles.canvas}>
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Flex width="100%" key={levelIdx} justifyContent="space-around">
            {level.map((node, columnIdx) => {
              const currNodeId = `${levelIdx},${columnIdx}`;
              const parentNodeColumn = columnIdx >> 1;
              const parentNodeId = `${levelIdx - 1},${parentNodeColumn}`;
              const connection =
                levelIdx !== 0 ? (
                  <Xarrow
                    showHead={false}
                    startAnchor="bottom"
                    endAnchor="top"
                    path="straight"
                    color="#393D41"
                    start={parentNodeId}
                    end={currNodeId}
                  />
                ) : null;
              const nodeElement = node ? (
                <>
                  <Node value={node} />
                  {connection}
                </>
              ) : null;
              return (
                <Box id={currNodeId} key={columnIdx} className={styles.nodeBox}>
                  {nodeElement}
                </Box>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
};

export default Canvas;
