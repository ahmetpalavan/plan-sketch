import { shallow } from '@liveblocks/client';
import { Layer, XYWH } from '~/types/canvas';
import { useStorage, useSelf } from '~/liveblocks.config';

const boundingBox = (layers: Layer[]): XYWH | null => {
  const first = layers[0];

  if (!first) {
    return null;
  }

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (x < left) {
      left = x;
    }

    if (y < top) {
      top = y;
    }

    if (x + width > right) {
      right = x + width;
    }

    if (y + height > bottom) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBound = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useStorage((state) => {
    const selectedLayers = selection?.map((id) => state.layers.get(id)!).filter(Boolean) as Layer[];

    return boundingBox(selectedLayers);
  }, shallow);
};
