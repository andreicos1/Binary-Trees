import { Box } from "@chakra-ui/react";
import SignUpForm from "../components/Forms/auth/SignUpForm";
import { SecondaryNavigation } from "../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import styles from "../styles/pages/Auth.module.scss";

const Signup = () => {
  return (
    <Box className={styles.root}>
      <Box className={styles.content}>
        <SecondaryNavigation />
        <SignUpForm />
      </Box>
    </Box>
  );
};

export default Signup;
