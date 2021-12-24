import { Box } from "@chakra-ui/layout";
import { generateRandom } from "../../../features/tree/treeSlice";
import { useAppDispatch } from "../../../store";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";
import { useContext, useState } from "react";
import { BoxesRefContext } from "../../../pages/_app";
import invertTree from "../../../algorithms/invertTree";

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  const dispatch = useAppDispatch();
  const nodeBoxesRef = useContext(BoxesRefContext);
  const [algorithmPlaying, setAlgorithmPlaying] = useState(false);
  const toggleAlgorithmPlaying = (playing: boolean) => {
    setAlgorithmPlaying(playing);
  };

  return (
    <Box className={styles.navbar}>
      <NavbarItem
        className={styles.generateRandom}
        text="Generate Random Tree"
        onClick={() => dispatch(generateRandom())}
      />
      <NavbarItem
        text="Invert Tree"
        onClick={() => {
          if (!algorithmPlaying) {
            invertTree(dispatch, nodeBoxesRef, toggleAlgorithmPlaying);
          }
        }}
      />
      <NavbarItem text="Subtree of Another Tree" />
      <NavbarItem text="Lowest Common Ancestor" />
      <NavbarItem text="Kth Smallest Element" />
      <NavbarItem className={styles.login} text="Log in" />
    </Box>
  );
};

export default Navbar;
