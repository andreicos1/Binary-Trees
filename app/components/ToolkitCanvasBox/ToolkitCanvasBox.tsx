import { Box } from "@chakra-ui/layout";
import React from "react";
import Canvas from "../Canvas/Canvas";
import Toolbar from "../Toolbar/ToolbarBox/Toolbar";
import styles from "./ToolkitCanvasBox.module.scss";

const ToolkitCanvasBox = () => {
  return (
    <Box className={styles.toolkitCanvasBox}>
      <Toolbar />
      <Canvas />
    </Box>
  );
};

export default ToolkitCanvasBox;
