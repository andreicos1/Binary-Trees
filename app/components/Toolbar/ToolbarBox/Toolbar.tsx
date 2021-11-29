import { Box, Text } from "@chakra-ui/layout";
import ToolbarItem from "../ToolbarItem/ToolbarItem";
import styles from "./Toolbar.module.scss";
import { CloseIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { RootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import {
  toggleAdd,
  toggleDelete,
  toggleEdit,
  turnAllOff,
} from "../../../features/tree/treeUpdateSlice";

const Toolbar = () => {
  const iconSize = "1.5rem";
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const dispatch = useAppDispatch();

  const dispatchToolkitOptionById = {
    "option-add": toggleAdd(),
    "option-delete": toggleDelete(),
    "option-edit": toggleEdit(),
  };
  const optionsById = "option-add" || "opion-delete" || "option-edit";
  console.log(treeUpdateState);

  return (
    <Box
      className={styles.toolbarBox}
      onClick={(event) => {
        // Change selected toolkit item
        const target = event.target as HTMLElement;
        if (Object.keys(dispatchToolkitOptionById).includes(target.id)) {
          // Toggle corresponding ID
          dispatch(dispatchToolkitOptionById[target.id as typeof optionsById]);
        } else if (
          target.parentNode &&
          Object.keys(dispatchToolkitOptionById).includes((target.parentNode as HTMLElement).id)
        ) {
          dispatch(
            dispatchToolkitOptionById[(target.parentNode as HTMLElement).id as typeof optionsById]
          );
        } else {
          dispatch(turnAllOff());
        }
      }}
    >
      <Text className={styles.toolbarTitle}>Toolkit</Text>
      <ToolbarItem
        text="Delete"
        icon={<CloseIcon height={iconSize} width={iconSize} color="#e32636" />}
        id="option-delete"
      />
      <ToolbarItem
        text="Add"
        icon={<AddIcon height={iconSize} width={iconSize} color="#97DB4F" />}
        id="option-add"
      />
      <ToolbarItem
        text="Edit"
        icon={<EditIcon height={iconSize} width={iconSize} color="#ededed" />}
        id="option-edit"
      />
    </Box>
  );
};

export default Toolbar;
