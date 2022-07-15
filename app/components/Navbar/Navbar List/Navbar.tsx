import Link from "next/link";
import { Box, Spinner, Text, useToast } from "@chakra-ui/react";
import { generateRandom } from "../../../features/tree/treeSlice";
import { RootState, useAppDispatch } from "../../../store";
import NavbarItem from "../Navbar Item/NavbarItem";
import styles from "./Navbar.module.scss";
import { useContext, useEffect, useState } from "react";
import { BoxesRefContext } from "../../../pages/_app";
import invertTree from "../../../algorithms/invertTree";
import { useSelector } from "react-redux";
import { toggleIsPlaying } from "../../../features/tree/treeUpdateSlice";
import { updatePosition } from "../../../features/tree/treePositionsSlice";
import maximumPathSum from "../../../algorithms/maximumPathSum";
import constructFromInPreorder from "../../../algorithms/constructFromInPreorder";
import { clearMessage } from "../../../features/messages/messagesSlice";
import serializeAndDeserialize from "../../../algorithms/serializeAndDeserialize";
import { BASE_URL, TOAST_ERROR } from "../../../constants";
import { setUser } from "../../../features/user/userSlice";

const Navbar = () => {
  // TODO
  // Add fade in/out to generating random tree
  // Remove arrows when generating tree
  const dispatch = useAppDispatch();
  const nodeBoxesRef = useContext(BoxesRefContext);
  const user = useSelector((state: RootState) => state.user);
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const animationSpeed = useSelector((state: RootState) => state.speed);
  const [loading, setLoading] = useState(true);
  const toast = useToast(TOAST_ERROR);

  const scrollToCanvas = () => {
    if (screen.height < 667) {
      document.getElementById("canvas")!.scrollIntoView({ behavior: "smooth" });
    }
  };

  const animateTreeChange = async (func: any, args: any) => {
    if (!treeUpdateState.isPlaying) {
      scrollToCanvas();
      dispatch(toggleIsPlaying());
      dispatch(clearMessage());
      await func(...args);
      dispatch(toggleIsPlaying());
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
      toast({
        status: "success",
        title: "Successfully logged out.",
      });
      checkUser();
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await fetch(`${BASE_URL}/auth/resend-confirmation`, {
        method: "POST",
        credentials: "include",
      });
      toast({
        status: "success",
        title: "Confirmation sent. Please check your email.",
      });
    } catch (error) {
      toast({ title: "Something went wrong" });
    }
  };

  const checkUser = async () => {
    try {
      await dispatch(setUser());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Box className={styles.root}>
      <input id="navbar-checkbox" type="checkbox" className={styles.navbarCheckbox} />
      <label htmlFor="navbar-checkbox" className={styles.label}>
        <span className={styles.burgerMenu} />
      </label>
      <Box className={styles.navbar}>
        <NavbarItem
          className={styles.generateRandom}
          text="Generate Random Tree"
          onClick={() => {
            if (!treeUpdateState.isPlaying) {
              scrollToCanvas();
              dispatch(clearMessage());
              dispatch(generateRandom());
            }
          }}
        />
        <NavbarItem
          text="Invert Tree"
          onClick={() =>
            animateTreeChange(invertTree, [
              dispatch,
              nodeBoxesRef,
              updatePosition,
              animationSpeed.duration,
            ])
          }
        />
        <NavbarItem
          text="Maximum Path Sum"
          onClick={() =>
            animateTreeChange(maximumPathSum, [dispatch, nodeBoxesRef, animationSpeed.duration])
          }
        />
        <NavbarItem
          text="Construct Tree From Inorder & Postorder Traversals"
          onClick={() =>
            animateTreeChange(constructFromInPreorder, [
              dispatch,
              nodeBoxesRef,
              animationSpeed.duration,
            ])
          }
        />
        <NavbarItem
          text="Serialize & Deserialize Binary Tree"
          onClick={() =>
            animateTreeChange(serializeAndDeserialize, [
              dispatch,
              nodeBoxesRef,
              animationSpeed.duration,
            ])
          }
        />
        <Box className={styles.login}>
          {!loading ? (
            !user.email ? (
              <Text>
                <Link href="/signin">
                  <a>Log In</a>
                </Link>
              </Text>
            ) : (
              <div className={styles.auth}>
                {!user.isEmailConfirmed && (
                  <a onClick={handleResendConfirmation}>Resend Confirmation Email</a>
                )}
                <a className={styles.logOut} onClick={handleLogout}>
                  Log Out
                </a>
              </div>
            )
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
