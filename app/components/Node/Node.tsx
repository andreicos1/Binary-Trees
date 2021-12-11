import { Box, Circle, Container, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import styles from "./Node.module.scss";

interface NodeInterface {
  value: string;
  isEditing?: boolean;
  onBlur?: (value: string) => void;
}

const Node = ({ value, isEditing, onBlur }: NodeInterface) => {
  const [nodeValue, setNodeValue] = useState(value);
  const updateNodeValue = (event: React.FormEvent<HTMLInputElement>) => {
    setNodeValue(event.currentTarget.value);
  };
  return (
    <Box>
      <Circle className={styles.node}>
        {isEditing ? (
          <Input
            className={styles.input}
            value={nodeValue}
            onChange={updateNodeValue}
            onBlur={() => onBlur!(nodeValue)}
          />
        ) : (
          <Text className={styles.content}>{value}</Text>
        )}
      </Circle>
    </Box>
  );
};

export default Node;
