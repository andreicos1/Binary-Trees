import { TreeState } from "./treeSlice";

const dfsAddToLevel = (
  node: TreeState | undefined,
  currentLevel: number,
  levels: string[][],
  directionLeft: boolean,
  maxLevel: number,
  parentCol: number
) => {
  if (currentLevel >= maxLevel || !node) return;
  // Add value to corresponding column
  const currentValue = node.value;
  let column = parentCol * 2;
  if (!directionLeft) {
    column++;
  }
  levels[currentLevel][column] = currentValue;
  dfsAddToLevel(node.left, currentLevel + 1, levels, true, maxLevel, column);
  dfsAddToLevel(node.right, currentLevel + 1, levels, false, maxLevel, column);
};

export const getNodesByLevel = (node: TreeState) => {
  // Add the nodes to an array for easy rendering
  const maxLength = parseInt(process.env.NEXT_PUBLIC_MAX_TREE_LEVELS as string);
  // Initialize as empty strings for all rows & cols
  const levels = new Array<Array<string>>();
  for (let i = 0; i < maxLength; i++) {
    const thisLevel = new Array(Math.pow(2, i));
    thisLevel.fill("");
    levels.push(thisLevel);
  }
  // Traverse
  dfsAddToLevel(node, 0, levels, true, levels.length, 0);
  return levels;
};
