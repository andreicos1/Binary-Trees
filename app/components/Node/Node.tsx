import { Circle, Text } from "@chakra-ui/react";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { changeNodeValue, TreeState } from "../../features/tree/treeSlice";
import styles from "./Node.module.scss";

interface NodeInterface {
  value: string;
  isHighlighting?: boolean;
  onClick?: () => void;
  treeNode: TreeState;
  dispatch: any;
  rowIndex: number;
  colIndex: number;
}

const Node = ({
  value,
  isHighlighting,
  onClick,
  treeNode,
  dispatch,
  rowIndex,
  colIndex,
}: NodeInterface) => {
  const [newValue, setNewValue] = useState("");
  const handleValueChange = (value: string) => {
    if (value[0] === "-") value = "0";
    else if (value.length > 2) value = "99";
    setNewValue(value);
  };
  const handleSubmit = () => {
    dispatch(changeNodeValue({ rowIndex, colIndex, newNodeValue: newValue }));
  };
  const handleKeyPress = (event: any) => {
    if (["Escape", "Enter"].includes(event.key)) {
      handleSubmit();
    }
  };
  useEffect(() => {
    treeNode && setNewValue(treeNode.value);
  }, [treeNode]);
  {
    return treeNode?.isEditing ? (
      <Circle className={styles.node}>
        <NumberInput value={newValue} onChange={handleValueChange} min={0} max={99}>
          <NumberInputField
            autoFocus
            onBlur={handleSubmit}
            onKeyDown={handleKeyPress}
            className={styles.input}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Circle>
    ) : (
      <Circle onClick={() => onClick && onClick()}>
        <Circle
          className={styles.node}
          _hover={isHighlighting ? { backgroundColor: "#99C2C2" } : {}}
        >
          <Text className={styles.content}>{value}</Text>
        </Circle>
      </Circle>
    );
  }
};

export default Node;
