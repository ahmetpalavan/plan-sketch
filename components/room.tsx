'use client';

import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { ClientSideSuspense } from '@liveblocks/react';
import { RoomProvider } from '@liveblocks/react';
import { ReactNode } from 'react';
import { LiveblocksProvider } from '~/liveblocks.config';
import { Layer } from '~/types/canvas';

interface Props {
  children: ReactNode;
  roomId: string;
  fallback?: NonNullable<ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: Props) => {
  return (
    <LiveblocksProvider>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={fallback}>{() => children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
