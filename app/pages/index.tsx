import { Box } from "@chakra-ui/layout";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar List/Navbar";
import Reactions from "../components/Reactions/ReactionsBar/Reactions";
import ToolkitCanvasBox from "../components/ToolkitCanvasBox/ToolkitCanvasBox";
import { BASE_URL } from "../constants";
import styles from "../styles/Home.module.scss";

export const getServerSideProps: GetServerSideProps = async () => {
  const urlViews = `${BASE_URL}/views`;
  const urlLikes = `${BASE_URL}/likes`;
  try {
    const [_, responseViews, responseLikes, responseIsLiked] = await Promise.all([
      fetch(urlViews, { method: "POST" }), // Add new view
      fetch(urlViews),
      fetch(urlLikes),
      fetch(`${urlLikes}/ip`),
    ]);

    const [totalViews, totalLikes, initialIsLiked] = await Promise.all([
      responseViews.json(),
      responseLikes.json(),
      !responseIsLiked.json(),
    ]);

    return {
      props: { totalViews, totalLikes, initialIsLiked },
    };
  } catch (error) {
    console.log({ error });
    return {
      props: { totalViews: "...", totalLikes: "...", initialIsLiked: "..." },
    };
  }
};

export interface ReactionsData {
  totalViews: number;
  totalLikes: number;
  initialIsLiked: boolean;
}

const Home = ({ totalViews, totalLikes, initialIsLiked }: ReactionsData) => {
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
          <Reactions
            totalViews={totalViews}
            totalLikes={totalLikes}
            initialIsLiked={initialIsLiked}
          />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Home;
