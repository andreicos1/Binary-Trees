import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { BASE_URL } from "../../../constants";
import { ReactionsData } from "../../../pages";
import ReactionsItem from "../ReactionsItem/ReactionsItem";
import styles from "./Reactions.module.scss";

const Reactions = ({ totalViews, totalLikes, initialIsLiked }: ReactionsData) => {
  const [currentLikes, setCurrentLikes] = useState(totalLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const postLike = async () => {
    try {
      const responseAddLike = await fetch(`${BASE_URL}/likes`, { method: "POST" });
      const addedLike = await responseAddLike.json();
      if (addedLike) {
        setCurrentLikes(currentLikes + 1);
      } else {
        setCurrentLikes(currentLikes - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <Box className={styles.reactionsBar}>
      <ReactionsItem
        value={totalViews.toString()}
        icon={
          <svg className={styles.eye}>
            <use xlinkHref="/sprites.svg#icon-eye" />
          </svg>
        }
      />
      <ReactionsItem
        value={totalLikes.toString()}
        icon={
          <svg className={styles.heart}>
            <use xlinkHref="/sprites.svg#icon-heart" />
          </svg>
        }
      />
      <ReactionsItem
        value={currentLikes.toString()}
        icon={
          <svg className={isLiked ? styles.thumbsUpLiked : styles.thumbsUpNotLiked}>
            <use xlinkHref="/sprites.svg#icon-thumbs_up" />
          </svg>
        }
        onClick={postLike}
      />
    </Box>
  );
};

export default Reactions;
