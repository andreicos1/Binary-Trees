import { Box, Text } from "@chakra-ui/layout";
import styles from "./ReactionsItem.module.scss";

interface ReactionsItem {
  icon: JSX.Element;
}

const ReactionsItem = ({ icon }: ReactionsItem) => {
  return (
    <Box className={styles.iconGroup}>
      <Box className={styles.iconBox}>{icon}</Box>
      <Text className={styles.iconCount}>{17}</Text>
    </Box>
  );
};

export default ReactionsItem;
