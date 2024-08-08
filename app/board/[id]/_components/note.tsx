import { Merriweather } from 'next/font/google';
import { useCallback } from 'react';
import ContendEditable, { ContentEditableEvent } from 'react-contenteditable';
import { cn, colorToCss, getContrastingTextColor } from '~/lib/utils';
import { useMutation } from '~/liveblocks.config';
import { NoteLayer, TextLayer } from '~/types/canvas';

const font = Merriweather({
  subsets: ['latin'],
  weight: ['700'],
});

interface NoteProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  layer: NoteLayer;
  selectionColor?: string;
}

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;
  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

export const Note = ({ id, onLayerPointDown, layer, selectionColor }: NoteProps) => {
  const { height, width, x, y, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const layers = storage.get('layers');

    layers.get(id)?.set('value', newValue);
  }, []);

  const handleTextChange = useCallback(
    (e: ContentEditableEvent) => {
      updateValue(e.target.value);
    },
    [updateValue]
  );

  return (
    <foreignObject
      onPointerDown={(e) => onLayerPointDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
        backgroundColor: fill ? colorToCss(fill) : '#f9f9f9',
      }}
      className='shadow-md drop-shadow-md'
      x={x}
      y={y}
      width={width}
      height={height}
    >
      <ContendEditable
        onChange={handleTextChange}
        html={value || 'Text'}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : 'black',
        }}
        className={cn('h-full w-full flex items-center justify-center text-center outline-none', font.className)}
      />
    </foreignObject>
  );
};
