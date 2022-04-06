import { Box } from "@chakra-ui/react";
import ForgotPasswordForm from "../components/Forms/ForgotPasswordForm";
import { SecondaryNavigation } from "../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import styles from "../styles/pages/Auth.module.scss";

const ForgotPassword = () => {
  return (
    <Box className={styles.root}>
      <Box className={styles.content}>
        <SecondaryNavigation />
        <ForgotPasswordForm />
      </Box>
    </Box>
  );
};

export default ForgotPassword;
