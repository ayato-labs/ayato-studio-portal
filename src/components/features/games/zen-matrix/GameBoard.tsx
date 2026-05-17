'use client';

import React, { useRef, useEffect } from 'react';
import { CellState, Block } from '@/lib/games/zen-matrix/engine';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: CellState[][];
  onPlace: (block: Block, r: number, c: number) => void;
  activeBlocks: Block[];
}

export default function GameBoard({ board, onPlace }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDrop = (e: any) => {
      if (!boardRef.current) return;
      const { block, point } = e.detail;
      
      const rect = boardRef.current.getBoundingClientRect();
      const x = point.x - rect.left;
      const y = point.y - rect.top;

      // Check if drop is within board bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const cellSize = rect.width / board[0].length;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      // Call placement logic (adjustment might be needed based on block center/origin)
      // For now, assume drop point is the top-left of the block for simplicity
      // or adjust by half block size
      const adjRow = row - Math.floor(block.shape.length / 2);
      const adjCol = col - Math.floor(block.shape[0].length / 2);

      onPlace(block, adjRow, adjCol);
    };

    window.addEventListener('blockDrop', handleDrop);
    return () => window.removeEventListener('blockDrop', handleDrop);
  }, [board, onPlace]);

  return (
    <div 
      ref={boardRef}
      className="grid gap-1 p-4 bg-white rounded-2xl border border-blue-100 shadow-xl"
      style={{ 
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: '500px',
        aspectRatio: '1 / 1'
      }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={cn(
              "w-full h-full rounded-sm transition-all duration-300",
              cell === 'empty' ? "bg-slate-50 border border-slate-100" :
              cell === 'filled' ? "bg-blue-500 border border-blue-400 shadow-[0_4px_10px_rgba(59,130,246,0.3)]" :
              "bg-transparent opacity-5" // void
            )}
          >
            {cell === 'filled' && (
               <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent" />
            )}
          </div>
        ))
      ))}
    </div>
  );
}
