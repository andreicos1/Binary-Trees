export interface NodeBox {
  box: HTMLDivElement;
  order: number;
}

export interface Spring {
  type: string;
  duration: number;
}

export interface nodeData {
  index: number;
  element: HTMLDivElement;
}

export interface uiRepresentation {
  rowIndex: number;
  colIndex: number;
}
