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
};

export const NodeBox = ({
  currNodeId,
  gridRowStart,
  gridColumnStart,
  transition,
  setRef,
  children,
  onFocus,
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
      {false && (
        <Text opacity="1" className={styles.label}>
          34
        </Text>
      )}
      {children}
    </MotionBox>
  );
};
