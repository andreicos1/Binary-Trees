import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import styles from "./ToolbarItem.module.scss";

interface ToolbarItemInterface {
  text: string;
  icon: JSX.Element;
  id: string;
}

const ToolbarItem = ({ text, icon, id }: ToolbarItemInterface) => {
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  return (
    <Box
      className={styles.toolbarItemBox}
      id={id}
      cursor={!treeUpdateState.isPlaying ? "pointer" : "auto"}
      opacity={!treeUpdateState.isPlaying ? "1" : "0.6"}
    >
      <Box className={styles.icon}>{icon}</Box>
      <Text className={styles.toolbarItem}>{text}</Text>
    </Box>
  );
};

export default ToolbarItem;
