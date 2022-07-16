import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BoxesRefContext } from "../../pages/_app";
import { RootState } from "../../store";
import Toolbar from "../Toolbar/ToolbarBox/Toolbar";
import styles from "./ToolkitCanvasBox.module.scss";

const Canvas = dynamic(() => import("../Canvas/Canvas"), {
  ssr: false,
});

const ForwardedRefComponent = forwardRef((props, ref) => <Canvas {...props} nodeBoxesRef={ref} />);

const ToolkitCanvasBox = () => {
  const constraintRef = useRef(null); // ref for xarrow
  const nodeBoxesRef = useContext(BoxesRefContext);
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const cursor = treeUpdateState.deleting
    ? "url('/x-mark.svg'), auto"
    : treeUpdateState.editing
    ? "url('/pencil.svg'), auto"
    : "auto";

  return (
    <Box ref={constraintRef} className={styles.toolkitCanvasBox} cursor={cursor}>
      <Toolbar addNodeDragConstraints={constraintRef} nodeBoxesRef={nodeBoxesRef} />
      <ForwardedRefComponent ref={nodeBoxesRef} />
    </Box>
  );
};

export default ToolkitCanvasBox;
