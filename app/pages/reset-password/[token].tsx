import { Box } from "@chakra-ui/react";

import { SecondaryNavigation } from "../../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import ResetPasswordForm from "../../components/Forms/auth/ResetPasswordForm";

import styles from "../../styles/pages/Auth.module.scss";

const ResetPassword = () => {
  return (
    <Box className={styles.root}>
      <Box className={styles.content}>
        <SecondaryNavigation />
        <ResetPasswordForm />
      </Box>
    </Box>
  );
};

export default ResetPassword;
