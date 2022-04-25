import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import Link from "next/link";

import styles from "./SecondaryNavigation.module.scss";

type Props = {};
export const SecondaryNavigation = (props: Props) => {
  return (
    <Link href="/">
      <Box className={styles.root}>
        <ArrowBackIcon />
        <a>HOME</a>
      </Box>
    </Link>
  );
};
