// src/App.tsx
import { useState, useEffect } from 'react';
import { Node } from './types';

// Define the dimensions of the grid
const GRID_ROWS = 20;
const GRID_COLS = 50;

// Define the position of the start and finish nodes
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

function App() {
  const [grid, setGrid] = useState<Node[][]>([]);

  // This effect runs once when the component mounts to create the initial grid
  useEffect(() => {
    const initialGrid = createInitialGrid();
    setGrid(initialGrid);
  }, []);

  // Creates the main 2D array of nodes
  const createInitialGrid = (): Node[][] => {
    const grid: Node[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Creates a single node object with default values
  const createNode = (row: number, col: number): Node => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    };
  };

  // We'll add the rendering logic here
  return <div>Grid will be rendered here</div>;
}

export default App;