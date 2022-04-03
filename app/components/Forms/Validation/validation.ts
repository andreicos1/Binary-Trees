const regexEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/;

const isValidEmail = (email: string) => {
  return email.match(regexEmail);
};

const isValidPassword = (password: string) => {
  return password.length >= 8;
};

const validationTypes = {
  email: isValidEmail,
  password: isValidPassword,
};

export const PASSWORD_ERROR_MESSAGE = "Password must be at least 8 characters long.";
export const CONFIRM_PASSWORD_ERROR_MESSAGE = "Passwords do not match.";
export const EMAIL_ERROR_MESSAGE = "Invalid Email";

const validation = (type: "email" | "password", input: string) => {
  return validationTypes[type](input);
};

export default validation;
