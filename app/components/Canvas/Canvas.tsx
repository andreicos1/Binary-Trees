import { Box, Flex } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import Node from "../Node/Node";
import styles from "./Canvas.module.scss";
import { RootState } from "../../store";
import dynamic from "next/dynamic";
import { getNodesByLevel } from "../../features/tree/treeFunctions";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

interface Props {
  nodeBoxesRef: React.MutableRefObject<HTMLDivElement[]>;
}

const Canvas = ({ nodeBoxesRef }: Props) => {
  const tree = useSelector((state: RootState) => state.tree);
  const treeByLevels = getNodesByLevel(tree);

  return (
    <Box className={styles.canvas}>
      {treeByLevels.map((level, levelIdx) => {
        return (
          <Flex width="100%" justifyContent="space-around" key={levelIdx}>
            {level.map((node, columnIdx) => {
              const currNodeId = `${levelIdx},${columnIdx}`;
              const parentNodeColumn = columnIdx >> 1;
              const parentNodeId = `${levelIdx - 1},${parentNodeColumn}`;
              const connection =
                levelIdx !== 0 ? (
                  <Xarrow
                    showHead={false}
                    startAnchor="bottom"
                    endAnchor="top"
                    path="straight"
                    color="#393D41"
                    start={parentNodeId}
                    end={currNodeId}
                  />
                ) : null;
              const nodeElement = node ? (
                <>
                  <Node value={node} />
                  {connection}
                </>
              ) : null;
              const nodeIndex = Math.pow(2, levelIdx) - 1 + columnIdx;
              return (
                <Box
                  id={currNodeId}
                  key={columnIdx}
                  className={styles.nodeBox}
                  ref={(el: HTMLDivElement) => {
                    const clientRect = el ? el.getBoundingClientRect() : null;
                    nodeBoxesRef.current[nodeIndex] = el;
                  }}
                >
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
