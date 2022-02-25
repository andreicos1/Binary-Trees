import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { updateSpeed } from "../../features/speed/speedSlice";
import { RootState, useAppDispatch } from "../../store";
import { ANIMATION_MULTIPLIER, ANIMATION_SLIDER_MODIFIER } from "../../types";

import styles from "./Slider.module.scss";

const SpeedSlider = () => {
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const dispatch = useAppDispatch();

  const updateAnimationSpeed = (val: number) => {
    const maximumSpeed = ANIMATION_MULTIPLIER - ANIMATION_SLIDER_MODIFIER;
    const newSpeed =
      val <= maximumSpeed
        ? ANIMATION_MULTIPLIER * ANIMATION_SLIDER_MODIFIER - val * 10
        : val === 100
        ? 0
        : ANIMATION_MULTIPLIER * ANIMATION_SLIDER_MODIFIER - maximumSpeed * 10;
    dispatch(updateSpeed(newSpeed));
  };

  return (
    <Box
      className={styles.sliderBox}
      cursor={!treeUpdateState.isPlaying ? "pointer" : "auto"}
      opacity={!treeUpdateState.isPlaying ? "1" : "0.6"}
    >
      <Text className={styles.sliderTitle}>Animation Speed</Text>
      <Slider
        id="slider-track-1"
        aria-label="slider"
        defaultValue={40}
        isDisabled={treeUpdateState.isPlaying}
        onChangeEnd={updateAnimationSpeed}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default SpeedSlider;
