import { Box } from "@chakra-ui/layout";
import { generateRandom } from "../../../features/tree/treeSlice";
import { useAppDispatch } from "../../../store";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  const dispatch = useAppDispatch();
  return (
    <Box className={styles.navbar}>
      <NavbarItem text="Algorithms" />
      <NavbarItem text="Generate Random Tree" onClick={() => dispatch(generateRandom())} />
      <NavbarItem text="Binary Search Tree" />
      <NavbarItem text="Heap" />
      <NavbarItem text="Regular Binary Tree" />
      <NavbarItem text="Log in" />
    </Box>
  );
};

export default Navbar;
