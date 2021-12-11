import { Box } from "@chakra-ui/layout";
import React, { useRef } from "react";
import Canvas from "../Canvas/Canvas";
import Toolbar from "../Toolbar/ToolbarBox/Toolbar";
import styles from "./ToolkitCanvasBox.module.scss";

const ToolkitCanvasBox = () => {
  const constraintRef = useRef(null); // ref for xarrow
  const nodeBoxesRef = useRef(new Array<HTMLDivElement>());
  return (
    <Box className={styles.toolkitCanvasBox} ref={constraintRef}>
      <Toolbar addNodeDragConstraints={constraintRef} nodeBoxesRef={nodeBoxesRef} />
      <Canvas nodeBoxesRef={nodeBoxesRef} />
    </Box>
  );
};

export default ToolkitCanvasBox;
