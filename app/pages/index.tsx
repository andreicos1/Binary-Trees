import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar List/Navbar";
import Reactions from "../components/Reactions/ReactionsBar/Reactions";
import ToolkitCanvasBox from "../components/ToolkitCanvasBox/ToolkitCanvasBox";

import styles from "../styles/Home.module.scss";

const RequestFullscreenModal = dynamic(
  () => import("../components/Modals/RequestFullscreenModal"),
  {
    ssr: false,
  }
);

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (screen.width < 667) {
      setOpenModal(true);
    }
  }, []);

  return (
    <Box>
      {openModal && (
        <RequestFullscreenModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      )}
      <Head>
        <title>Binary Trees</title>
        <meta
          name="description"
          content="Binary Trees Data Structure and Algorithms visualizations"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={styles.body}>
        <Navbar />
        <Box className={styles.content}>
          <ToolkitCanvasBox />
          <Reactions />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Home;
