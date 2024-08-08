import { colorToCss } from '~/lib/utils';
import { EllipseLayer } from '~/types/canvas';

interface EllipseProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  layer: EllipseLayer;
  selectionColor?: string;
}

export const Ellipse = ({ id, onLayerPointDown, layer, selectionColor }: EllipseProps) => {
  return (
    <ellipse
      cx={layer.width / 2}
      cy={layer.height / 2}
      rx={layer.width / 2}
      ry={layer.height / 2}
      fill={layer.fill ? colorToCss(layer.fill) : '#000'}
      onPointerDown={(e) => onLayerPointDown(e, id)}
      style={{
        transform: `translate(${layer.x}px, ${layer.y}px)`,
      }}
      strokeWidth={1}
    />
  );
};
