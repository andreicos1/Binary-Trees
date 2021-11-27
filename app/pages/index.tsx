import { Box } from "@chakra-ui/layout";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Canvas from "../components/Canvas/Canvas";
import Navbar from "../components/Navbar/Navbar List/Navbar";
import Reactions from "../components/Reactions/ReactionsBar/Reactions";
import Toolbar from "../components/Toolbar/ToolbarBox/Toolbar";
import ToolkitCanvasBox from "../components/ToolkitCanvasBox/ToolkitCanvasBox";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
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
      </Box>
      <Box bg="#777" height="100px" color="white" fontSize="2rem">
        Comments
      </Box>
    </Box>
  );
};

export default Home;
