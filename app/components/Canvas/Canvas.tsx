import { Box, Flex } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState, useAppDispatch } from "../../store";
import dynamic from "next/dynamic";
import {
  getIndexFromLevelAndCol,
  getNodesByLevel,
  processNode,
} from "../../features/tree/treeFunctions";
import React from "react";
import SpeedSlider from "../Slider/Slider";
import { turnAllOff } from "../../features/tree/treeUpdateSlice";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

const Canvas = React.forwardRef((props: any, nodeBoxesRef: any) => {
  const dispatch = useAppDispatch();
  const tree = useSelector((state: RootState) => state.tree);
  const treeUpdate = useSelector((state: RootState) => state.treeUpdate);
  const treeByLevels = getNodesByLevel(tree);
  const isHighlighting = treeUpdate.deleting || treeUpdate.editing;

  return (
    <Box
      id="canvas"
      className={styles.canvas}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (
          !treeUpdate.adding &&
          (target.id === "canvas" ||
            target.id.split("-")[0] === "row" ||
            (target.id.split("-")[0] === "node" && !target.childElementCount))
        ) {
          dispatch(turnAllOff());
        }
      }}
    >
      <SpeedSlider />
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Flex id={`row-${level}`} width="100%" justifyContent="space-around" key={levelIdx}>
            {level.map((node, columnIdx) => {
              const currNodeId = `node-${levelIdx},${columnIdx}`;
              const parentNodeColumn = columnIdx >> 1;
              const parentNodeId = `node-${levelIdx - 1},${parentNodeColumn}`;
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
                    onClick={() => processNode(treeUpdate, nodeIndex, nodeBoxesRef, dispatch)}
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
