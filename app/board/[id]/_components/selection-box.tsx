'use client';

import { memo } from 'react';
import { useSelectionBound } from '~/hooks/use-selection-bound';
import { useSelf, useStorage } from '~/liveblocks.config';
import { LayerType, Side, XYWH } from '~/types/canvas';

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: SelectionBoxProps) => {
  const soleLayerId = useSelf((me) => (me.presence.selection.length === 1 ? me.presence.selection[0] : null));
  const isShowingHandles = useStorage((state) => soleLayerId && state.layers.get(soleLayerId)?.type !== LayerType.Path);
  console.log('🚀 ~ SelectionBox ~ isShowingHandles:', isShowingHandles);
  const bounds = useSelectionBound();

  if (!bounds) {
    return null;
  }

  return (
    <>
      <rect
        className='fill-transparent stroke-blue-500 stroke-1 pointer-events-none'
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandles && (
        <>
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              cursor: 'nwse-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              cursor: 'nesw-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
              cursor: 'nesw-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
              cursor: 'nwse-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              cursor: 'ns-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
              cursor: 'ns-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
              cursor: 'ew-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
          <rect
            className='fill-white stroke-blue-500 stroke-1 pointer-events-auto'
            style={{
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
              cursor: 'ew-resize',
            }}
            x={0}
            y={0}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
          />
        </>
      )}
    </>
  );
});

SelectionBox.displayName = 'SelectionBox';
