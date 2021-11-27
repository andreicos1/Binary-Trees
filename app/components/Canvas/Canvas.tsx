import { Box, Flex } from "@chakra-ui/layout";
import { useDispatch, useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState } from "../../store";
import React from "react";

const Canvas = () => {
  const tree = useSelector((state: RootState) => state.tree);
  const dispatch = useDispatch();
  const treeByLevels = tree.getNodesByLevel();
  console.log(treeByLevels);

  return (
    <Box className={styles.canvas}>
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Flex width="100%" key={levelIdx} justifyContent="space-around">
            {level.map((node, columnIdx) => {
              const nodeElement = node ? <Node value={node} /> : null;
              return (
                <Box key={columnIdx} className={styles.nodeBox}>
                  {nodeElement}
                </Box>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
};

export default Canvas;
