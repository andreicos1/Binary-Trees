import { Box } from "@chakra-ui/react";
import Link from "next/link";

import styles from "./SocialMedia.module.scss";

const SocialMedia = () => {
  return (
    <Box className={styles.socialMedia}>
      <Link href="https://github.com/andreicos1/Binary-Trees">
        <a target="_blank">
          <svg className={styles.icon}>
            <use xlinkHref="/sprites.svg#icon-github" />
          </svg>
        </a>
      </Link>

      <Link href="https://www.linkedin.com/in/andrei-cosmin-radu-2b0886150/">
        <a target="_blank">
          <svg className={styles.icon}>
            <use xlinkHref="/sprites.svg#icon-linkedin" />
          </svg>
        </a>
      </Link>
    </Box>
  );
};

export default SocialMedia;
