import { Box } from "@chakra-ui/react";
import SigninForm from "../components/Forms/auth/SigninForm";
import { SecondaryNavigation } from "../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import styles from "../styles/pages/Auth.module.scss";

const Signin = () => {
  return (
    <Box className={styles.root}>
      <Box className={styles.content}>
        <SecondaryNavigation />
        <SigninForm />
      </Box>
    </Box>
  );
};

export default Signin;
