import { Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import styles from "./NavbarItem.module.scss";

interface NavbarItemInterface {
  text: string;
  className?: string;
  onClick?: () => void;
}

const NavbarItem = ({ text, className, onClick }: NavbarItemInterface) => {
  const classes = `${styles.navbarItem} ${className}`;
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  return (
    <Text
      className={classes}
      onClick={onClick}
      cursor={!treeUpdateState.isPlaying ? "pointer" : "auto"}
      opacity={!treeUpdateState.isPlaying ? "1" : "0.6"}
    >
      {text}
    </Text>
  );
};

export default NavbarItem;
