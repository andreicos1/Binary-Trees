import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar List/Navbar";
import Reactions from "../components/Reactions/ReactionsBar/Reactions";
import ToolkitCanvasBox from "../components/ToolkitCanvasBox/ToolkitCanvasBox";
import styles from "../styles/Home.module.scss";

const Home = () => {
  useEffect(() => {
    if (screen.orientation) screen.orientation.lock("landscape");
  }, []);

  return (
    <Box>
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
