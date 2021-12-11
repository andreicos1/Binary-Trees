import { Text } from "@chakra-ui/layout";
import styles from "./NavbarItem.module.scss";

interface NavbarItemInterface {
  text: string;
  onClick?: () => void;
}

const NavbarItem = ({ text, onClick }: NavbarItemInterface) => {
  return (
    <Text className={styles.navbarItem} onClick={onClick}>
      {text}
    </Text>
  );
};

export default NavbarItem;
