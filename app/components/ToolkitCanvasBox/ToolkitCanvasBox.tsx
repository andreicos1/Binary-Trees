import { Box } from "@chakra-ui/layout";
import React, { useRef } from "react";
import Canvas from "../Canvas/Canvas";
import Toolbar from "../Toolbar/ToolbarBox/Toolbar";
import styles from "./ToolkitCanvasBox.module.scss";

const ToolkitCanvasBox = () => {
  const constraintRef = useRef(null);

  return (
    <Box className={styles.toolkitCanvasBox} ref={constraintRef}>
      <Toolbar addNodeDragConstraints={constraintRef} />
      <Canvas />
    </Box>
  );
};

export default ToolkitCanvasBox;
