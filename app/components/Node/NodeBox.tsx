import { GridItem, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Spring } from "../../types";

import styles from "./NodeBox.module.scss";

const MotionBox = motion(GridItem);

type Props = {
  currNodeId: string;
  gridRowStart: number;
  gridColumnStart: number;
  transition: Spring | null;
  setRef: (element: HTMLDivElement) => void;
  onFocus: () => void;
  children: JSX.Element | null;
  label?: string | null;
  display?: string;
};

export const NodeBox = ({
  currNodeId,
  gridRowStart,
  gridColumnStart,
  transition,
  setRef,
  children,
  onFocus,
  label,
  display,
}: Props) => {
  const treeUpdate = useSelector((state: RootState) => state.treeUpdate);
  const isLabelPositionDown = treeUpdate.labelPosDown;
  return (
    <MotionBox
      key={currNodeId}
      id={currNodeId}
      gridRowStart={gridRowStart}
      gridColumnStart={gridColumnStart}
      layout
      transition={transition}
      onFocus={onFocus}
      className={styles.nodeBox}
      ref={setRef}
      display={display || ""}
    >
      {label && (
        <Text className={styles[isLabelPositionDown ? "label-down" : "label"]}>{label}</Text>
      )}
      {children}
    </MotionBox>
  );
};
