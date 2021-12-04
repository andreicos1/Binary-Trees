import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { motion, PanInfo } from "framer-motion";
import { useSelector } from "react-redux";
import {
  euclideanDistance,
  getEmptyValidChildren,
  getHighestValidParent,
  getIndexFromLevelAndCol,
} from "../../../features/tree/treeFunctions";
import { addNode } from "../../../features/tree/treeSlice";
import { toggleAdd } from "../../../features/tree/treeUpdateSlice";
import { RootState, useAppDispatch } from "../../../store";
import Node from "../../Node/Node";
import styles from "./ToolbarItem.module.scss";

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
  const MotionBox = motion(Box);
  const NODE_SIZE = 60; // px

  // TODO
  // WHEN NODE IS IN VALID POSITION TO BE ADDED
  //    --> SHOW A XARROW TO PARENT WITH TRANSPARENCY
  // ADD LAYOUT FRAMER MOTION FOR NODE
  // ADD LAYOUT FRAMER MOTION FOR XARROW

  const addDraggedNodeToTree = (event: PointerEvent, info: PanInfo) => {
    // Behavior to add the node to the tree on drag end, if valid position
    const validChildren = getEmptyValidChildren(treeState);
    if (validChildren && validChildren.length) {
      const highestValidParentLevel = getHighestValidParent(validChildren);
      const highestValidParentIndex = getIndexFromLevelAndCol(highestValidParentLevel, 0);
      const highestValidParentNode = nodeBoxesRef.current[highestValidParentIndex];
      const highestValidPosition = highestValidParentNode.getBoundingClientRect().y;
      console.log(event.y, highestValidPosition);
      // Add node if dragEnd is below parent
      if (event.y > highestValidPosition + NODE_SIZE / 2) {
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
        let minDistanceIndex = 0;
        distances.forEach((distance, index) => {
          if (distance < minDistance) {
            minDistanceIndex = indicesOfValidChildren[index];
            minDistance = distance;
          }
        });
        const rowIndex = Math.floor(Math.log2(minDistanceIndex + 1));
        const colIndex = minDistanceIndex - Math.pow(2, rowIndex) + 1;
        dispatch(addNode({ rowIndex, colIndex, newNodeValue: "0" }));
      }
    }
    dispatch(toggleAdd());
  };

  const addingNodeDisplay = (
    <MotionBox
      display={treeUpdateState.adding ? "visible" : "none"}
      position="absolute"
      left="7rem"
      zIndex="100"
      drag
      dragConstraints={addNodeDragConstraints}
      dragElastic={0.05}
      onDragEnd={addDraggedNodeToTree}
      opacity={0.9}
    >
      <Node value="O" />
    </MotionBox>
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
