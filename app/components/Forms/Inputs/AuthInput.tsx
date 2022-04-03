import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";
import validation from "../Validation/validation";

import styles from "./AuthInput.module.scss";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "email" | "password";
  hasValidation?: boolean;
  placeholder?: string;
  id?: string;
  label?: string;
  errorMessage?: string;
}
const AuthInput = forwardRef(
  (
    {
      value,
      onChange,
      type,
      id,
      label,
      placeholder,
      errorMessage,
      hasValidation = true,
      ...others
    }: Props,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const isError = !validation(type, value);
    const [wasBlurred, setWasBlurred] = useState(false);
    const handleBlur = () => {
      if (!wasBlurred) setWasBlurred(true);
    };
    return (
      <FormControl
        className={styles.formGroup}
        isInvalid={hasValidation && wasBlurred && isError}
        {...others}
      >
        {label && (
          <FormLabel fontSize="1.6rem" className={styles.formLabel} htmlFor={id}>
            {label}
          </FormLabel>
        )}
        <Input
          ref={ref}
          fontSize="1.4rem"
          padding="1.8rem 1rem"
          id={id || ""}
          type={type}
          placeholder={placeholder || ""}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
        />
        {errorMessage && <FormErrorMessage fontSize="1.4rem">{errorMessage}</FormErrorMessage>}
      </FormControl>
    );
  }
);

export default AuthInput;
