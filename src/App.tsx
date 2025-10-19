// src/App.tsx
import { useState, useEffect } from 'react';
import type { Node } from './types';

// Define the dimensions of the grid
const GRID_ROWS = 20;
const GRID_COLS = 50;

// Define the position of the start and finish nodes
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

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

function App() {
  const [grid, setGrid] = useState<Node[][]>([]);

  // This effect runs once when the component mounts to create the initial grid
  useEffect(() => {
    const initialGrid = createInitialGrid();
    setGrid(initialGrid);
  }, []);

  // We'll add the rendering logic here
  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="grid grid-cols-[repeat(50,25px)]">
      {grid.map((row, rowIndex) => (
        // We need a key for the outer div as well
        <div key={rowIndex} className="flex">
          {row.map((node, nodeIndex) => {
            const { isStart, isFinish, isWall } = node;

            // Determine extra CSS classes based on the node's properties
            const extraClassName = isFinish
              ? 'bg-red-500'   // Finish node is red
              : isStart
              ? 'bg-green-500' // Start node is green
              : isWall
              ? 'bg-gray-800'  // Wall node is dark gray
              : 'bg-white';    // Default is white

            return (
              <div
                key={nodeIndex}
                // Use template literals to combine class names
                className={`w-[25px] h-[25px] border border-gray-300 ${extraClassName}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);
}

export default App;