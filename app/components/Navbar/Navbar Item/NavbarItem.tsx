import { Text } from "@chakra-ui/layout";
import styles from "./NavbarItem.module.scss";

interface NavbarItemInterface {
  text: string;
  className?: string;
  onClick?: () => void;
}

const NavbarItem = ({ text, className, onClick }: NavbarItemInterface) => {
  const classes = `${styles.navbarItem} ${className}`;
  return (
    <Text className={classes} onClick={onClick}>
      {text}
    </Text>
  );
};

export default NavbarItem;
