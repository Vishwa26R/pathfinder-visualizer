// src/components/App.tsx
import { useState, useEffect } from 'react';
import type { Node } from '../types'; // This path assumes types.ts is in the src/ folder
import { dijkstra } from '../algorithms/dijkstra';

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
  const visualizeDijkstra = () => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    
    // This runs the algorithm and gets the ordered list of visited nodes
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    // This gets the shortest path by backtracking from the finish node
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  const handleClearBoard = () => {
  // Clear all animations
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => {
    if (!node.classList.contains('node-start') && !node.classList.contains('node-finish')) {
      node.className = 'w-[25px] h-[25px] border border-gray-300 bg-white';
    }
  });
  // Create a fresh, new grid
  const newGrid = createInitialGrid();
  setGrid(newGrid);
};

  const animateDijkstra = (
  visitedNodesInOrder: Node[],
  nodesInShortestPathOrder: Node[]
) => {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    // When we've animated all the visited nodes, animate the shortest path
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }
    // Animate the visited nodes
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      // Directly manipulate the DOM for performance
      const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
      if (nodeElement) {
        // Add a 'node-visited' class unless it's a start/finish node
        if (!node.isStart && !node.isFinish) {
          nodeElement.className += ' node-visited';
        }
      }
    }, 10 * i);
  }
};

const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
      if (nodeElement) {
        // Add a 'node-shortest-path' class unless it's a start/finish node
        if (!node.isStart && !node.isFinish) {
          nodeElement.className += ' node-shortest-path';
        }
      }
    }, 50 * i);
  }
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called AFTER the dijkstra method has run.
const getNodesInShortestPathOrder = (finishNode: Node): Node[] => {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
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
      <div className="mb-4">
      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => visualizeDijkstra()}
      >
        Visualize Dijkstra's Algorithm
      </button>
      <button
    className="px-4 py-2 ml-4 font-bold text-white bg-red-500 rounded hover:bg-red-700"
    onClick={handleClearBoard}
  >
    Clear Board
  </button>
    </div>
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
                  className={`node w-[25px] h-[25px] border border-gray-300 ${extraClassName}`}
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