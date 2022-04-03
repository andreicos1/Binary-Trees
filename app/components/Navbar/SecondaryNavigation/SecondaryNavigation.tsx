// @flow
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";

import styles from "./SecondaryNavigation.module.scss";

type Props = {};
export const SecondaryNavigation = (props: Props) => {
  return (
    <Box className={styles.root}>
      <ArrowBackIcon />
      <Text>
        <Link href="/">
          <a>HOME</a>
        </Link>
      </Text>
    </Box>
  );
};
