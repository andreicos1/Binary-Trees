import { Box, Text } from "@chakra-ui/layout";
import { generateRandom, updateLabel } from "../../../features/tree/treeSlice";
import { RootState, useAppDispatch } from "../../../store";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";
import { useContext } from "react";
import { BoxesRefContext } from "../../../pages/_app";
import invertTree from "../../../algorithms/invertTree";
import { useSelector } from "react-redux";
import { toggleIsPlaying } from "../../../features/tree/treeUpdateSlice";
import { updatePosition } from "../../../features/tree/treePositionsSlice";
import maximumPathSum from "../../../algorithms/maximumPathSum";
import constructFromInPostorder from "../../../algorithms/constructFromInPostorder";
import { clearMessage, updateMessage } from "../../../features/messages/messagesSlice";

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  // Add edge animation
  const dispatch = useAppDispatch();
  const nodeBoxesRef = useContext(BoxesRefContext);
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const animationSpeed = useSelector((state: RootState) => state.speed);

  const animateTreeChange = async (func: any, args: any) => {
    if (!treeUpdateState.isPlaying) {
      dispatch(toggleIsPlaying());
      dispatch(clearMessage());
      await func(...args);
      dispatch(toggleIsPlaying());
    }
  };

  return (
    <Box className={styles.navbar}>
      <NavbarItem
        className={styles.generateRandom}
        text="Generate Random Tree"
        onClick={() => {
          if (!treeUpdateState.isPlaying) {
            dispatch(clearMessage());
            dispatch(generateRandom());
          }
        }}
      />
      <NavbarItem
        text="Invert Tree"
        onClick={() =>
          animateTreeChange(invertTree, [
            dispatch,
            nodeBoxesRef,
            updatePosition,
            animationSpeed.duration,
          ])
        }
      />
      <NavbarItem
        text="Maximum Path Sum"
        onClick={() =>
          animateTreeChange(maximumPathSum, [dispatch, nodeBoxesRef, animationSpeed.duration])
        }
      />
      <NavbarItem
        text="Construct Tree From Inorder & Postorder Traversals"
        onClick={() =>
          animateTreeChange(constructFromInPostorder, [
            dispatch,
            nodeBoxesRef,
            animationSpeed.duration,
          ])
        }
      />
      <NavbarItem text="Kth Smallest Element" />
      <Text className={styles.login}> Log In </Text>
    </Box>
  );
};

export default Navbar;
