import Link from "next/link";
import { Box, Button, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

import AuthInput from "../Inputs/AuthInput";
import { EMAIL_ERROR_MESSAGE } from "../Validation/validation";
import Title from "../title/Title";

import styles from "./Forms.module.scss";
import { BASE_URL, TOAST_ERROR } from "../../../constants";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast(TOAST_ERROR);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.status > 299) {
        throw Error(`${response.status} error`);
      }
      toast({
        title: "An email was sent to your address with instructions on how to reset your password.",
        status: "success",
      });
      setIsLoading(false);
    } catch (error) {
      toast({ title: "Something went wrong. Please try again." });
      setIsLoading(false);
    }
  };
  return (
    <Box className={styles.formRoot}>
      <Box className={styles.form}>
        <Title title="Sign In" />
        <AuthInput
          value={email}
          onChange={handleEmailChange}
          type="email"
          id="email"
          placeholder="Email"
          label="Email"
          errorMessage={EMAIL_ERROR_MESSAGE}
        />

        <Button
          marginTop="0.8rem"
          backgroundColor="#508484"
          color="#ededed"
          fontSize="1.8rem"
          className={styles.formmButton}
          onClick={onSubmit}
          isLoading={isLoading}
        >
          Recover Password
        </Button>
        <Box className={styles.linksBox}>
          <Link href="/signup">
            <a className={styles.link}>Sign Up</a>
          </Link>
          <Link href="/signin">
            <a className={styles.link}>Log In</a>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
