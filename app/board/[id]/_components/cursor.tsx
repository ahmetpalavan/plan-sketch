'use client';

import { MousePointer2 } from 'lucide-react';
import { memo } from 'react';
import { connectionIdColor } from '~/lib/utils';
import { useOther } from '~/liveblocks.config';

interface CursorProps {
  connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, (user) => user.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  console.log({ cursor, info });

  const name = info?.name || 'Teammate';

  if (!cursor) return null;
  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 24}
      className='relative drop-shadow-md'
    >
      <MousePointer2 className='h-5 w-5' style={{ color: connectionIdColor(connectionId), fill: connectionIdColor(connectionId) }} />
      <div
        style={{ backgroundColor: connectionIdColor(connectionId) }}
        className='absolute px-1.5 py-0.5 left-5 rounded-md flex text-xs items-center shadow-md'
      >
        {name}
      </div>
    </foreignObject>
  );
});
