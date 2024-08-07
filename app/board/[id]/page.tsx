import { Canvas } from './_components/canvas';
import { Room } from '~/components/room';
import { CanvasLoading } from './_components/canvas-loading';

interface Props {
  params: {
    id: string;
  };
}

const BoardIdPage = ({ params }: Props) => {
  return (
    <Room roomId={params.id} fallback={<CanvasLoading />}>
      <Canvas boardId={params.id} />
    </Room>
  );
};

export default BoardIdPage;
