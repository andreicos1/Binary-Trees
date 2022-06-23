import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { SecondaryNavigation } from "../../components/Navbar/SecondaryNavigation/SecondaryNavigation";
import { BASE_URL } from "../../constants";
import styles from "./ConfirmEmail.module.scss";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: query.token }),
    });
    if (response.status > 299) return { props: { confirmed: false } };
    return { props: { confirmed: true } };
  } catch (error) {
    return { props: { confirmed: false } };
  }
};

const ConfirmEmail = ({ confirmed }: { confirmed: boolean }) => {
  return (
    <Box className={styles.root}>
      <Box className={styles.confirmEmail}>
        <SecondaryNavigation />
        <p className={styles.message}>
          {confirmed
            ? "Your account has been confirmed!"
            : "An error has occurred. Please try again."}
        </p>
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
