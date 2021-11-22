import { Image } from "@chakra-ui/image";
import { Box, Text } from "@chakra-ui/layout";
import ReactionsItem from "../ReactionsItem/ReactionsItem";
import styles from "./Reactions.module.scss";

const Reactions = () => {
  return (
    <Box className={styles.reactionsBar}>
      <ReactionsItem
        icon={
          <svg className={styles.eye}>
            <use xlinkHref="/sprites.svg#icon-eye" />{" "}
          </svg>
        }
      />
      <ReactionsItem
        icon={
          <svg className={styles.heart}>
            <use xlinkHref="/sprites.svg#icon-heart" />{" "}
          </svg>
        }
      />
      <ReactionsItem
        icon={
          <svg className={styles.thumbsUp}>
            <use xlinkHref="/sprites.svg#icon-thumbs_up" />{" "}
          </svg>
        }
      />
    </Box>
  );
};

export default Reactions;
