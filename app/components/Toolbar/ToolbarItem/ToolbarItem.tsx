import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import styles from "./ToolbarItem.module.scss";

interface ToolbarItemInterface {
  text: string;
  icon: JSX.Element;
  id: string;
}

const ToolbarItem = ({ text, icon, id }: ToolbarItemInterface) => {
  return (
    <Box className={styles.toolbarItemBox} id={id}>
      <Box className={styles.icon}>{icon}</Box>
      <Text className={styles.toolbarItem}>{text}</Text>
    </Box>
  );
};

export default ToolbarItem;
