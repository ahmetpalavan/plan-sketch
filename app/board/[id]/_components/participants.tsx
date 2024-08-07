import { ModeToggle } from '~/components/theme';
import { connectionIdColor } from '~/lib/utils';
import { useOthers, useSelf } from '~/liveblocks.config';
import { UserAvatar } from './user-avatar';

const MAX_PARTICIPANTS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUser = users.length > MAX_PARTICIPANTS;

  return (
    <div className='absolute h-12 top-2 right-2 gap-x-2 rounded-lg p-4 flex items-center shadow-lg'>
      <ModeToggle />
      <div className='flex gap-x-2'>
        {users.slice(0, MAX_PARTICIPANTS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              borderColor={connectionIdColor(connectionId)}
              fallback={info?.name?.[0] || 'T'}
            />
          );
        })}

        {currentUser && (
          <UserAvatar
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            borderColor={connectionIdColor(currentUser.connectionId)}
            fallback={currentUser.info?.name?.[0] || 'T'}
          />
        )}

        {hasMoreUser && <UserAvatar fallback={`+${users.length - MAX_PARTICIPANTS}`} borderColor={connectionIdColor(users.length)} />}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return <div className='absolute h-12 top-2 right-2 bg-emerald-50/25 w-[100px] rounded-lg p-4 flex items-center shadow-lg' />;
};
