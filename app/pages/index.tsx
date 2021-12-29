import { Box } from "@chakra-ui/layout";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Navbar from "../components/Navbar/Navbar List/Navbar";
import Reactions from "../components/Reactions/ReactionsBar/Reactions";
import ToolkitCanvasBox from "../components/ToolkitCanvasBox/ToolkitCanvasBox";
import styles from "../styles/Home.module.scss";

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const urlViews = `${baseUrl}/views`;
  const urlLikes = `${baseUrl}/likes`;
  await fetch(urlViews, { method: "POST" }); // Add new view
  const responseViews = await fetch(urlViews);
  const totalViews = await responseViews.json();

  const responseLikes = await fetch(urlLikes);
  const totalLikes = await responseLikes.json();

  return {
    props: { totalViews, totalLikes },
  };
};

export interface ReactionsData {
  totalViews: number;
  totalLikes: number;
}

const Home = ({ totalViews, totalLikes }: ReactionsData) => {
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
          <Reactions totalViews={totalViews} totalLikes={totalLikes} />
        </Box>
      </Box>
      <Box bg="#777" height="100px" color="white" fontSize="2rem">
        Comments
      </Box>
    </Box>
  );
};

export default Home;
