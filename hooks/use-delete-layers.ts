import { useSelf, useMutation } from '~/liveblocks.config';

export const useDeleteLayers = () => {
  const self = useSelf((me) => me.presence.selection);
  const deleteLayers = useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get('layers');
      self?.forEach((layerId) => {
        liveLayers.delete(layerId);
      });
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [self]
  );

  return deleteLayers;
};
