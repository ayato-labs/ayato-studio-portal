'use client';

import React from 'react';
import { Block } from '@/lib/games/zen-matrix/engine';
import { motion } from 'framer-motion';

interface BlockPaletteProps {
  blocks: Block[];
}

export default function BlockPalette({ blocks }: BlockPaletteProps) {
  return (
    <div className="flex flex-col gap-12 items-center">
      {blocks.map((block) => (
        <div key={block.id} className="relative w-32 h-32 flex items-center justify-center">
          <DraggableBlock block={block} />
        </div>
      ))}
    </div>
  );
}

function DraggableBlock({ block }: { block: Block }) {
  return (
    <motion.div
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      onDragEnd={(event, info) => {
        // Emit custom event for GameBoard to handle
        const dropEvent = new CustomEvent('blockDrop', { 
          detail: { 
            block, 
            point: info.point 
          } 
        });
        window.dispatchEvent(dropEvent);
      }}
      className="grid gap-1 cursor-grab active:cursor-grabbing touch-none"
      style={{
        gridTemplateColumns: `repeat(${block.shape[0].length}, 24px)`,
        gridTemplateRows: `repeat(${block.shape.length}, 24px)`,
      }}
    >
      {block.shape.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="w-full h-full rounded-sm"
            style={{ 
              backgroundColor: cell === 1 ? block.color : 'transparent',
              boxShadow: cell === 1 ? `0 4px 10px ${block.color}44` : 'none',
              border: cell === 1 ? '1px solid rgba(255,255,255,0.3)' : 'none'
            }}
          />
        ))
      ))}
    </motion.div>
  );
}
