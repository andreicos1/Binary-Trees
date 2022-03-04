export interface NodeBox {
  box: HTMLDivElement;
  order: number;
}

export const MAX_TREE_LEVELS = 4;

// for animation speed slide
export const ANIMATION_MULTIPLIER = 70;
export const ANIMATION_SLIDER_MODIFIER = 15; // unit to turn slider value to duration

export interface Spring {
  type: string;
  duration: number;
}

export interface nodeData {
  index: number;
  element: HTMLDivElement;
}
