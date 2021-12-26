import { Box, Text } from "@chakra-ui/layout";
import ToolbarItem from "../ToolbarItem/ToolbarItem";
import ToolbarItemAdd from "../ToolbarItem/ToolbarItemAdd";
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

interface ToolbarProps {
  addNodeDragConstraints: React.MutableRefObject<JSX.Element | null>;
  nodeBoxesRef: React.MutableRefObject<HTMLDivElement[]>;
}

const Toolbar = ({ addNodeDragConstraints, nodeBoxesRef }: ToolbarProps) => {
  const iconSize = "1.5rem";
  const treeUpdateState = useSelector((state: RootState) => state.treeUpdate);
  const dispatch = useAppDispatch();

  const dispatchToolkitOptionById = {
    "option-add": toggleAdd(),
    "option-delete": toggleDelete(),
    "option-edit": toggleEdit(),
  };
  const optionsById = "option-add" || "opion-delete" || "option-edit";

  return (
    <Box
      id="toolkit"
      className={styles.toolbarBox}
      onClick={(event) => {
        if (treeUpdateState.isPlaying) {
          return;
        }
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
        } else if (target.id === "toolkit") {
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
      <ToolbarItemAdd
        text="Add"
        icon={<AddIcon height={iconSize} width={iconSize} color="#97DB4F" />}
        id="option-add"
        addNodeDragConstraints={addNodeDragConstraints}
        nodeBoxesRef={nodeBoxesRef}
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
