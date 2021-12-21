import { Box } from "@chakra-ui/layout";
import { generateRandom } from "../../../features/tree/treeSlice";
import { RootState, useAppDispatch } from "../../../store";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { BoxesRefContext } from "../../../pages/_app";
import invertTree from "../../../algorithms/invertTree";

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  const dispatch = useAppDispatch();
  const treeState = useSelector((state: RootState) => state.tree);
  const nodeBoxesRef = useContext(BoxesRefContext);

  return (
    <Box className={styles.navbar}>
      <NavbarItem
        className={styles.generateRandom}
        text="Generate Random Tree"
        onClick={() => dispatch(generateRandom())}
      />
      <NavbarItem
        text="Invert Tree"
        onClick={() => invertTree(dispatch, nodeBoxesRef, treeState)}
      />
      <NavbarItem text="Subtree of Another Tree" />
      <NavbarItem text="Lowest Common Ancestor" />
      <NavbarItem text="Kth Smallest Element" />
      <NavbarItem className={styles.login} text="Log in" />
    </Box>
  );
};

export default Navbar;
