import { Grid } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Alert, AlertIcon, GridItem, Spinner, Text } from "@chakra-ui/react";
import Xarrow from "react-xarrows";
import { RootState, useAppDispatch } from "../../store";
import { Fragment, useEffect, useState } from "react";

import {
  getIndexFromLevelAndCol,
  getNodesByLevel,
  getTreeFromRowAndCol,
  processNode,
} from "../../features/tree/treeFunctions";
import Node from "../Node/Node";
import SpeedSlider from "../Slider/Slider";
import { turnAllOff } from "../../features/tree/treeUpdateSlice";
import { NodeBox } from "../Node/NodeBox";
import { useAnimation } from "framer-motion";
import { switchMaxTreeLevels } from "../../features/tree/treePositionsSlice";

import styles from "./Canvas.module.scss";
import { resetTree } from "../../features/tree/treeSlice";

const breakpointXs = 667;
const treeLevelsXs = 3;
const treeLevelsSm = 4;

const Canvas = ({ nodeBoxesRef }: any) => {
  const [mounted, setMounted] = useState(false);
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

  const handleScreenResize = () => {
    if (screen.width < breakpointXs) {
      dispatch(switchMaxTreeLevels(treeLevelsXs));
      nodeBoxesRef.current = nodeBoxesRef.current.slice(0, Math.pow(2, treeLevelsXs) - 1);
    } else {
      dispatch(switchMaxTreeLevels(treeLevelsSm));
    }
    dispatch(resetTree());
  };

  const spring = {
    type: "spring",
    duration: animationSpeed.duration / 1000,
  };
  const treeByLevels = getNodesByLevel(tree, treePositions.maxTreeLevels);
  const isHighlighting = treeUpdate.deleting || treeUpdate.editing;

  useEffect(() => {
    setMounted(true);
    handleScreenResize();
    screen.orientation.addEventListener("change", handleScreenResize);
  }, []);

  if (!mounted) return <p>loading...</p>;

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
      {treeUpdate.displayRootDeleteError && (
        <Alert
          width="500px"
          position="absolute"
          top={0}
          left={"50%"}
          transform="translateX(-50%)"
          status="error"
        >
          <AlertIcon boxSize="20px" />
          <Text fontSize="20px">Cannot Delete Root Node</Text>
        </Alert>
      )}
      {treeUpdate.isLoading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          gridColumn={`${Math.floor(nodeBoxesRef.current.length / 2) + 1} / ${
            Math.floor(nodeBoxesRef.current.length / 2) + 2
          }`}
          gridRow={`${treePositions.maxTreeLevels - 2} / ${treePositions.maxTreeLevels - 1}`}
          justifySelf="center"
          alignSelf="center"
        />
      )}
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
                  display={treeUpdate.isLoading ? "none" : "block"}
                  key={currNodeId}
                  currNodeId={currNodeId}
                  gridRowStart={treePositions.position[nodeIndex].rowStart}
                  gridColumnStart={treePositions.position[nodeIndex].colStart}
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
      <GridItem className={styles.textGridItem}>
        <div className={styles.text}>
          {message.main.map((msg, index) => {
            return (
              <span id={`${index}-${msg}`} key={`${msg}-${index}`} className={styles.message}>
                {msg}
              </span>
            );
          })}
        </div>
      </GridItem>
    </Grid>
  );
};

export default Canvas;
