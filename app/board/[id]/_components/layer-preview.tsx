'use client';
import { memo } from 'react';
import { useStorage } from '~/liveblocks.config';
import { LayerType } from '~/types/canvas';
import { Rectangle } from './rectangle';

interface LayerPreviewProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(({ id, onLayerPointDown, selectionColor }: LayerPreviewProps) => {
  const layer = useStorage((state) => state.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Rectangle:
      return <Rectangle id={id} onLayerPointDown={onLayerPointDown} layer={layer} selectionColor={selectionColor} />;
    default:
      console.warn('Unknown layer type', layer);
      return null;
  }
});

LayerPreview.displayName = 'LayerPreview';
