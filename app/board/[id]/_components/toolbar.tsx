import { Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo2 } from 'lucide-react';
import { CanvasMode, CanvasState, LayerType } from '~/types/canvas';
import { ToolButton } from './tool-button';

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({ canvasState, setCanvasState, undo, redo, canUndo, canRedo }: ToolbarProps) => {
  return (
    <div className='absolute top-1/2 transform -translate-y-1/2 left-2 flex flex-col gap-y-4'>
      <div className='dark:bg-gray-800 bg-white rounded-md shadow-lg p-2 flex gap-y-1 flex-col items-center'>
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
          label='Select'
          icon={MousePointer2}
        />
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text })}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
          label='Text'
          icon={Type}
        />
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note })}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
          label='Sticky Note'
          icon={StickyNote}
        />
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Rectangle })}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
          label='Rectangle'
          icon={Square}
        />
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Ellipse })}
          isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
          label='Sticky Note'
          icon={Circle}
        />
        <ToolButton
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          isActive={canvasState.mode === CanvasMode.Pencil}
          label='Pencil'
          icon={Pen}
        />
      </div>
      <div className='dark:bg-gray-800 bg-white rounded-md shadow-lg p-2 flex gap-y-1 flex-col items-center'>
        <ToolButton label='Undo' icon={Undo2} onClick={undo} isDisabled={!canUndo} />
        <ToolButton label='Redo' icon={Redo2} onClick={redo} isDisabled={!canRedo} />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return <div className='absolute bg-white shadow-lg h-[360px] w-[52px] top-1/2 transform -translate-y-1/2 left-2 flex flex-col gap-y-4' />;
};
