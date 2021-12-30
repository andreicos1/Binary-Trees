import { Circle, Text } from "@chakra-ui/layout";
import styles from "./Node.module.scss";

interface NodeInterface {
  value: string;
  isHighlighting?: boolean;
  onClick?: () => void;
}

const Node = ({ value, isHighlighting, onClick }: NodeInterface) => {
  return (
    <Circle onClick={() => onClick && onClick()}>
      <Circle className={styles.node} _hover={isHighlighting ? { backgroundColor: "#99C2C2" } : {}}>
        <Text className={styles.content}>{value}</Text>
      </Circle>
    </Circle>
  );
};

export default Node;
