import { Box, Button } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

import AuthInput from "./Inputs/AuthInput";
import { EMAIL_ERROR_MESSAGE, PASSWORD_ERROR_MESSAGE } from "./Validation/validation";

import styles from "./Forms.module.scss";
import Title from "./title/Title";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const onSubmit = () => {};
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
