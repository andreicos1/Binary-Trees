import { Box } from "@chakra-ui/react";
import Link from "next/link";
import styles from "./Footer.module.scss";
import SocialMedia from "./SocialMedia";

const Footer = () => {
  return (
    <Box className={styles.footer}>
      <SocialMedia />
      <p className={styles.contact}>
        For any feedback or suggestions, please contact me on{" "}
        <Link href="https://www.linkedin.com/in/andrei-cosmin-radu-2b0886150/">
          <a className={styles.link} target="_blank">
            LinkedIn
          </a>
        </Link>{" "}
        or{" "}
        <Link href="https://twitter.com/AndreiR02443803">
          <a className={styles.link} target="_blank">
            Twitter
          </a>
        </Link>
        .
      </p>
      <p className={styles.heading}>Binary Trees</p>
    </Box>
  );
};

export default Footer;
