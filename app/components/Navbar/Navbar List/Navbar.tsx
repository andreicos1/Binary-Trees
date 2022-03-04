import { Box, Text } from "@chakra-ui/layout";
import { generateRandom } from "../../../features/tree/treeSlice";
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

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  // Add edge animation
  const dispatch = useAppDispatch();
  const nodeBoxesRef = useContext(BoxesRefContext);
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const animationSpeed = useSelector((state: RootState) => state.speed);

  return (
    <Box className={styles.navbar}>
      <NavbarItem
        className={styles.generateRandom}
        text="Generate Random Tree"
        onClick={() => {
          if (!treeUpdateState.isPlaying) {
            dispatch(generateRandom());
          }
        }}
      />
      <NavbarItem
        text="Invert Tree"
        onClick={() => {
          if (!treeUpdateState.isPlaying) {
            invertTree(
              dispatch,
              nodeBoxesRef,
              toggleIsPlaying,
              updatePosition,
              animationSpeed.duration
            );
          }
        }}
      />
      <NavbarItem
        text="Maximum Path Sum"
        onClick={() => {
          if (!treeUpdateState.isPlaying) {
            maximumPathSum(dispatch, nodeBoxesRef, animationSpeed.duration);
          }
        }}
      />
      <NavbarItem text="Lowest Common Ancestor" />
      <NavbarItem text="Kth Smallest Element" />
      <Text className={styles.login}> Log In </Text>
    </Box>
  );
};

export default Navbar;
