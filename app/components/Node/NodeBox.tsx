import { GridItem, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
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
}: Props) => {
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
    >
      {label && <Text className={styles.label}>{label}</Text>}
      {children}
    </MotionBox>
  );
};
