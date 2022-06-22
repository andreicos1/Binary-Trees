import { Box, Text } from "@chakra-ui/react";
import styles from "./ReactionsItem.module.scss";

interface ReactionsItem {
  icon: JSX.Element;
  value: number;
  onClick?: () => void;
}

const ReactionsItem = ({ icon, value, onClick }: ReactionsItem) => {
  return (
    <Box className={styles.iconGroup} onClick={() => onClick && onClick()}>
      <Box className={styles.iconBox}>{icon}</Box>
      <Text className={styles.iconCount}>{value}</Text>
    </Box>
  );
};

export default ReactionsItem;
