import { WritableDraft } from "immer/dist/internal";
import { MutableRefObject } from "react";
import deleteNode from "../../algorithms/deleteNode";
import { MAX_TREE_LEVELS } from "../../constants";
import { AppDispatch } from "../../store";
import { editNodeValue, TreeState } from "./treeSlice";
import { toggleEdit, treeUpdate } from "./treeUpdateSlice";
const MAX_VALUE = 99; // maximum numeric value of a node

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
  for (let i = 0; i < MAX_TREE_LEVELS; i++) {
    const thisLevel = new Array(Math.pow(2, i));
    thisLevel.fill("");
    levels.push(thisLevel);
  }
  // Traverse
  dfsAddToLevel(node, 0, levels, true, levels.length, 0);
  return levels;
};
export interface coordinates {
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
    if (level === MAX_TREE_LEVELS) {
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
  let highestValidParent = MAX_TREE_LEVELS;
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

export const getDirectionsFromRowAndCol = (row: number, col: number): Array<number> => {
  // Init a node of directions from root to child
  const directions = new Array<number>();
  // 1 = isLeft, 0 = isRight
  for (let currentRowIndex = 0; currentRowIndex < row; currentRowIndex++) {
    // Check if left (even col index) or right (odd col index) child
    directions.unshift(col % 2 === 0 ? 1 : 0);
    col >>= 1;
  }
  return directions;
};

const getTreeChildFromDirection = (
  directions: number[],
  stateReference: WritableDraft<TreeState>
): WritableDraft<TreeState> => {
  for (const direction of directions) {
    if (!stateReference) {
      return stateReference;
    }
    if (direction === 1) {
      stateReference = stateReference.left!;
    } else {
      stateReference = stateReference.right!;
    }
  }
  return stateReference;
};

export const getParentTreeFromRowAndCol = (
  state: WritableDraft<TreeState>,
  row: number,
  col: number
): WritableDraft<TreeState> => {
  const directions = getDirectionsFromRowAndCol(row, col);
  // Use the directions to modify a copy to reference of state's proxy
  let stateReference = state;
  return getTreeChildFromDirection(directions.slice(0, -1), stateReference);
};

export const getTreeFromRowAndCol = (
  state: WritableDraft<TreeState>,
  row: number,
  col: number
): WritableDraft<TreeState> => {
  const directions = getDirectionsFromRowAndCol(row, col);
  // Use the directions to modify a copy to reference of state's proxy
  let stateReference = state;
  return getTreeChildFromDirection(directions, stateReference);
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

export const processNode = (
  treeUpdate: treeUpdate,
  index: number,
  nodeBoxesRef: MutableRefObject<HTMLDivElement[]>,
  dispatch: AppDispatch,
  rowIndex: number,
  colIndex: number
) => {
  if (treeUpdate.adding || treeUpdate.isPlaying) {
    return;
  }
  if (treeUpdate.deleting) {
    deleteNode(index, nodeBoxesRef, dispatch, treeUpdate.displayRootDeleteError);
  } else if (treeUpdate.editing) {
    dispatch(toggleEdit());
    dispatch(editNodeValue({ rowIndex, colIndex }));
  }
};

export const colIndexToGridColMultiplier = (colIndex: number, rowIndex: number) => {
  return Math.pow(2, MAX_TREE_LEVELS - rowIndex - 1) * (2 * colIndex + 1);
};

export const invert = (state: WritableDraft<TreeState> | undefined) => {
  if (!state) return;
  [state.left, state.right] = [state.right, state.left];
  invert(state.left);
  invert(state.right);
};
