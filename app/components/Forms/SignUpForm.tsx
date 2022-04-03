import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

import styles from "./Forms.module.scss";
import AuthInput from "./Inputs/AuthInput";
import Title from "./title/Title";
import { EMAIL_ERROR_MESSAGE, PASSWORD_ERROR_MESSAGE } from "./Validation/validation";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  const onSubmit = () => {};

  return (
    <Box className={styles.formRoot}>
      <Box className={styles.form}>
        <Title title="Sign Up" />
        <AuthInput
          value={email}
          onChange={handleEmailChange}
          type="email"
          id="email"
          placeholder="Email"
          label="Email"
          errorMessage={EMAIL_ERROR_MESSAGE}
        />
        <AuthInput
          value={password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          placeholder="Password"
          label="Password"
          errorMessage={PASSWORD_ERROR_MESSAGE}
        />
        <AuthInput
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          type="password"
          id="ConfirmPassword"
          placeholder="Confirm Password"
          label="Confirm Password"
          errorMessage={PASSWORD_ERROR_MESSAGE}
        />

        <Button
          marginTop="0.8rem"
          backgroundColor="#508484"
          color="#ededed"
          fontSize="1.8rem"
          className={styles.formmButton}
          onClick={onSubmit}
        >
          Sign Up
        </Button>
        <Box className={styles.linksBox}>
          <Link href="/signin">
            <a className={styles.link}>Sign In</a>
          </Link>
          <Link href="/forgot-password">
            <a className={styles.link}>Forgot Password</a>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SigninForm;
