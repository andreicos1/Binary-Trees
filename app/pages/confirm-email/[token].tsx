import { Box, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SecondaryNavigation } from "../../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import { BASE_URL, TOAST_ERROR } from "../../constants";

import styles from "./ConfirmEmail.module.scss";

const ConfirmEmail = () => {
  const router = useRouter();
  const toast = useToast(TOAST_ERROR);
  const confirm = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: router.query.token }),
      });
      if (response.status > 299) return toast({ title: "Something went wrong. Please try again" });
      toast({ title: "Email confirmed successfully", status: "success" });
    } catch (error) {
      return toast({ title: "Something went wrong. Please try again" });
    }
  };

  useEffect(() => {
    if (router.query.token) confirm();
  }, [router.query.token]);

  return (
    <Box className={styles.root}>
      <Box className={styles.confirmEmail}>
        <SecondaryNavigation />
        <p className={styles.message}>
          For any questions / suggestions, leave me a message on
          <a
            style={{ color: "#7fa1dc" }}
            href="https://www.linkedin.com/in/andrei-cosmin-radu-2b0886150/"
          >
            {" "}
            LinkedIn
          </a>{" "}
          or{" "}
          <a style={{ color: "#7fa1dc" }} href="https://twitter.com/AndreiR02443803">
            {" "}
            Twitter
          </a>
        </p>
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
