import { Text } from "@chakra-ui/layout";
import styles from "./NavbarItem.module.scss";

interface NavbarItemInterface {
  text: string;
}

const NavbarItem = ({ text }: NavbarItemInterface) => {
  return <Text className={styles.navbarItem}>{text}</Text>;
};

export default NavbarItem;
