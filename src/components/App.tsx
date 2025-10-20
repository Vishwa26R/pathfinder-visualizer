// src/components/App.tsx
import { useState, useEffect } from 'react';
import type { Node } from '../types'; // This path assumes types.ts is in the src/ folder

// --- Constants (defined outside the component) ---
const GRID_ROWS = 20;
const GRID_COLS = 50;
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

// --- Helper function to create a single node ---
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

// --- Helper function to create the initial grid ---
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


// --- The Main App Component ---
function App() {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);

  // This effect runs once when the component mounts to create the grid
  useEffect(() => {
    const initialGrid = createInitialGrid();
    setGrid(initialGrid);
  }, []);

  // --- Mouse Event Handlers ---

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  // Helper function to update the grid immutably
  const getNewGridWithWallToggled = (
    currentGrid: Node[][],
    row: number,
    col: number
  ): Node[][] => {
    // Return the original grid if trying to toggle start/finish nodes
    if (currentGrid[row][col].isStart || currentGrid[row][col].isFinish) {
      return currentGrid;
    }
    const newGrid = currentGrid.map(gridRow => [...gridRow]); // Create a new grid
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  // --- Rendering Logic (JSX) ---
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      onMouseUp={handleMouseUp} // Stop drawing when mouse is released anywhere
    >
      <div className="grid grid-cols-[repeat(50,25px)]" onMouseLeave={handleMouseUp}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((node, nodeIndex) => {
              const { row, col, isStart, isFinish, isWall } = node;

              const extraClassName = isFinish
                ? 'bg-red-500'
                : isStart
                ? 'bg-green-500'
                : isWall
                ? 'bg-gray-800'
                : 'bg-white';

              return (
                <div
                  key={nodeIndex}
                  id={`node-${row}-${col}`}
                  className={`w-[25px] h-[25px] border border-gray-300 ${extraClassName}`}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
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