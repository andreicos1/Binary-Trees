import { Circle, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
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
  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
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
        <Input
          autoFocus
          type="number"
          value={newValue}
          onChange={handleValueChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyPress}
          className={styles.input}
        />
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
