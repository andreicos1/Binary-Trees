import { Box, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useReducer, useState } from "react";
import { BASE_URL, TOAST_ERROR } from "../../../constants";
import ReactionsItem from "../ReactionsItem/ReactionsItem";
import styles from "./Reactions.module.scss";

export interface ReactionsData {
  totalViews: number;
  totalLikes: number;
  totalHearts: number;
  isLiked: boolean;
  isFavorited: boolean;
}

interface State extends ReactionsData {
  isLoading: boolean;
}

type Action =
  | {
      type: "setReactions";
      payload: ReactionsData;
    }
  | {
      type: "removeLoading";
    }
  | {
      type: "changeLikes" | "changeHearts";
      payload: boolean; // like added -> true; removed -> false
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setReactions":
      return { ...action.payload, isLoading: false };
    case "removeLoading":
      return { ...state, isLoading: false };
    case "changeLikes":
      return {
        ...state,
        isLiked: action.payload,
        totalLikes: state.totalLikes + (action.payload ? 1 : -1),
      };
    case "changeHearts":
      return {
        ...state,
        isFavorited: action.payload,
        totalHearts: state.totalHearts + (action.payload ? 1 : -1),
      };
  }
};

const Reactions = () => {
  const [{ isLoading, totalViews, totalLikes, totalHearts, isLiked, isFavorited }, dispatch] =
    useReducer(reducer, {
      isLoading: true,
      totalViews: 0,
      totalLikes: 0,
      totalHearts: 0,
      isLiked: false,
      isFavorited: false,
    });
  const toast = useToast(TOAST_ERROR);

  const getReactions = async () => {
    const urlViews = `${BASE_URL}/views`;
    const urlLikes = `${BASE_URL}/likes`;
    const urlHearts = `${BASE_URL}/hearts`;
    try {
      const [
        _,
        responseViews,
        responseLikes,
        responseHearts,
        responseIsLiked,
        responseIsFavorited,
      ] = await Promise.all([
        fetch(urlViews, { method: "POST" }), // Add new view based on IP
        fetch(urlViews),
        fetch(urlLikes),
        fetch(urlHearts),
        fetch(`${urlLikes}/ip`),
        fetch(`${urlHearts}/me`, { credentials: "include" }),
      ]);

      const [totalViews, totalLikes, totalHearts, isLiked, isFavorited] = await Promise.all([
        await responseViews.json(),
        await responseLikes.json(),
        await responseHearts.json(),
        await responseIsLiked.json(),
        await responseIsFavorited.json(),
      ]);

      dispatch({
        type: "setReactions",
        payload: { totalViews, totalLikes, totalHearts, isLiked, isFavorited },
      });
    } catch (error) {
      dispatch({
        type: "removeLoading",
      });
    }
  };

  const postLike = async () => {
    try {
      const responseAddLike = await fetch(`${BASE_URL}/likes`, { method: "POST" });
      if (responseAddLike.status > 299) throw "Something went wrong";
      const addedLike = await responseAddLike.json();
      dispatch({ type: "changeLikes", payload: addedLike });
    } catch (error) {}
  };

  const postHeart = async () => {
    try {
      const responseAddHeart = await fetch(`${BASE_URL}/hearts`, {
        method: "POST",
        credentials: "include",
      });
      if (responseAddHeart.status === 401) {
        toast({ title: "Only signed in users with a confirmed email address can favorite" });
      }
      if (responseAddHeart.status > 299) throw "Something went wrong";
      const addedHeart = await responseAddHeart.json();
      dispatch({ type: "changeHearts", payload: addedHeart });
    } catch (error) {}
  };

  useEffect(() => {
    getReactions();
  }, []);

  return (
    <Box className={styles.reactionsBar}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {" "}
          <ReactionsItem
            value={totalViews}
            icon={
              <svg className={styles.eye}>
                <use xlinkHref="/sprites.svg#icon-eye" />
              </svg>
            }
          />
          <ReactionsItem
            value={totalHearts}
            icon={
              <svg className={isFavorited ? styles.favorited : styles.notFavorited}>
                <use xlinkHref="/sprites.svg#icon-heart" />
              </svg>
            }
            onClick={postHeart}
          />
          <ReactionsItem
            value={totalLikes}
            icon={
              <svg className={isLiked ? styles.thumbsUpLiked : styles.thumbsUpNotLiked}>
                <use xlinkHref="/sprites.svg#icon-thumbs_up" />
              </svg>
            }
            onClick={postLike}
          />
        </>
      )}
    </Box>
  );
};

export default Reactions;
