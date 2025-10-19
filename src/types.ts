// src/types.ts
export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  isWall: boolean;
  isVisited: boolean; // For visualizing the algorithm
  isPath: boolean;    // For visualizing the shortest path
  distance: number;   // Distance from the start node
  previousNode: Node | null; // To reconstruct the path
}