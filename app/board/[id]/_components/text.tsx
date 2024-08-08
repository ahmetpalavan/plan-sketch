import { Merriweather } from 'next/font/google';
import { useCallback } from 'react';
import ContendEditable, { ContentEditableEvent } from 'react-contenteditable';
import { cn, colorToCss } from '~/lib/utils';
import { useMutation } from '~/liveblocks.config';
import { TextLayer } from '~/types/canvas';

const font = Merriweather({
  subsets: ['latin'],
  weight: ['700'],
});

interface TextProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  layer: TextLayer;
  selectionColor?: string;
}

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;
  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

export const Text = ({ id, onLayerPointDown, layer, selectionColor }: TextProps) => {
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
        outline: selectionColor ? `2px solid ${selectionColor}` : 'none',
      }}
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
          color: fill ? colorToCss(fill) : 'black',
        }}
        className={cn('h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none', font.className)}
      />
    </foreignObject>
  );
};
