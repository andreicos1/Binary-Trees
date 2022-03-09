import { Grid } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState, useAppDispatch } from "../../store";
import dynamic from "next/dynamic";
import {
  getIndexFromLevelAndCol,
  getNodesByLevel,
  getTreeFromRowAndCol,
  processNode,
} from "../../features/tree/treeFunctions";
import { forwardRef, Fragment, useEffect } from "react";
import SpeedSlider from "../Slider/Slider";
import { turnAllOff } from "../../features/tree/treeUpdateSlice";
import { GridItem } from "@chakra-ui/react";
import { NodeBox } from "../Node/NodeBox";
import { useAnimation } from "framer-motion";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

const Canvas = forwardRef((props: any, nodeBoxesRef: any) => {
  const dispatch = useAppDispatch();
  const tree = useSelector((state: RootState) => state.tree);
  const treeUpdate = useSelector((state: RootState) => state.treeUpdate);
  const treePositions = useSelector((state: RootState) => state.treePositions);
  const animationSpeed = useSelector((state: RootState) => state.speed);
  const message = useSelector((state: RootState) => state.messages);
  const controls = useAnimation();

  const handleFocus = () => {
    controls.start({
      boxShadow: ["0 0px 0px 0px black", "0px 3px 20px 10px black", "0 0px 0px 0px black"],
    });
  };

  const spring = {
    type: "spring",
    duration: animationSpeed.duration / 1000,
  };

  const treeByLevels = getNodesByLevel(tree);
  const isHighlighting = treeUpdate.deleting || treeUpdate.editing;

  return (
    <Grid
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
      <GridItem gridColumn={"1 / 2"} gridRow={"1 / 2"} marginTop="-4rem">
        <SpeedSlider />
      </GridItem>
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Fragment key={levelIdx}>
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
                    onClick={() =>
                      processNode(
                        treeUpdate,
                        nodeIndex,
                        nodeBoxesRef,
                        dispatch,
                        levelIdx,
                        columnIdx
                      )
                    }
                    treeNode={getTreeFromRowAndCol(tree, levelIdx, columnIdx)}
                    dispatch={dispatch}
                    rowIndex={levelIdx}
                    colIndex={columnIdx}
                  />
                  {connection}
                </>
              ) : null;

              return (
                <NodeBox
                  key={currNodeId}
                  currNodeId={currNodeId}
                  gridRowStart={treePositions[nodeIndex].rowStart}
                  gridColumnStart={treePositions[nodeIndex].colStart}
                  transition={animationSpeed.duration ? spring : null}
                  setRef={(el: HTMLDivElement) => {
                    nodeBoxesRef.current[nodeIndex] = el;
                  }}
                  onFocus={handleFocus}
                  label={getTreeFromRowAndCol(tree, levelIdx, columnIdx)?.label}
                >
                  {nodeElement}
                </NodeBox>
              );
            })}
          </Fragment>
        );
      })}
      <GridItem gridColumn={"-7 / -1"} gridRow={"1 / 2"}>
        <div className={styles.text}>
          {message.main.map((msg) => {
            return (
              <span id={msg} key={`${msg}`}>
                {msg}
              </span>
            );
          })}
        </div>
      </GridItem>
    </Grid>
  );
});

export default Canvas;
