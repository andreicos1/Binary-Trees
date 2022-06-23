import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { updateSpeed } from "../../features/speed/speedSlice";
import { RootState, useAppDispatch } from "../../store";

import styles from "./Slider.module.scss";

const SpeedSlider = () => {
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const dispatch = useAppDispatch();

  // Duration shoulld be between 300ms and 600ms 300/100 = 3
  // 100 --> 300ms
  // 0 --> 600ms
  // 10 --> 600 - 10 * 3 = 570
  const updateAnimationSpeed = (val: number) => {
    const newSpeed = 600 - val * 3;
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
        defaultValue={60}
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
