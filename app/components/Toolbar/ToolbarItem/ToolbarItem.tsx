import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import styles from "./ToolbarItem.module.scss";

interface ToolbarItemInterface {
  text: string;
  icon: JSX.Element;
}

const ToolbarItem = ({ text, icon }: ToolbarItemInterface) => {
  return (
    <Box className={styles.toolbarItemBox}>
      <Box className={styles.icon}>{icon}</Box>
      <Text className={styles.toolbarItem}>{text}</Text>
    </Box>
  );
};

export default ToolbarItem;
