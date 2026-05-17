'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CellState, Block, canPlaceBlock } from '@/lib/games/zen-matrix/engine';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: CellState[][];
  onPlace: (block: Block, r: number, c: number) => void;
  activeBlocks: Block[];
}

export default function GameBoard({ board, onPlace }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{ row: number, col: number, block: Block } | null>(null);

  useEffect(() => {
    const handleDragMove = (e: any) => {
      if (!boardRef.current) return;
      const { block, rect: blockRect } = e.detail;
      
      const boardRect = boardRef.current.getBoundingClientRect();
      const cellSize = boardRect.width / board[0].length;

      // Determine scale based on window width (rough mobile check matching our CSS breakpoint)
      const isMobile = window.innerWidth < 1024;
      
      // Base cell sizes in the palette
      const baseCellSize = isMobile ? 16 : 24;
      const dragScale = isMobile ? 2.0 : 1.5;
      
      const scaledCellSize = baseCellSize * dragScale;

      const anchorX = blockRect.left + (scaledCellSize / 2);
      const anchorY = blockRect.top + (scaledCellSize / 2);

      const x = anchorX - boardRect.left;
      const y = anchorY - boardRect.top;

      // Check if the top-left anchor is within the board bounds
      if (x < 0 || x > boardRect.width || y < 0 || y > boardRect.height) {
        setPreview(null);
        return;
      }

      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      setPreview({ row, col, block });
    };

    const handleDrop = (e: any) => {
      if (!boardRef.current) return;
      const { block, rect: blockRect } = e.detail;
      
      const boardRect = boardRef.current.getBoundingClientRect();
      const cellSize = boardRect.width / board[0].length;
      const isMobile = window.innerWidth < 1024;
      const baseCellSize = isMobile ? 16 : 24;
      const dragScale = isMobile ? 2.0 : 1.5;
      const scaledCellSize = baseCellSize * dragScale;
      const anchorX = blockRect.left + (scaledCellSize / 2);
      const anchorY = blockRect.top + (scaledCellSize / 2);
      const x = anchorX - boardRect.left;
      const y = anchorY - boardRect.top;

      setPreview(null); // Clear preview on drop

      if (x < 0 || x > boardRect.width || y < 0 || y > boardRect.height) return;

      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      onPlace(block, row, col);
    };

    window.addEventListener('blockDragMove', handleDragMove);
    window.addEventListener('blockDrop', handleDrop);
    return () => {
      window.removeEventListener('blockDragMove', handleDragMove);
      window.removeEventListener('blockDrop', handleDrop);
    };
  }, [board, onPlace]);

  const isValidPlacement = preview ? canPlaceBlock(board, preview.block, preview.row, preview.col) : false;

  return (
    <div 
      ref={boardRef}
      className="grid gap-1 p-4 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl"
      style={{ 
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))`,
        width: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => {
          let isPreview = false;

          if (preview && preview.block) {
            const { row: pr, col: pc, block } = preview;
            const br = r - pr;
            const bc = c - pc;
            if (br >= 0 && br < block.shape.length && bc >= 0 && bc < block.shape[0].length) {
              if (block.shape[br][bc] === 1) {
                isPreview = true;
              }
            }
          }

          return (
            <div
              key={`${r}-${c}`}
              className={cn(
                "w-full h-full rounded-sm transition-all duration-200",
                cell === 'empty' 
                  ? (isPreview 
                      ? (isValidPlacement 
                          ? "bg-blue-500/30 border border-blue-500 shadow-[0_0_10px_#3b82f6]" // Valid: Blue
                          : "bg-red-500/30 border border-red-500 shadow-[0_0_10px_#ef4444]"   // Invalid: Red
                        )
                      : "bg-slate-800 border border-slate-700"
                    )
                  : cell === 'filled' 
                    ? "bg-blue-600 border border-blue-500 shadow-[0_4px_10px_rgba(59,130,246,0.3)]" 
                    : "bg-slate-950 border-none" // void
              )}
            >
              {cell === 'filled' && (
                 <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent" />
              )}
              {cell === 'empty' && isPreview && (
                 <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
              )}
            </div>
          );
        })
      ))}
    </div>
  );
}
