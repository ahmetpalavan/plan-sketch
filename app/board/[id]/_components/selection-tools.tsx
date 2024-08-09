'use client';
import { Button } from '~/components/ui/button';
import { Hint } from '~/components/hint';
import { memo } from 'react';
import { useSelectionBound } from '~/hooks/use-selection-bound';
import { useMutation, useSelf } from '~/liveblocks.config';
import { Camera, Color, Layer } from '~/types/canvas';
import { ColorPicker } from './color-picker';
import { useDeleteLayers } from '~/hooks/use-delete-layers';
import { Trash2 } from 'lucide-react';
import { BringToFront, SendToBack } from 'lucide-react';
import { LiveMap, LiveObject } from '@liveblocks/client';

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(({ camera, setLastUsedColor }: SelectionToolsProps) => {
  const deleteLayers = useDeleteLayers();
  const self = useSelf((me) => me.presence.selection);
  const selectionBounds = useSelectionBound();

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const livelayers = storage.get('layers');
      setLastUsedColor(fill);
      self?.forEach((layerId) => {
        livelayers.get(layerId)?.set('fill', fill);
      });
    },
    [self, setLastUsedColor]
  );

  const moveToBack = useMutation(
    ({ storage }) => {
      const livelayers = storage.get('layerIds');
      const indices: number[] = [];

      const arr = livelayers.toArray();

      for (let i = 0; i < livelayers.length; i++) {
        if (self?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        livelayers.move(indices[i], 0);
      }
    },
    [self]
  );

  const moveToFront = useMutation(
    ({ storage }) => {
      const livelayers = storage.get('layerIds');
      const indices: number[] = [];

      const arr = livelayers.toImmutable();

      for (let i = 0; i < livelayers.length; i++) {
        if (self?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        livelayers.move(indices[i], livelayers.length - 1);
      }
    },
    [self]
  );

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x - camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className='absolute text-muted-foreground bg-white shadow-md p-1 flex rounded-md select-none'
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%)`,
      }}
    >
      <ColorPicker onColorChange={setFill} />
      <div className='flex flex-col gap-y-0.5'>
        <Hint label='Bring to front' side='top' sideOffset={3}>
          <Button onClick={moveToFront} variant='board' size='icon'>
            <BringToFront size={20} />
          </Button>
        </Hint>
        <Hint label='Send to back' side='bottom' sideOffset={3}>
          <Button onClick={moveToBack} variant='board' size='icon'>
            <SendToBack size={20} />
          </Button>
        </Hint>
      </div>
      <div className='flex items-center pl-2 ml-2 border-l border-muted-foreground'>
        <Hint label='Delete'>
          <Button variant='board' size='icon' onClick={deleteLayers}>
            <Trash2 size={20} />
          </Button>
        </Hint>
      </div>
    </div>
  );
});

SelectionTools.displayName = 'SelectionTools';
