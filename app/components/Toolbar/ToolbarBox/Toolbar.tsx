import { Box, Text } from "@chakra-ui/layout";
import ToolbarItem from "../ToolbarItem/ToolbarItem";
import styles from "./Toolbar.module.scss";
import { CloseIcon, AddIcon, EditIcon } from "@chakra-ui/icons";

const Toolbar = () => {
  const iconSize = "1.5rem";

  return (
    <Box className={styles.toolbarBox}>
      <Text className={styles.toolbarTitle}>Toolkit</Text>
      <ToolbarItem
        text="Delete"
        icon={<CloseIcon height={iconSize} width={iconSize} color="#e32636" />}
      />
      <ToolbarItem
        text="Add"
        icon={<AddIcon height={iconSize} width={iconSize} color="#97DB4F" />}
      />
      <ToolbarItem
        text="Edit"
        icon={<EditIcon height={iconSize} width={iconSize} color="#ededed" />}
      />
    </Box>
  );
};

export default Toolbar;
