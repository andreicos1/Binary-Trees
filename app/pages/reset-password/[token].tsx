import { Box } from "@chakra-ui/react";

import { SecondaryNavigation } from "../../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import ResetPasswordForm from "../../components/Forms/auth/ResetPasswordForm";

import styles from "../confirm-email/ConfirmEmail.module.scss";

const ResetPassword = () => {
  return (
    <Box className={styles.root}>
      <Box className={styles.confirmEmail}>
        <SecondaryNavigation />
        <ResetPasswordForm />
      </Box>
    </Box>
  );
};

export default ResetPassword;
