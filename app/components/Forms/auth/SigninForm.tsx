import { useRouter } from "next/router";
import { Box, Button, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import {
  EMAIL_ERROR_MESSAGE,
  isValidEmail,
  isValidPassword,
  PASSWORD_ERROR_MESSAGE,
} from "../Validation/validation";
import { BASE_URL, TOAST_ERROR } from "../../../constants";

import { useAppDispatch } from "../../../store";
import { setUser } from "../../../features/user/userSlice";
import Link from "next/link";
import Title from "../title/Title";
import AuthInput from "../Inputs/AuthInput";

import styles from "./Forms.module.scss";

const SigninForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast(TOAST_ERROR);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const onSubmit = async () => {
    setIsLoading(true);
    if (!isValidEmail(email)) {
      setIsLoading(false);
      return toast({
        title: "Invalid email",
      });
    }
    if (!isValidPassword(password)) {
      setIsLoading(false);
      return toast({
        title: "Invalid password",
      });
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response?.status < 200 || response?.status > 299) {
        setIsLoading(false);
        return toast({
          title: "Invalid email and password combination",
        });
      }
      dispatch(setUser());
      toast({
        title: "Logged in Successfully",
        status: "success",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: error as string,
      });
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
        <AuthInput
          value={password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          placeholder="Password"
          label="Password"
          errorMessage={PASSWORD_ERROR_MESSAGE}
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
          Log In
        </Button>
        <Box className={styles.linksBox}>
          <Link href="/signup">
            <a className={styles.link}>Sign Up</a>
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
