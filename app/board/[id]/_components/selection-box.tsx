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
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'nwse-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-red-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'nesw-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-red-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'nesw-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'nwse-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />

          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'ew-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'ew-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height - HANDLE_WIDTH}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'ns-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />
          <rect
            x={0}
            y={0}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              cursor: 'ns-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width - HANDLE_WIDTH}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
            }}
            className='stroke-1 dark:fill-white stroke-blue-500 fill-gray-500'
          />
        </>
      )}
    </>
  );
});

SelectionBox.displayName = 'SelectionBox';
