import { Box } from "@chakra-ui/layout";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <Box className={styles.navbar}>
      <NavbarItem text="Algorithms" />
      <NavbarItem text="Generate Random Tree" />
      <NavbarItem text="Binary Search Tree" />
      <NavbarItem text="Heap" />
      <NavbarItem text="Regular Binary Tree" />
      <NavbarItem text="Log in" />
    </Box>
  );
};

export default Navbar;
