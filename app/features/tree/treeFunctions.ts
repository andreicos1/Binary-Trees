import { TreeState } from "./treeSlice";
export const NUMBER_OF_LEVELS = parseInt(process.env.NEXT_PUBLIC_MAX_TREE_LEVELS as string);
const MAX_VALUE = 99;

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

export const getNodesByLevel = (node: TreeState): string[][] => {
  // Add the nodes to an array for easy rendering
  // Initialize as empty strings for all rows & cols
  const levels = new Array<Array<string>>();
  for (let i = 0; i < NUMBER_OF_LEVELS; i++) {
    const thisLevel = new Array(Math.pow(2, i));
    thisLevel.fill("");
    levels.push(thisLevel);
  }
  // Traverse
  dfsAddToLevel(node, 0, levels, true, levels.length, 0);
  return levels;
};

interface coordinates {
  rowIndex: number;
  columnIndex: number;
}

export const getEmptyValidChildren = (root: TreeState): coordinates[] => {
  const positions = new Array<coordinates>();
  function dfsFindValidPositions(
    node: TreeState | undefined,
    level: number,
    parentColumn: number,
    directionLeft: boolean
  ): void {
    if (level === NUMBER_OF_LEVELS) {
      return;
    }
    let column = parentColumn * 2;
    if (!directionLeft) {
      column++;
    }
    if (!node) {
      positions.push({
        rowIndex: level,
        columnIndex: column,
      });
      return;
    }
    dfsFindValidPositions(node.left, level + 1, column, true);
    dfsFindValidPositions(node.right, level + 1, column, false);
  }
  dfsFindValidPositions(root, 0, 0, true);
  return positions;
};

export const getHighestValidParent = (possibleNewChildrenPositions: coordinates[]): number => {
  let highestValidParent = NUMBER_OF_LEVELS;
  possibleNewChildrenPositions.forEach((position) => {
    highestValidParent = Math.min(highestValidParent, position.rowIndex - 1);
  });
  return highestValidParent;
};

export const getIndexFromLevelAndCol = (level: number, column: number): number => {
  return Math.pow(2, level) - 1 + column;
};

export const getRowAndColFromIndex = (index: number): [number, number] => {
  const rowIndex = Math.floor(Math.log2(index + 1));
  const colIndex = index - Math.pow(2, rowIndex) + 1;
  return [rowIndex, colIndex];
};

export const euclideanDistance = (
  node1x: number,
  node1y: number,
  node2x: number,
  node2y: number
): number => {
  return Math.sqrt(Math.pow(node1x - node2x, 2) + Math.pow(node1y - node2y, 2));
};

const generateRandomValue = () => {
  return Math.floor(Math.random() * (MAX_VALUE + 1));
};

export const generateRandomNode = () => {
  return {
    value: generateRandomValue().toString(),
  } as TreeState;
};
