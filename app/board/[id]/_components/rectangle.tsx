import { colorToCss } from '~/lib/utils';
import { RectangleLayer } from '~/types/canvas';

interface RectangleProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, id: string) => void;
  layer: RectangleLayer;
  selectionColor?: string;
}

export const Rectangle = ({ id, onLayerPointDown, layer, selectionColor }: RectangleProps) => {
  const { x, y, width, height, fill } = layer;
  return (
    <rect
      className='drop-shadow-md shadow-lg'
      x={0}
      y={0}
      width={width}
      height={height}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      strokeWidth={1}
      stroke={selectionColor || 'transparent'}
      fill={fill ? colorToCss(fill) : 'transparent'}
      onPointerDown={(e) => onLayerPointDown(e, id)}
    />
  );
};
