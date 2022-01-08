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
  processNode,
} from "../../../features/tree/treeFunctions";
import { addNode } from "../../../features/tree/treeSlice";
import { toggleAdd } from "../../../features/tree/treeUpdateSlice";
import { RootState, useAppDispatch } from "../../../store";
import Node from "../../Node/Node";
import styles from "./ToolbarItem.module.scss";
import { RefObject, useRef, useState } from "react";

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
  const [calculating, setCalculating] = useState(true);
  const [minDistanceIndex, setMinDistanceIndex] = useState(0);
  const [currentParent, setCurrentParent] = useState("");
  const [value, setValue] = useState("1");
  const nodeBeingAdded = useRef<HTMLDivElement>(null);
  const NODE_SIZE = 60; // px
  const dispatch = useAppDispatch();
  const controls = useAnimation();

  // TODO
  // 1. OPTION TO EDIT VALUE BEFORE ADDING
  // 2. XARROW SHOULDN'T DISPLAY ONDRAG IN INVALID POSITIONS
  // 3. XARROW SNAP SHOULD BE SMOOTH
  // 4. SNAPPING NODE DISAPPEARS ONCLICK ADD
  // 5. FUNCTIONALITY BREAKS ON WINDOW RESIZE

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
        setCurrentParent(`node-${parentRowIndex},${parentColIndex}`);
      }
      return;
    }
    setMinDistanceIndex(0);
  };

  const throttledGetClosestParent = (event: PointerEvent, info: PanInfo) => {
    if (calculating) {
      getClosestParent(event, info);
      setCalculating(false);
      setTimeout(() => setCalculating(true), 10);
    }
  };

  const addDraggedNodeToTree = async (event: PointerEvent, info: PanInfo) => {
    if (minDistanceIndex) {
      const validChildren = getEmptyValidChildren(treeState);
      const highestValidParentLevel = getHighestValidParent(validChildren);
      const highestValidParentIndex = getIndexFromLevelAndCol(highestValidParentLevel, 0);
      const highestValidParentNode = nodeBoxesRef.current[highestValidParentIndex];
      const highestValidPosition = highestValidParentNode.getBoundingClientRect().y + NODE_SIZE / 2;
      if (event.y > highestValidPosition) {
        const [rowIndex, colIndex] = getRowAndColFromIndex(minDistanceIndex);
        // Animate the node
        const newNodePosition = nodeBoxesRef.current[minDistanceIndex].getBoundingClientRect();
        const nodeBeingAddedPosition = nodeBeingAdded.current!.getBoundingClientRect();
        setCurrentParent("");
        await controls.start({
          translateX: newNodePosition.x - nodeBeingAddedPosition.x,
          translateY: newNodePosition.y - nodeBeingAddedPosition.y,
          transition: { type: "spring", duration: 1 },
        });
        dispatch(addNode({ rowIndex, colIndex, newNodeValue: value }));
        setValue((parseInt(value) + 1).toString());
      }
    }
    setCurrentParent("");
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
  const addingNodeDisplay = treeUpdateState.adding ? (
    <>
      <motion.div
        ref={nodeBeingAdded}
        style={{ display: treeUpdateState.adding ? "unset" : "none" }}
        animate={controls}
        className={styles.addingNode}
        id="draggableNode"
        drag
        dragConstraints={addNodeDragConstraints as RefObject<Element>}
        dragElastic={0.05}
        dragMomentum={false}
        onDrag={throttledGetClosestParent}
        onDragEnd={addDraggedNodeToTree}
      >
        <Node value={value} />
      </motion.div>
      {arrow}
    </>
  ) : null;

  return (
    <Box
      className={styles.toolbarItemBox}
      id={id}
      cursor={!treeUpdateState.isPlaying ? "pointer" : "auto"}
      opacity={!treeUpdateState.isPlaying ? "1" : "0.6"}
    >
      <Box className={styles.icon}>{icon}</Box>
      <Text className={styles.toolbarItem}>{text}</Text>
      {addingNodeDisplay}
    </Box>
  );
};

export default ToolbarItemAdd;
