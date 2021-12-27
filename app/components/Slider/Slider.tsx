import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { updateSpeed } from "../../features/speed/speedSlice";
import { RootState, useAppDispatch } from "../../store";

import styles from "./Slider.module.scss";

const SpeedSlider = () => {
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const speedState = useSelector((state: RootState) => state.speed);
  const dispatch = useAppDispatch();
  const modifier = 15; // from scale 0-100 to ms
  const updateAnimationSpeed = (val: number) => {
    const maximumSpeed = 85;
    const newSpeed =
      val <= maximumSpeed
        ? 100 * modifier - val * 10
        : val === 100
        ? 0
        : 100 * modifier - maximumSpeed * 10;
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
