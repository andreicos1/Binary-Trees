import { Box, Circle, Container, Text } from "@chakra-ui/layout";
import styles from "./Node.module.scss";

interface NodeInterface {
  value: string;
}

const Node = ({ value }: NodeInterface) => {
  return (
    <Box>
      <Circle className={styles.node}>
        <Text className={styles.content}>{value}</Text>
      </Circle>
    </Box>
  );
};

export default Node;
