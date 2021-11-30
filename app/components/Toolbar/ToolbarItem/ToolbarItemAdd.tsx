import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { motion, PanInfo } from "framer-motion";
import { useSelector } from "react-redux";
import { getEmptyValidChildren, getHighestValidParent } from "../../../features/tree/treeFunctions";
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
}

const ToolbarItemAdd = ({ text, icon, id, addNodeDragConstraints }: ToolbarItemInterface) => {
  // For the toolbar add --> show a draggable node when "Add" is clicked
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const treeState = useSelector((state: RootState) => state.tree);
  const dispatch = useAppDispatch();
  const MotionBox = motion(Box);

  const addDraggedNodeToTree = (event: PointerEvent, info: PanInfo) => {
    // Behavior to add the node to the tree on drag end, if valid position
    console.log(event, info, event.x, event.y);
    const validChildren = getEmptyValidChildren(treeState);
    const highestValidParent = getHighestValidParent(validChildren);

    console.log(validChildren, highestValidParent);
    // dispatch(addNode({ rowIndex: 1, colIndex: 0, newNodeValue: "0" }));
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
