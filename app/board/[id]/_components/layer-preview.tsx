'use client';
import { memo } from 'react';
import { useStorage } from '~/liveblocks.config';
import { LayerType } from '~/types/canvas';
import { Rectangle } from './rectangle';
import { Ellipse } from './ellipse';
import { Text } from './text';
import { Note } from './note';
import { Path } from './path';
import { colorToCss } from '~/lib/utils';

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
    case LayerType.Path:
      return (
        <Path
          key={id}
          points={layer.points}
          onPointerDown={(e) => onLayerPointDown(e, id)}
          stroke={selectionColor}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : 'red'}
        />
      );
    case LayerType.Ellipse:
      return <Ellipse id={id} layer={layer} onLayerPointDown={onLayerPointDown} selectionColor={selectionColor} />;
    case LayerType.Note:
      return <Note id={id} layer={layer} onLayerPointDown={onLayerPointDown} selectionColor={selectionColor} />;
    case LayerType.Text:
      return <Text id={id} layer={layer} onLayerPointDown={onLayerPointDown} selectionColor={selectionColor} />;
    case LayerType.Rectangle:
      return <Rectangle id={id} onLayerPointDown={onLayerPointDown} layer={layer} selectionColor={selectionColor} />;
    default:
      console.warn('Unknown layer type', layer);
      return null;
  }
});

LayerPreview.displayName = 'LayerPreview';
