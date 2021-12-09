import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { motion, PanInfo, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import {
  euclideanDistance,
  getEmptyValidChildren,
  getHighestValidParent,
  getIndexFromLevelAndCol,
  getRowAndColFromIndex,
} from "../../../features/tree/treeFunctions";
import { addNode } from "../../../features/tree/treeSlice";
import { toggleAdd } from "../../../features/tree/treeUpdateSlice";
import { RootState, useAppDispatch } from "../../../store";
import Node from "../../Node/Node";
import styles from "./ToolbarItem.module.scss";
import { RefObject, useState } from "react";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

interface ToolbarItemInterface {
  text: string;
  icon: JSX.Element;
  id: string;
  addNodeDragConstraints: React.MutableRefObject<JSX.Element | null>;
  nodeBoxesRef: React.MutableRefObject<HTMLDivElement[]>;
}

const ToolbarItemAdd = ({
  text,
  icon,
  id,
  addNodeDragConstraints,
  nodeBoxesRef,
}: ToolbarItemInterface) => {
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const treeState = useSelector((state: RootState) => state.tree);
  const dispatch = useAppDispatch();
  const controls = useAnimation();
  const [calculating, setCalculating] = useState(true);
  const [minDistanceIndex, setMinDistanceIndex] = useState(0);
  const [currentParent, setCurrentParent] = useState("");
  const NODE_SIZE = 60; // px

  // TODO
  // 1. NODE SNAP SHOULD BE SMOOTH
  // 2. XARROW SNAP SHOULD BE SMOOTH
  // 3. XARROW SHOULDN'T DISPLAY ONDRAG IN INVALID POSITIONS

  const getClosestParent = (event: PointerEvent, info: PanInfo): void => {
    // Behavior to add the node to the tree on drag end, if valid position
    const validChildren = getEmptyValidChildren(treeState);
    if (validChildren && validChildren.length) {
      // Add node if dragEnd is below parent
      const indicesOfValidChildren = validChildren.map((node) => {
        return getIndexFromLevelAndCol(node.rowIndex, node.columnIndex);
      });
      const positions = indicesOfValidChildren.map((nodeIndex) => {
        const nodeRefRect = nodeBoxesRef.current[nodeIndex].getBoundingClientRect();
        return { x: nodeRefRect.x, y: nodeRefRect.y };
      });
      const distances = positions.map((position) => {
        return euclideanDistance(
          position.x + NODE_SIZE / 2,
          position.y + NODE_SIZE / 2,
          event.x,
          event.y
        );
      });
      let minDistance = Infinity;
      let minDistanceIndexTemp = 0;
      distances.forEach((distance, index) => {
        if (distance < minDistance) {
          minDistanceIndexTemp = indicesOfValidChildren[index];
          minDistance = distance;
        }
      });
      setMinDistanceIndex(minDistanceIndexTemp);
      // Get id of parent to show with arrow
      const currentParentIndex = Math.floor((minDistanceIndex - 1) / 2);
      if (currentParentIndex >= 0) {
        const [parentRowIndex, parentColIndex] = getRowAndColFromIndex(currentParentIndex);
        setCurrentParent(`${parentRowIndex},${parentColIndex}`);
      }
      return;
    }
    setMinDistanceIndex(0);
  };

  const throttledGetClosestParent = (event: PointerEvent, info: PanInfo) => {
    if (calculating) {
      getClosestParent(event, info);
      setCalculating(false);
      setTimeout(() => setCalculating(true), 16);
    }
  };

  const addDraggedNodeToTree = (event: PointerEvent, info: PanInfo) => {
    if (minDistanceIndex) {
      const validChildren = getEmptyValidChildren(treeState);
      const highestValidParentLevel = getHighestValidParent(validChildren);
      const highestValidParentIndex = getIndexFromLevelAndCol(highestValidParentLevel, 0);
      const highestValidParentNode = nodeBoxesRef.current[highestValidParentIndex];
      const highestValidPosition = highestValidParentNode.getBoundingClientRect().y + NODE_SIZE / 2;
      if (event.y > highestValidPosition) {
        const [rowIndex, colIndex] = getRowAndColFromIndex(minDistanceIndex);
        dispatch(addNode({ rowIndex, colIndex, newNodeValue: "0" }));
      }
    }
    setCurrentParent("");
    controls.start("hidden");
    setMinDistanceIndex(0);
    dispatch(toggleAdd());
  };

  const arrow = currentParent ? (
    <Xarrow
      showHead={false}
      startAnchor="bottom"
      endAnchor="top"
      path="straight"
      color="#393D41"
      start={currentParent}
      end="draggableNode"
    />
  ) : null;

  const addingNodeDisplay = (
    <>
      <motion.div
        style={{ display: treeUpdateState.adding ? "unset" : "none" }}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {
            y: 0,
            x: 0,
          },
        }}
        className={styles.addingNode}
        id="draggableNode"
        drag
        dragConstraints={addNodeDragConstraints as RefObject<Element>}
        dragElastic={0.05}
        onDrag={throttledGetClosestParent}
        onDragEnd={addDraggedNodeToTree}
      >
        <Node value="O" />
      </motion.div>
      {arrow}
    </>
  );

  return (
    <Box className={styles.toolbarItemBox} id={id}>
      <Box className={styles.icon}>{icon}</Box>
      <Text className={styles.toolbarItem}>{text}</Text>
      {addingNodeDisplay}
    </Box>
  );
};

export default ToolbarItemAdd;
