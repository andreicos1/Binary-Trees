import { Box, Flex } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState } from "../../store";
import dynamic from "next/dynamic";
import {
  getIndexFromLevelAndCol,
  getNodesByLevel,
  processNode,
} from "../../features/tree/treeFunctions";
import React from "react";
import SpeedSlider from "../Slider/Slider";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

const Canvas = React.forwardRef((props: any, nodeBoxesRef: any) => {
  const tree = useSelector((state: RootState) => state.tree);
  const treeUpdate = useSelector((state: RootState) => state.treeUpdate);
  const treeByLevels = getNodesByLevel(tree);
  const isHighlighting = treeUpdate.deleting || treeUpdate.editing;

  return (
    <Box className={styles.canvas}>
      <SpeedSlider />
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Flex width="100%" justifyContent="space-around" key={levelIdx}>
            {level.map((node, columnIdx) => {
              const currNodeId = `${levelIdx},${columnIdx}`;
              const parentNodeColumn = columnIdx >> 1;
              const parentNodeId = `${levelIdx - 1},${parentNodeColumn}`;
              const nodeIndex = getIndexFromLevelAndCol(levelIdx, columnIdx);
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
                  <Node
                    value={node}
                    isHighlighting={isHighlighting}
                    onClick={() => processNode(treeUpdate, nodeIndex, nodeBoxesRef)}
                  />
                  {connection}
                </>
              ) : null;

              return (
                <Box
                  id={currNodeId}
                  key={columnIdx}
                  className={styles.nodeBox}
                  ref={(el: HTMLDivElement) => {
                    nodeBoxesRef.current[nodeIndex] = el;
                  }}
                >
                  {nodeElement}
                </Box>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
});

export default Canvas;
