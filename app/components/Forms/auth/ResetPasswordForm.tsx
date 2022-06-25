import { Box, Button, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";

import styles from "./Forms.module.scss";
import { BASE_URL, TOAST_ERROR } from "../../../constants";
import Title from "../title/Title";
import AuthInput from "../Inputs/AuthInput";
import { PASSWORD_ERROR_MESSAGE } from "../Validation/validation";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast(TOAST_ERROR);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (password !== confirmPassword) {
        setIsLoading(false);
        return toast({ title: "Passwords must match." });
      }
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: router.query.token, password, confirmPassword }),
      });
      if (response.status > 299) {
        setIsLoading(false);
        return toast({ title: "Something went wrong." });
      }
      toast({ title: "Password Reset Successfully", status: "success" });
      router.push("/signin");
    } catch (error) {
      setIsLoading(false);
      return toast({ title: "Something went wrong." });
    }
  };

  return (
    <Box className={styles.formRoot}>
      <Box className={styles.form}>
        <Title title="Sign In" />
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
          id="confirm-password"
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
          onClick={handleSubmit}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
